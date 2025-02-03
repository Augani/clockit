import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";
import type { NextRequest } from "next/server";

const publicPages = ["/", "/login"];
const adminOnlyPages = ["/team", "/reports"];

// Create intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
});

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  function middleware(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
  }
);

// Add /logout to the public paths
export const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/logout",
];

export default async function middleware(req: NextRequest) {
  // Log all API requests
  if (req.nextUrl.pathname.startsWith("/api/")) {
    console.log("API Request:", {
      method: req.method,
      path: req.nextUrl.pathname,
      search: req.nextUrl.search,
    });
    return NextResponse.next();
  }

  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isPublicPage = publicPages.some((page) =>
    req.nextUrl.pathname.endsWith(page)
  );

  // Check if the requested page is admin-only
  const isAdminPage = adminOnlyPages.some((page) =>
    req.nextUrl.pathname.includes(page)
  );

  if (isAdminPage) {
    // If page requires admin access, check user role
    const userRole = token?.role as string;
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    if (!isAdmin) {
      // Redirect non-admin users to dashboard
      const locale = req.nextUrl.pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
  }

  if (isAuthPage) {
    console.log("isAuthPage", isAuthPage);
    if (isAuth) {
      // If user is authenticated and tries to access login page,
      // redirect to dashboard
      const locale = req.nextUrl.pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
    // Allow access to login page if not authenticated
    return intlMiddleware(req);
  }

  if (isPublicPage) {
    // Allow access to public pages
    return intlMiddleware(req);
  }

  // Use auth middleware for all other pages
  return (authMiddleware as unknown as (req: NextRequest) => Promise<Response>)(
    req
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
