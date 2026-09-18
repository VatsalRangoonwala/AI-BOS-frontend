import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/products",
  "/inventory",
  "/invoices",
  "/orders",
  "/payments",
  "/payment-reminders",
  "/customers",
  "/analytics",
  "/ai-assistant",
  "/assistant",
  "/settings",
  "/subscription",
  "/admin",
  "/notifications",
  "/help",
  "/onboarding",
];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const ACCOUNT_ROUTES = [...AUTH_ROUTES, "/verify-email", "/verify-otp"];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function securityHeaders(response: NextResponse) {
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return response;
}

function cspHeader(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === "development";
  return `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDevelopment ? "" : "upgrade-insecure-requests;"}
  `
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Proxy performs optimistic route gating and adds strict CSP nonces. The API
 * remains the source of truth for authentication and authorization.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has("aibos_access_token") || request.cookies.has("aibos_refresh_token");
  const isProtected = matchesRoute(pathname, PROTECTED_PREFIXES);
  const isAuthRoute = matchesRoute(pathname, AUTH_ROUTES);
  const isAccountRoute = matchesRoute(pathname, ACCOUNT_ROUTES);

  if (isProtected && !hasSession) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", `${pathname}${search}`);
    return securityHeaders(NextResponse.redirect(redirectUrl));
  }

  if (isAuthRoute && hasSession) {
    return securityHeaders(NextResponse.redirect(new URL("/dashboard", request.url)));
  }

  // Private and account routes are deliberately dynamic so Next can attach the
  // one-time nonce to framework scripts and inline styles during rendering.
  if (isProtected || isAccountRoute) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const contentSecurityPolicy = cspHeader(nonce);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", contentSecurityPolicy);
    return securityHeaders(response);
  }

  return securityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
