import type {
  EngagementMetric,
  KeywordFamily,
  MediaRecord,
  RecordIndexItem,
} from "./types"

const OFF_TOPIC_PATTERNS = [
  /\bmotorcycl(e|ist|ists)\b/i,
  /\bgiro\b/i,
  /\btour de france\b/i,
  /\bstage \d+\b/i,
  /\bpeloton\b/i,
  /\blanterne rouge\b/i,
  /\bcrash chaos\b/i,
  /\baquarium\b/i,
  /\bnitrogen cycle\b/i,
]

export function getPrimaryKeyword(record: Pick<MediaRecord, "keywords" | "metadata">) {
  return (
    record.keywords?.[0]?.trim().toLowerCase() ??
    String(record.metadata?.term ?? "unknown").trim().toLowerCase()
  )
}

export function getKeywordFamily(keyword: string): KeywordFamily {
  const normalized = keyword.toLowerCase()

  if (normalized === "cycling") {
    return "noise"
  }

  if (normalized.includes("non-motorist")) {
    return "aggregate"
  }

  if (normalized.includes("pedestrian")) {
    return "pedestrian"
  }

  if (normalized.includes("bicyclist")) {
    return "bicyclist"
  }

  if (normalized.includes("cyclist")) {
    return "cyclist"
  }

  if (normalized.includes("bicycle") || normalized.includes("cycle")) {
    return "bicycle"
  }

  return "other"
}

export function getLocation(record: MediaRecord) {
  const value = record.metadata?.location
  return typeof value === "string" && value.trim() ? value.trim() : null
}

export function getYearMonth(timestamp: string) {
  return timestamp.slice(0, 7)
}

export function getEngagement(record: MediaRecord): EngagementMetric {
  const metadata = record.metadata ?? {}

  if (record.platform === "reddit") {
    const score = Number(metadata.score ?? 0)
    const comments = Number(metadata.num_comments ?? 0)
    return {
      score: score + comments * 2,
      label: `${score} score / ${comments} comments`,
      comments,
    }
  }

  if (record.platform === "bluesky") {
    const likes = Number(metadata.like_count ?? 0)
    const reposts = Number(metadata.repost_count ?? 0)
    const replies = Number(metadata.reply_count ?? 0)
    const quotes = Number(metadata.quote_count ?? 0)
    return {
      score: likes + reposts * 2 + replies + quotes,
      label: `${likes} likes / ${reposts} reposts`,
      likes,
      reposts,
      replies,
    }
  }

  if (record.platform === "mastodon") {
    const likes = Number(metadata.favourites_count ?? 0)
    const reposts = Number(metadata.reblogs_count ?? 0)
    const replies = Number(metadata.replies_count ?? 0)
    return {
      score: likes + reposts * 2 + replies,
      label: `${likes} favourites / ${reposts} boosts`,
      likes,
      reposts,
      replies,
    }
  }

  return { score: 0, label: "No engagement metrics" }
}

export function isLikelyOffTopic(record: MediaRecord, keywordFamily: KeywordFamily) {
  const content = `${record.content} ${record.source} ${record.metadata?.term ?? ""}`

  if (keywordFamily === "noise") {
    return true
  }

  if (record.platform === "mastodon" && getPrimaryKeyword(record) === "cycling") {
    return true
  }

  return OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(content))
}

export function toContentPreview(content: string, length = 220) {
  const compact = content.replace(/\s+/g, " ").trim()
  return compact.length > length ? `${compact.slice(0, length - 1)}…` : compact
}

export function toRecordIndexItem(record: MediaRecord): RecordIndexItem {
  const keyword = getPrimaryKeyword(record)
  const keywordFamily = getKeywordFamily(keyword)
  const date = new Date(record.timestamp)

  return {
    record_pk: record.record_pk,
    platform: record.platform,
    timestamp: record.timestamp,
    year: Number.isNaN(date.getTime()) ? 0 : date.getUTCFullYear(),
    month: getYearMonth(record.timestamp),
    source: record.source || "Unknown",
    author: record.author,
    url: record.url,
    keywords: record.keywords ?? [],
    keyword,
    keywordFamily,
    location: getLocation(record),
    collector: String(record.metadata?.collector ?? "unknown"),
    engagement: getEngagement(record),
    isLikelyOffTopic: isLikelyOffTopic(record, keywordFamily),
    contentPreview: toContentPreview(record.content),
  }
}
