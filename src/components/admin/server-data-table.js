"use client"

import { getPaginatedList } from "@/lib/api/list-query"
import { useServerTable } from "@/hooks/use-server-table"
import { DataTable } from "@/components/admin/data-table"
import { TableSkeleton } from "@/components/Skeleton/table-skeleton"

/**
 * Server-driven DataTable: owns pagination/search/filter state and fetches via RTK Query.
 */
export function ServerDataTable({
  useQuery,
  columns,
  filters = [],
  searchParam = "name",
  defaultLimit = 10,
  queryArg,
  skeletonRows = 10,
  ...tableProps
}) {
  const table = useServerTable({ searchParam, defaultLimit })

  const mergedQueryParams = queryArg
    ? { ...table.queryParams, ...queryArg }
    : table.queryParams

  const { data, isLoading, isFetching } = useQuery(mergedQueryParams)
  const { items, total } = getPaginatedList(data)

  const showSkeleton = (isLoading || isFetching) && items.length === 0

  if (showSkeleton) {
    return (
      <TableSkeleton
        columns={columns}
        rows={skeletonRows}
        title={tableProps.title}
        addNewLabel={tableProps.addNewLabel}
      />
    )
  }

  return (
    <DataTable
      {...tableProps}
      {...table.dataTableProps}
      data={items}
      columns={columns}
      filters={filters}
      totalCount={total}
    />
  )
}
