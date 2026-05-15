"use client"

import * as React from "react"

import { filterRecords, sortRecords } from "@/lib/records/filter"
import type {
  ExplorerFilters,
  RecordIndexItem,
} from "@/lib/records/types"

export function useFilteredRecords(
  records: RecordIndexItem[],
  filters: ExplorerFilters,
  sort: "newest" | "oldest" | "engagement" = "newest"
) {
  return React.useMemo(
    () => sortRecords(filterRecords(records, filters), sort),
    [filters, records, sort]
  )
}
