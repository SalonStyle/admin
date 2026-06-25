export const ROLE_CODES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SALON: "SALON",
  MEMBER: "MEMBER",
}

export const AUTH_COOKIE_KEYS = {
  ACCESS_TOKEN: "salon_access_token",
  REFRESH_TOKEN: "salon_refresh_token",
  ROLE: "salon_role",
}

export const AUTH_API_PATHS = {
  SIGN_IN: "/v1/auth/signin",
  SIGN_UP: "/v1/auth/signup",
  REFRESH: "/v1/auth/refresh",
  LOGOUT: "/v1/auth/logout",
  ME: "/v1/auth/me",
}

export const PUBLIC_ROUTES = ["/login"]
