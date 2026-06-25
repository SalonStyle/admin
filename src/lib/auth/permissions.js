import { ROLE_CODES } from "./constants"

export function getUserRoleCodes(user) {
  if (!user?.roles?.length) return []
  return user.roles.map((role) => role.role_code)
}

export function getPrimaryRoleCode(user) {
  const roleCodes = getUserRoleCodes(user)

  if (roleCodes.includes(ROLE_CODES.SUPER_ADMIN)) return ROLE_CODES.SUPER_ADMIN
  if (roleCodes.includes(ROLE_CODES.ADMIN)) return ROLE_CODES.ADMIN
  if (roleCodes.includes(ROLE_CODES.SALON)) return ROLE_CODES.SALON
  if (roleCodes.includes(ROLE_CODES.MEMBER)) return ROLE_CODES.MEMBER

  return roleCodes[0] || null
}

export function hasRole(user, roles) {
  const requiredRoles = Array.isArray(roles) ? roles : [roles]
  const userRoles = getUserRoleCodes(user)
  return requiredRoles.some((role) => userRoles.includes(role))
}

export function isSuperAdmin(user) {
  return hasRole(user, ROLE_CODES.SUPER_ADMIN)
}

export function isSalonOwner(user) {
  return hasRole(user, ROLE_CODES.SALON)
}

export function isMember(user) {
  return hasRole(user, ROLE_CODES.MEMBER)
}

export function getSalonId(user) {
  const salonRole = user?.roles?.find((role) => role.salon_id)
  return salonRole?.salon_id || null
}
