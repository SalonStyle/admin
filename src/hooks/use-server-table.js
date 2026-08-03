import { useMemo, useState, useEffect, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

/**
 * Single source of truth for server-driven table state:
 * page, limit, search, filters → API query params + DataTable props.
 * Now synchronized with the URL.
 */
export function useServerTable({
  defaultPage = 1,
  defaultLimit = 10,
  searchParam = "name",
  debounceMs = 300,
  initialFilters = {},
} = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const urlPage = Number(searchParams.get("page")) || defaultPage
  const urlLimit = Number(searchParams.get("limit")) || defaultLimit
  const urlSearch = searchParams.get(searchParam) || ""

  const urlFilters = useMemo(() => {
    const parsed = { ...initialFilters }
    searchParams.forEach((value, key) => {
      if (key !== "page" && key !== "limit" && key !== searchParam) {
        parsed[key] = value
      }
    })
    return parsed
  }, [searchParams, searchParam]) // removed initialFilters from deps to prevent infinite loops
  const [page, setPage] = useState(urlPage)
  const [limit, setLimit] = useState(urlLimit)
  const [search, setSearch] = useState(urlSearch)
  const [filters, setFilters] = useState(urlFilters)

  const debouncedSearch = useDebouncedValue(search, debounceMs)

  // Track search params string to detect actual URL changes (like Back button)
  const searchParamsString = searchParams.toString()

  // Sync local state when URL changes externally (e.g. back button)
  useEffect(() => {
    setPage(urlPage)
    setLimit(urlLimit)
    setFilters(urlFilters)
    
    // Only overwrite local search if the URL search differs from our debounced state
    // (prevents overwriting local state while the user is actively typing)
    if (urlSearch !== debouncedSearch) {
      setSearch(urlSearch)
    }
  }, [searchParamsString]) // Only run when the URL ACTUALLY changes

  // Helper to push state to URL
  const updateUrl = (updates) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Effect to push debounced search to URL
  const isFirstRenderSearch = useRef(true)
  useEffect(() => {
    if (isFirstRenderSearch.current) {
      isFirstRenderSearch.current = false
      return
    }
    if (debouncedSearch !== urlSearch) {
      updateUrl({ [searchParam]: debouncedSearch, page: 1 })
    }
  }, [debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const queryParams = useMemo(() => {
    const params = { page, limit }

    if (debouncedSearch) {
      params[searchParam] = debouncedSearch
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key] = value
      }
    })

    return params
  }, [page, limit, debouncedSearch, searchParam, filters])

  const resetPage = () => {
    setPage(1)
    updateUrl({ page: 1 })
  }

  const dataTableProps = {
    manualPagination: true,
    enableInternalFiltering: false,
    searchField: searchParam,
    searchValue: search,
    onSearchChange: (value) => {
      setSearch(value)
      resetPage()
    },
    filterValues: filters,
    onFilterChange: (values) => {
      setFilters(values)
      // Push all filters to URL, removing missing ones
      const updates = { page: 1 }
      Object.keys(filters).forEach(k => updates[k] = "") // clear old
      Object.entries(values).forEach(([k, v]) => updates[k] = v) // set new
      updateUrl(updates)
    },
    page,
    pageSize: limit,
    onPageChange: (newPage) => {
      setPage(newPage)
      updateUrl({ page: newPage })
    },
    onPageSizeChange: (size) => {
      setLimit(size)
      updateUrl({ limit: size, page: 1 })
    },
  }

  return {
    queryParams,
    dataTableProps,
    page,
    limit,
    search,
    filters,
    setPage,
    setLimit,
    setSearch,
    setFilters,
    resetPage,
  }
}
