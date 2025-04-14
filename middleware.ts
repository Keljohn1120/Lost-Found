import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/search" ||
    path === "/about" ||
    path.startsWith("/api/") // API routes have their own auth

  // Define user paths that require authentication
  const isUserPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/my-reports") ||
    path.startsWith("/report-item") ||
    path.startsWith("/notifications") ||
    path.startsWith("/messages") ||
    path.startsWith("/items/")

  // Define admin paths
  const isAdminPath = path.startsWith("/admin")

  // Get the token to check if the user is authenticated
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Redirect logic
  if ((isUserPath || isAdminPath) && !token) {
    // If trying to access a protected route without being logged in
    // Redirect to login page with a callback URL to return after login
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(redirectUrl)
  }

  // Check if user is trying to access admin routes but is not an admin
  if (isAdminPath && token && token.role !== "admin") {
    // Redirect to user dashboard if not an admin
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (path === "/login" && token) {
    // If already logged in and trying to access login page
    // Redirect to appropriate dashboard based on role
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/my-reports/:path*",
    "/report-item/:path*",
    "/notifications/:path*",
    "/messages/:path*",
    "/items/:path*",
    "/admin/:path*",
  ],
}
