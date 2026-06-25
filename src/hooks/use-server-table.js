import { useMemo, useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

/**
 * Single source of truth for server-driven table state:
 * page, limit, search, filters → API query params + DataTable props.
 */
export function useServerTable({
  defaultPage = 1,
  defaultLimit = 10,
  searchParam = "name",
  debounceMs = 300,
  initialFilters = {},
} = {}) {
  const [page, setPage] = useState(defaultPage)
  const [limit, setLimit] = useState(defaultLimit)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState(initialFilters)

  const debouncedSearch = useDebouncedValue(search, debounceMs)

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

  const resetPage = () => setPage(1)

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
      resetPage()
    },
    page,
    pageSize: limit,
    onPageChange: setPage,
    onPageSizeChange: (size) => {
      setLimit(size)
      resetPage()
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
