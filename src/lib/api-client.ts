import { z } from "zod";

const API_PROXY_PREFIX = "/api/backend";
const ACTIVE_BUSINESS_KEY = "aibos_active_business_id";
const CLIENT_REQUEST_TIMEOUT_MS = 15_000;

export interface ApiErrorPayload {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  requestId?: string;
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fieldErrors?: Record<string, string>;
  readonly requestId?: string;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code;
    this.fieldErrors = payload.fieldErrors;
    this.requestId = payload.requestId;
  }
}

const backendUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  mobile: z.string().nullable().optional(),
  status: z.enum(["active", "unverified", "suspended"]),
  verifiedAt: z.string().nullable().optional(),
  emailVerifiedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const membershipSchema = z.object({
  businessId: z.string().min(1),
  businessName: z.string().min(1),
  role: z.enum(["owner", "staff", "admin"]),
  status: z.enum(["active", "invited", "suspended"]),
});

const meResponseSchema = z.object({
  user: backendUserSchema,
  memberships: z.array(membershipSchema),
});

const businessSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  legalName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  timezone: z.string().min(1),
  currency: z.string().min(1),
  invoicePrefix: z.string(),
  invoiceSequence: z.number().int().nonnegative(),
  status: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const memberSchema = z.object({
  id: z.string().min(1),
  businessId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["owner", "staff", "admin"]),
  status: z.enum(["active", "invited", "suspended"]),
  invitedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    id: z.string().min(1),
    email: z.string().email(),
    fullName: z.string().min(1),
    status: z.string().min(1),
  }),
});

const messageSchema = z.object({ message: z.string().optional() });
const emptyResponseSchema = z.unknown();

export type BackendUser = z.infer<typeof backendUserSchema>;
export type UserBusinessMembership = z.infer<typeof membershipSchema>;
export type MeResponseData = z.infer<typeof meResponseSchema>;
export type BusinessData = z.infer<typeof businessSchema>;
export type MemberDetail = z.infer<typeof memberSchema>;

/** Authentication results deliberately never contain browser-readable tokens. */
export interface AuthResponseData {
  tokenType?: string;
  expiresIn?: number;
  user?: BackendUser;
}

export interface CreateBusinessInput {
  name: string;
  legalName?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  currency?: string;
  invoicePrefix?: string;
}

export interface UpdateBusinessInput {
  name?: string;
  legalName?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  invoicePrefix?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function responseData(value: unknown): unknown {
  return isRecord(value) && "data" in value ? value.data : value;
}

function normaliseErrorPayload(value: unknown, status: number): ApiErrorPayload {
  const candidate = isRecord(value) && isRecord(value.error) ? value.error : value;
  const fieldErrors =
    isRecord(candidate) && isRecord(candidate.fieldErrors)
      ? Object.fromEntries(
          Object.entries(candidate.fieldErrors).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string"
          )
        )
      : undefined;

  return {
    code:
      isRecord(candidate) && typeof candidate.code === "string"
        ? candidate.code
        : status === 0
          ? "network_error"
          : "request_failed",
    message:
      isRecord(candidate) && typeof candidate.message === "string"
        ? candidate.message
        : status === 0
          ? "We could not reach the service. Check your connection and try again."
          : "We could not complete that request. Please try again.",
    fieldErrors,
    requestId:
      isRecord(candidate) && typeof candidate.requestId === "string"
        ? candidate.requestId
        : undefined,
  };
}

function requestId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readJson(text: string): unknown {
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit,
  schema: z.ZodType<T>
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), CLIENT_REQUEST_TIMEOUT_MS);
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");
  headers.set("X-Request-ID", requestId());

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const activeBusinessId = getStoredActiveBusinessId();
  if (activeBusinessId && !headers.has("X-Business-ID")) {
    headers.set("X-Business-ID", activeBusinessId);
  }

  try {
    const response = await fetch(`${API_PROXY_PREFIX}${path}`, {
      ...options,
      headers,
      credentials: "same-origin",
      signal: controller.signal,
    });
    const json = readJson(await response.text());

    if (!response.ok) {
      throw new ApiError(response.status, normaliseErrorPayload(json, response.status));
    }

    const parsed = schema.safeParse(responseData(json));
    if (!parsed.success) {
      throw new ApiError(response.status, {
        code: "invalid_response",
        message: "The service returned an unexpected response. Please try again.",
        requestId: response.headers.get("X-Request-ID") ?? undefined,
      });
    }

    return parsed.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(0, normaliseErrorPayload(null, 0));
  } finally {
    window.clearTimeout(timeout);
  }
}

/** The selected tenant is UI context only; the backend must verify membership. */
export function getStoredActiveBusinessId(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(ACTIVE_BUSINESS_KEY);
}

export function setStoredActiveBusinessId(businessId: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ACTIVE_BUSINESS_KEY, businessId);
}

export function clearStoredActiveBusinessId() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ACTIVE_BUSINESS_KEY);
}

export const apiClient = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      fullName: string;
      mobile?: string;
      businessName?: string;
    }): Promise<AuthResponseData> =>
      request("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }, z.object({
        tokenType: z.string().optional(),
        expiresIn: z.number().optional(),
        user: backendUserSchema.optional(),
      })),

    login: (data: { email: string; password: string }): Promise<AuthResponseData> =>
      request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }, z.object({
        tokenType: z.string().optional(),
        expiresIn: z.number().optional(),
        user: backendUserSchema.optional(),
      })),

    logout: (): Promise<void> =>
      request("/api/v1/auth/logout", { method: "POST" }, emptyResponseSchema).then(() => undefined),

    getMe: (): Promise<MeResponseData> => request("/api/v1/me", {}, meResponseSchema),

    verifyEmail: (token: string): Promise<{ message?: string }> =>
      request("/api/v1/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      }, messageSchema),

    forgotPassword: (email: string): Promise<{ message?: string }> =>
      request("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }, messageSchema),

    resetPassword: (data: { token: string; newPassword: string }): Promise<{ message?: string }> =>
      request("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      }, messageSchema),
  },

  businesses: {
    list: (): Promise<UserBusinessMembership[]> =>
      request("/api/v1/businesses", {}, z.array(membershipSchema)),
    get: (businessId: string): Promise<BusinessData> =>
      request(`/api/v1/businesses/${encodeURIComponent(businessId)}`, {}, businessSchema),
    create: (data: CreateBusinessInput): Promise<BusinessData> =>
      request("/api/v1/businesses", {
        method: "POST",
        body: JSON.stringify(data),
      }, businessSchema),
    update: (businessId: string, data: UpdateBusinessInput): Promise<BusinessData> =>
      request(`/api/v1/businesses/${encodeURIComponent(businessId)}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }, businessSchema),
    listMembers: (businessId: string): Promise<MemberDetail[]> =>
      request(`/api/v1/businesses/${encodeURIComponent(businessId)}/members`, {}, z.array(memberSchema)),
    inviteMember: (
      businessId: string,
      data: { email: string; role: "owner" | "staff" | "admin" }
    ): Promise<MemberDetail> =>
      request(`/api/v1/businesses/${encodeURIComponent(businessId)}/invitations`, {
        method: "POST",
        body: JSON.stringify(data),
      }, memberSchema),
    updateMember: (
      businessId: string,
      memberId: string,
      data: { role?: "owner" | "staff" | "admin"; status?: "active" | "invited" | "suspended" }
    ): Promise<MemberDetail> =>
      request(
        `/api/v1/businesses/${encodeURIComponent(businessId)}/members/${encodeURIComponent(memberId)}`,
        { method: "PATCH", body: JSON.stringify(data) },
        memberSchema
      ),
    removeMember: (businessId: string, memberId: string): Promise<{ message?: string }> =>
      request(
        `/api/v1/businesses/${encodeURIComponent(businessId)}/members/${encodeURIComponent(memberId)}`,
        { method: "DELETE" },
        messageSchema
      ),
  },
};
