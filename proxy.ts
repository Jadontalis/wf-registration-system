import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/wfs-waiver"];
  
  // Allow NextAuth endpoints (public)
  // The folder structure suggests NextAuth is at /api/auth/auth
  const isAuthRoute = pathname.startsWith("/api/auth/auth");

  const isPublic = publicRoutes.includes(pathname) || isAuthRoute;

  if (!isLoggedIn && !isPublic) {
    // Return 401 for API routes
    if (pathname.startsWith("/api")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Redirect to sign-in for pages
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Include API routes in the matcher to ensure they are protected
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|fonts).*)"],
};
