/**
 * Unwraps the standard API envelope: { statusCode, message, data }
 * Returns `data` when present, otherwise the original response.
 */
export function unwrapApiResponse(response) {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    (response.statusCode !== undefined || response.message !== undefined)
  ) {
    return response.data
  }

  return response
}

/**
 * Extracts auth credentials from sign-in / sign-up / refresh responses.
 */
export function unwrapAuthResponse(response) {
  return unwrapApiResponse(response)
}

/**
 * Extracts user from /me or nested auth payloads.
 */
export function unwrapUserResponse(response) {
  const payload = unwrapApiResponse(response)
  return payload?.user || payload
}

/**
 * Normalizes list endpoints to { data: [] }.
 */
export function unwrapListResponse(response) {
  const payload = unwrapApiResponse(response)

  if (Array.isArray(payload)) {
    return { data: payload }
  }

  if (Array.isArray(payload?.data)) {
    return { ...payload, data: payload.data }
  }

  if (Array.isArray(payload?.items)) {
    return { ...payload, data: payload.items }
  }

  return { data: [] }
}
