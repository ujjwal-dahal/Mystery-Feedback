import { NextResponse , NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

export async function middleware(request : NextRequest){

  const token = await getToken({req : request})
  const currentUrl = request.nextUrl

  if(token && (
    currentUrl.pathname.startsWith("sign-up") ||
    currentUrl.pathname.startsWith("/login") ||
    currentUrl.pathname.startsWith("/verify") ||
    currentUrl.pathname.startsWith("/")
  ) ){

    return NextResponse.redirect(new URL("/dashboard",request.url))

  }

  return NextResponse.redirect(new URL("/",request.url))
}

export const config = {
  matcher : [
    "/sign-up",
    "/login",
    "/",
    "/dashborad/:path*",
    "/verify/:path*",
  ]
}

