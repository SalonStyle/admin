import { AUTH_COOKIE_KEYS } from "./constants"

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function setCookie(name, value, maxAge = DEFAULT_MAX_AGE) {
  if (typeof document === "undefined") return

  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

function getCookie(name) {
  if (typeof document === "undefined") return null

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function deleteCookie(name) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function persistAuthSession({ access_token, refresh_token, roleCode }) {
  if (access_token) {
    setCookie(AUTH_COOKIE_KEYS.ACCESS_TOKEN, access_token)
  }
  if (refresh_token) {
    setCookie(AUTH_COOKIE_KEYS.REFRESH_TOKEN, refresh_token)
  }
  if (roleCode) {
    setCookie(AUTH_COOKIE_KEYS.ROLE, roleCode)
  }
}

export function clearAuthSession() {
  deleteCookie(AUTH_COOKIE_KEYS.ACCESS_TOKEN)
  deleteCookie(AUTH_COOKIE_KEYS.REFRESH_TOKEN)
  deleteCookie(AUTH_COOKIE_KEYS.ROLE)
}

export function getStoredAccessToken() {
  return getCookie(AUTH_COOKIE_KEYS.ACCESS_TOKEN)
}

export function getStoredRefreshToken() {
  return getCookie(AUTH_COOKIE_KEYS.REFRESH_TOKEN)
}

export function getStoredRoleCode() {
  return getCookie(AUTH_COOKIE_KEYS.ROLE)
}

export function getStoredAuthSession() {
  return {
    accessToken: getStoredAccessToken(),
    refreshToken: getStoredRefreshToken(),
    roleCode: getStoredRoleCode(),
  }
}
