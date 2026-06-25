"use client"

import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  logout as logoutAction,
  selectAuth,
  selectIsAuthenticated,
  selectIsAuthInitialized,
  selectUser,
} from "@/lib/redux/features/auth/auth-slice"
import { useGetMeQuery, useLogoutMutation, authApi } from "@/lib/redux/features/auth/auth-api"
import {
  getPrimaryRoleCode,
  getSalonId,
  getUserRoleCodes,
  hasRole,
  isSalonOwner,
  isMember,
  isSuperAdmin,
} from "@/lib/auth/permissions"

export function useAuth() {
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isInitialized = useSelector(selectIsAuthInitialized)

  const { data: meData, isLoading: isMeLoading, isFetching: isMeFetching } = useGetMeQuery(
    undefined,
    {
      skip: !auth.accessToken,
    }
  )

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation()

  const profile = meData?.user || user
  const isSessionPending =
    Boolean(auth.accessToken) && !isAuthenticated && (isMeLoading || isMeFetching)
  const primaryRole = useMemo(() => getPrimaryRoleCode(profile), [profile])
  const roleCodes = useMemo(() => getUserRoleCodes(profile), [profile])
  const salonId = useMemo(() => getSalonId(profile), [profile])

  const checkRole = useCallback((roles) => hasRole(profile, roles), [profile])

  const signOut = useCallback(async () => {
    try {
      await logoutMutation().unwrap()
    } catch {
      // Clear local session even if API logout fails
    } finally {
      dispatch(logoutAction())
      dispatch(authApi.util.resetApiState())
    }
  }, [dispatch, logoutMutation])

  return {
    user: profile,
    profile,
    auth,
    accessToken: auth.accessToken,
    isAuthenticated,
    isInitialized,
    isLoading: !isInitialized || isSessionPending,
    isLoggingOut,
    primaryRole,
    roleCodes,
    salonId,
    isSuperAdmin: isSuperAdmin(profile),
    isSalonOwner: isSalonOwner(profile),
    isMember: isMember(profile),
    hasRole: checkRole,
    signOut,
  }
}
