import { ROLE_CODES } from "./constants"

export const ROUTE_ACCESS = {
  "/": [ROLE_CODES.SUPER_ADMIN, ROLE_CODES.SALON],
  "/salons": [ROLE_CODES.SUPER_ADMIN],
  "/services": [ROLE_CODES.SALON],
  "/categories": [ROLE_CODES.SALON],
  "/members": [ROLE_CODES.SALON],
  "/bookings": [ROLE_CODES.SALON, ROLE_CODES.MEMBER],
  "/settings": [ROLE_CODES.SALON],
}

export function getDefaultRouteForRole(roleCode) {
  if (roleCode === ROLE_CODES.MEMBER) {
    return "/bookings"
  }

  return "/"
}

export function canAccessRoute(roleCode, pathname) {
  if (!roleCode) return false

  const matchedRoute = Object.keys(ROUTE_ACCESS)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname === route || pathname.startsWith(`${route}/`))

  if (!matchedRoute) {
    return true
  }

  return ROUTE_ACCESS[matchedRoute].includes(roleCode)
}

export function resolvePostLoginRoute(roleCode, redirectTo) {
  if (redirectTo && canAccessRoute(roleCode, redirectTo)) {
    return redirectTo
  }

  return getDefaultRouteForRole(roleCode)
}
