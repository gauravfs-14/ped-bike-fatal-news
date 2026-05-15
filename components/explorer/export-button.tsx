"use client"

import { RiDownloadLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import type { RecordIndexItem } from "@/lib/records/types"

function csvEscape(value: unknown) {
  const text = String(value ?? "")
  return `"${text.replace(/"/g, '""')}"`
}

export function ExportButton({ records }: { records: RecordIndexItem[] }) {
  function downloadCsv() {
    const headers = [
      "record_pk",
      "platform",
      "timestamp",
      "source",
      "keyword",
      "keyword_family",
      "location",
      "engagement",
      "likely_off_topic",
      "preview",
      "url",
    ]
    const rows = records.map((record) =>
      [
        record.record_pk,
        record.platform,
        record.timestamp,
        record.source,
        record.keyword,
        record.keywordFamily,
        record.location,
        record.engagement.score,
        record.isLikelyOffTopic,
        record.contentPreview,
        record.url,
      ]
        .map(csvEscape)
        .join(",")
    )
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
      type: "text/csv;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "pedbikefatal-filtered-records.csv"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" onClick={downloadCsv}>
      <RiDownloadLine data-icon="inline-start" />
      Export CSV
    </Button>
  )
}
