import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is authenticated
  if (token) {
    // Prevent authenticated users from accessing auth-related pages
    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/"
    ) {
      if (url.pathname !== "/dashboard") {
        // Redirect to the dashboard only if not already on /dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // If the user is not authenticated
  if (!token) {
    // Redirect unauthenticated users away from protected routes
    if (url.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Allow access to other routes
  return NextResponse.next();
}
