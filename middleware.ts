import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ─────────────────────────────────────────────────────────────────
   NEXO Route Protection Middleware
   Two distinct auth contexts:
     USER  → /login  → / (member workspace)
     ADMIN → /admin/login → /admin (console)
───────────────────────────────────────────────────────────────── */

// Public pages — no session required
const USER_LOGIN_PAGE  = "/login";
const ADMIN_LOGIN_PAGE = "/admin/login";

// Unauthenticated users get blocked here
const USER_DEFAULT_REDIRECT  = "/";
const ADMIN_DEFAULT_REDIRECT = "/admin";

// Public API routes
const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/logout",   // logout should always work
  "/api/auth/me",       // used by login pages to check session
  "/api/seed-db",
  "/api/seed-ipos",
];

// Static asset extensions — always pass through
const STATIC_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".ico", ".webp", ".woff", ".woff2", ".css", ".js"];

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/fonts") ||
    STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext))
  );
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function safeInternalRedirect(raw: string | null, base: string): string {
  if (!raw) return base;
  try {
    const url = new URL(raw, "http://localhost");
    if (url.origin !== "http://localhost") return base;
    return url.pathname + url.search;
  } catch {
    return base;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Always pass static assets ───────────────────────────────
  if (isStaticAsset(pathname)) return NextResponse.next();

  // ── Block /register — admin-provisioned only ────────────────
  if (pathname === "/register") {
    return NextResponse.redirect(new URL(USER_LOGIN_PAGE, request.url));
  }

  const sessionCookie  = request.cookies.get("nexo_session");
  const isAuthenticated = Boolean(sessionCookie?.value);

  // ── Public API routes ────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    if (!isAuthenticated && !isPublicApi(pathname)) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // ── Admin routes (/admin, /admin/*) ─────────────────
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  // ── All other protected routes ────────────────────────────────
  if (!isAuthenticated && pathname !== USER_LOGIN_PAGE) {
    const loginUrl = new URL(USER_LOGIN_PAGE, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
