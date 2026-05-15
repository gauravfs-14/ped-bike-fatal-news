import type {
  ExplorerFilters,
  RecordIndexItem,
} from "./types"

export const defaultFilters: ExplorerFilters = {
  platforms: [],
  keywordFamilies: [],
  keyword: "all",
  location: "all",
  source: "all",
  text: "",
  from: "",
  to: "",
  hideOffTopic: true,
}

export function filterRecords(
  records: RecordIndexItem[],
  filters: ExplorerFilters
) {
  const text = filters.text.trim().toLowerCase()
  const from = filters.from ? Date.parse(filters.from) : Number.NEGATIVE_INFINITY
  const to = filters.to ? Date.parse(filters.to) : Number.POSITIVE_INFINITY

  return records.filter((record) => {
    const timestamp = Date.parse(record.timestamp)

    if (filters.hideOffTopic && record.isLikelyOffTopic) {
      return false
    }

    if (
      filters.platforms.length > 0 &&
      !filters.platforms.includes(record.platform)
    ) {
      return false
    }

    if (
      filters.keywordFamilies.length > 0 &&
      !filters.keywordFamilies.includes(record.keywordFamily)
    ) {
      return false
    }

    if (filters.keyword !== "all" && record.keyword !== filters.keyword) {
      return false
    }

    if (filters.location !== "all" && record.location !== filters.location) {
      return false
    }

    if (filters.source !== "all" && record.source !== filters.source) {
      return false
    }

    if (!Number.isNaN(timestamp) && (timestamp < from || timestamp > to)) {
      return false
    }

    if (
      text &&
      !`${record.contentPreview} ${record.source} ${record.keyword} ${record.location ?? ""}`
        .toLowerCase()
        .includes(text)
    ) {
      return false
    }

    return true
  })
}

export function sortRecords(
  records: RecordIndexItem[],
  sort: "newest" | "oldest" | "engagement" = "newest"
) {
  return [...records].sort((a, b) => {
    if (sort === "engagement") {
      return b.engagement.score - a.engagement.score
    }

    const aTime = Date.parse(a.timestamp)
    const bTime = Date.parse(b.timestamp)
    return sort === "oldest" ? aTime - bTime : bTime - aTime
  })
}
