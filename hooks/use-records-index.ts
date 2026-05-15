"use client"

import * as React from "react"

import type { RecordIndexItem } from "@/lib/records/types"

export function useRecordsIndex() {
  const [records, setRecords] = React.useState<RecordIndexItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function loadRecords() {
      try {
        const response = await fetch("/data/records-index.json")
        if (!response.ok) {
          throw new Error("Could not load record index")
        }
        const data = (await response.json()) as RecordIndexItem[]
        if (!cancelled) {
          setRecords(data)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load records"
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadRecords()

    return () => {
      cancelled = true
    }
  }, [])

  return { records, isLoading, error }
}
