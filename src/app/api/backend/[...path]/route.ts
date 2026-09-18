import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ACCESS_TOKEN_COOKIE = "aibos_access_token";
const REFRESH_TOKEN_COOKIE = "aibos_refresh_token";
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REQUEST_BODY_BYTES = 1_048_576;
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const AUTH_EXCHANGE_PATHS = new Set([
  "api/v1/auth/login",
  "api/v1/auth/register",
  "api/v1/auth/refresh",
]);

type RouteContext = { params: Promise<{ path: string[] }> };
type TokenPair = { accessToken: string; refreshToken?: string; expiresIn?: number };

type BackendResponse = {
  body: unknown;
  headers: Headers;
  status: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapData(value: unknown): unknown {
  return isRecord(value) && "data" in value ? value.data : value;
}

function parseJson(text: string): unknown {
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function getBackendUrl(path: string, search: string): URL | null {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!configuredUrl) return null;

  try {
    const baseUrl = new URL(configuredUrl);
    if (process.env.NODE_ENV === "production" && baseUrl.protocol !== "https:") {
      return null;
    }

    const target = new URL(path, baseUrl.href.endsWith("/") ? baseUrl.href : `${baseUrl.href}/`);
    target.search = search;
    return target;
  } catch {
    return null;
  }
}

function isSafePath(path: string[]): boolean {
  return (
    path.length >= 3 &&
    path[0] === "api" &&
    path[1] === "v1" &&
    path.every(
      (segment) =>
        segment !== "." && segment !== ".." && /^[a-zA-Z0-9._-]{1,128}$/.test(segment)
    )
  );
}

function getRequestId(request: NextRequest): string {
  const incoming = request.headers.get("x-request-id");
  return incoming && /^[a-zA-Z0-9_-]{1,128}$/.test(incoming)
    ? incoming
    : crypto.randomUUID();
}

function jsonResponse(body: unknown, status: number, requestId: string): NextResponse {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie");
  response.headers.set("X-Request-ID", requestId);
  return response;
}

function publicError(status: number, requestId: string, value?: unknown): NextResponse {
  const error = isRecord(value) && isRecord(value.error) ? value.error : value;
  const rawCode = isRecord(error) && typeof error.code === "string" ? error.code : "request_failed";
  const fieldErrors =
    isRecord(error) && isRecord(error.fieldErrors)
      ? Object.fromEntries(
          Object.entries(error.fieldErrors).filter(
            (entry): entry is [string, string] =>
              typeof entry[1] === "string" && entry[0].length <= 128 && entry[1].length <= 500
          )
        )
      : undefined;

  const defaultMessage =
    status === 401
      ? "Your session has ended. Please sign in again."
      : status === 403
        ? "You do not have permission to perform that action."
        : status === 404
          ? "The requested record could not be found."
          : status === 409
            ? "A record with this identifier already exists."
            : status >= 500
              ? "The service is temporarily unavailable. Please try again."
              : "We could not complete that request. Please review the details and try again.";

  const message =
    isRecord(error) && typeof error.message === "string" && error.message.length > 0
      ? error.message
      : defaultMessage;

  return jsonResponse(
    { error: { code: rawCode.slice(0, 128), message, fieldErrors, requestId } },
    status,
    requestId
  );
}

function extractTokens(value: unknown): TokenPair | null {
  const data = unwrapData(value);
  if (!isRecord(data) || typeof data.accessToken !== "string" || !data.accessToken) {
    return null;
  }

  return {
    accessToken: data.accessToken,
    refreshToken: typeof data.refreshToken === "string" ? data.refreshToken : undefined,
    expiresIn:
      typeof data.expiresIn === "number" && Number.isFinite(data.expiresIn)
        ? Math.min(Math.max(Math.floor(data.expiresIn), 60), 86_400)
        : undefined,
  };
}

function stripTokens(value: unknown): unknown {
  const strip = (data: unknown) => {
    if (!isRecord(data)) return data;
    const copy = { ...data };
    delete (copy as { accessToken?: unknown }).accessToken;
    delete (copy as { refreshToken?: unknown }).refreshToken;
    return copy;
  };

  if (isRecord(value) && "data" in value) {
    return { ...value, data: strip(value.data) };
  }

  return strip(value);
}

function setSessionCookies(response: NextResponse, tokens: TokenPair) {
  const secure = process.env.NODE_ENV === "production";
  const sharedOptions = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure,
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...sharedOptions,
    maxAge: tokens.expiresIn ?? 900,
    priority: "high",
  });

  if (tokens.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      ...sharedOptions,
      maxAge: 60 * 60 * 24 * 7,
      priority: "high",
    });
  } else {
    response.cookies.set(REFRESH_TOKEN_COOKIE, "", { ...sharedOptions, maxAge: 0 });
  }
}

function clearSessionCookies(response: NextResponse) {
  const options = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", { ...options, maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", { ...options, maxAge: 0 });
}

function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return origin === request.nextUrl.origin;
}

function headersForBackend(
  request: NextRequest,
  requestId: string,
  accessToken?: string
): Headers {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  const businessId = request.headers.get("x-business-id");

  headers.set("Accept", accept?.includes("application/json") ? accept : "application/json");
  headers.set("X-Request-ID", requestId);

  if (contentType) headers.set("Content-Type", contentType);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (businessId && /^[a-zA-Z0-9_-]{1,128}$/.test(businessId)) {
    headers.set("X-Business-ID", businessId);
  }

  return headers;
}

async function readBody(request: NextRequest): Promise<ArrayBuffer | undefined> {
  if (!UNSAFE_METHODS.has(request.method) || !request.body) return undefined;

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BODY_BYTES) {
    throw new Error("payload_too_large");
  }

  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_REQUEST_BODY_BYTES) throw new Error("payload_too_large");
  return body;
}

async function fetchBackend(
  url: URL,
  request: NextRequest,
  requestId: string,
  body: BodyInit | undefined,
  accessToken?: string
): Promise<BackendResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: request.method,
      headers: headersForBackend(request, requestId, accessToken),
      body,
      cache: "no-store",
      redirect: "error",
      signal: controller.signal,
    });

    return {
      body: parseJson(await response.text()),
      headers: response.headers,
      status: response.status,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function refreshSession(requestId: string, refreshToken: string) {
  const refreshUrl = getBackendUrl("api/v1/auth/refresh", "");
  if (!refreshUrl) return null;

  const refreshRequest = new NextRequest(refreshUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  const response = await fetchBackend(
    refreshUrl,
    refreshRequest,
    requestId,
    new TextEncoder().encode(JSON.stringify({ refreshToken }))
  );

  return response.status >= 200 && response.status < 300 ? extractTokens(response.body) : null;
}

async function handle(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { path } = await context.params;
  const requestId = getRequestId(request);
  const routePath = path.join("/");

  if (!isSafePath(path)) {
    return publicError(404, requestId);
  }

  if (UNSAFE_METHODS.has(request.method) && !hasSameOrigin(request)) {
    return publicError(403, requestId, { error: { code: "invalid_origin" } });
  }

  let body: ArrayBuffer | undefined;
  try {
    body = await readBody(request);
  } catch {
    return publicError(413, requestId, { error: { code: "payload_too_large" } });
  }

  const targetUrl = getBackendUrl(routePath, request.nextUrl.search);
  if (!targetUrl) {
    return publicError(503, requestId, {
      code: "backend_not_configured",
      message: "Backend API URL is not configured. Please set NEXT_PUBLIC_API_URL in your server environment.",
    });
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  let backendResponse: BackendResponse;
  let refreshedTokens: TokenPair | null = null;

  try {
    backendResponse = await fetchBackend(targetUrl, request, requestId, body, accessToken);

    if (backendResponse.status === 401 && !AUTH_EXCHANGE_PATHS.has(routePath) && refreshToken) {
      refreshedTokens = await refreshSession(requestId, refreshToken);
      if (refreshedTokens) {
        backendResponse = await fetchBackend(
          targetUrl,
          request,
          requestId,
          body,
          refreshedTokens.accessToken
        );
      }
    }
  } catch {
    return publicError(502, requestId, {
      code: "backend_unreachable",
      message: "Unable to connect to the backend service. Please check your network or server status.",
    });
  }

  if (backendResponse.status < 200 || backendResponse.status >= 300) {
    const response = publicError(backendResponse.status, requestId, backendResponse.body);
    if (backendResponse.status === 401 || routePath === "api/v1/auth/logout") {
      clearSessionCookies(response);
    }
    return response;
  }

  const loginTokens = AUTH_EXCHANGE_PATHS.has(routePath) ? extractTokens(backendResponse.body) : null;
  const response = jsonResponse(
    loginTokens ? stripTokens(backendResponse.body) : backendResponse.body,
    backendResponse.status,
    backendResponse.headers.get("x-request-id") ?? requestId
  );

  if (loginTokens) setSessionCookies(response, loginTokens);
  if (refreshedTokens) setSessionCookies(response, refreshedTokens);
  if (routePath === "api/v1/auth/logout") clearSessionCookies(response);
  return response;
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
