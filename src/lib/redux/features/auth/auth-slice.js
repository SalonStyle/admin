import { createSlice } from "@reduxjs/toolkit"
import { getPrimaryRoleCode } from "@/lib/auth/permissions"
import { clearAuthSession, persistAuthSession } from "@/lib/auth/token-storage"

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
  isInitialized: false,
}

function applyCredentials(state, payload) {
  const { access_token, refresh_token, expires_in, user } = payload

  state.accessToken = access_token
  state.refreshToken = refresh_token
  state.expiresAt = expires_in ? Date.now() + expires_in * 1000 : null
  state.user = user
  state.isAuthenticated = true

  persistAuthSession({
    access_token,
    refresh_token,
    roleCode: getPrimaryRoleCode(user),
  })
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      applyCredentials(state, action.payload)
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload

      persistAuthSession({
        access_token: state.accessToken,
        refresh_token: state.refreshToken,
        roleCode: getPrimaryRoleCode(action.payload),
      })
    },
    hydrateAuthSession: (state, action) => {
      const { accessToken, refreshToken } = action.payload

      if (accessToken) {
        state.accessToken = accessToken
        state.refreshToken = refreshToken
        state.isAuthenticated = false
        state.user = null
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.expiresAt = null
      state.isAuthenticated = false
      state.isInitialized = true
      clearAuthSession()
    },
  },
})

export const { setCredentials, setUser, hydrateAuthSession, setInitialized, logout } =
  authSlice.actions

export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectAccessToken = (state) => state.auth.accessToken
export const selectRefreshToken = (state) => state.auth.refreshToken
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsAuthInitialized = (state) => state.auth.isInitialized

export default authSlice.reducer
