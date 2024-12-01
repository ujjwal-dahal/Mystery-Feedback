import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const currentUrl = request.nextUrl;

  // Redirect authenticated users away from public pages
  if (
    token &&
    (currentUrl.pathname.startsWith("/sign-up") ||
      currentUrl.pathname.startsWith("/sign-in") ||
      currentUrl.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access private pages
  if (!token && currentUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-up",
    "/sign-in",
    "/",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
};
