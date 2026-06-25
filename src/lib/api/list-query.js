import { unwrapApiResponse } from "@/lib/api/unwrap-response"

/**
 * Builds a query string from list API params. Omits empty values.
 */
export function buildListQueryParams(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

/**
 * Extracts paginated list from standard API envelope.
 */
export function getPaginatedList(response) {
  const payload = unwrapApiResponse(response)

  const items = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : []

  return {
    items,
    total: payload?.total ?? items.length,
    page: payload?.page ?? 1,
    limit: payload?.limit ?? items.length,
  }
}
