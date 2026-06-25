import { NextResponse } from "next/server"
import { AUTH_COOKIE_KEYS, PUBLIC_ROUTES } from "@/lib/auth/constants"
import { canAccessRoute, getDefaultRouteForRole } from "@/lib/auth/routes"

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get(AUTH_COOKIE_KEYS.ACCESS_TOKEN)?.value
  const roleCode = request.cookies.get(AUTH_COOKIE_KEYS.ROLE)?.value

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Only enforce role routing when role cookie is present.
  // On reload, role may be restored after /me — avoid redirecting to "/".
  if (roleCode && !canAccessRoute(roleCode, pathname)) {
    return NextResponse.redirect(new URL(getDefaultRouteForRole(roleCode), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
