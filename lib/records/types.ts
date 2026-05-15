export type Platform = "news" | "reddit" | "bluesky" | "mastodon"

export type Collector =
  | "google_news_rss"
  | "reddit_exhaustive"
  | "bluesky"
  | "mastodon_exhaustive"
  | "rss"
  | "reddit"
  | "mastodon"
  | string

export type KeywordFamily =
  | "pedestrian"
  | "bicyclist"
  | "cyclist"
  | "bicycle"
  | "aggregate"
  | "noise"
  | "other"

export type EngagementMetric = {
  score: number
  label: string
  comments?: number
  likes?: number
  reposts?: number
  replies?: number
}

export type MediaMetadata = {
  collector?: Collector
  project?: string
  term?: string
  location?: string | null
  source_url?: string
  google_news_url?: string
  window_start?: string
  window_end?: string
  score?: number
  num_comments?: number
  upvote_ratio?: number
  is_self?: boolean
  link_flair_text?: string | null
  over_18?: boolean
  like_count?: number
  reply_count?: number
  repost_count?: number
  quote_count?: number
  favourites_count?: number
  reblogs_count?: number
  replies_count?: number
  hashtag?: string
  instance?: string
  [key: string]: unknown
}

export type MediaRecord = {
  record_pk: number
  platform: Platform
  external_id: string
  author: string | null
  content: string
  timestamp: string
  url: string
  source: string
  language: string | null
  fingerprint: string
  collected_at: string
  keywords: string[]
  metadata: MediaMetadata
}

export type RecordIndexItem = {
  record_pk: number
  platform: Platform
  timestamp: string
  year: number
  month: string
  source: string
  author: string | null
  url: string
  keywords: string[]
  keyword: string
  keywordFamily: KeywordFamily
  location: string | null
  collector: string
  engagement: EngagementMetric
  isLikelyOffTopic: boolean
  contentPreview: string
}

export type ExplorerFilters = {
  platforms: Platform[]
  keywordFamilies: KeywordFamily[]
  keyword: string
  location: string
  source: string
  text: string
  from: string
  to: string
  hideOffTopic: boolean
}

export type CountDatum = {
  name: string
  count: number
  percentage?: number
}

export type MonthDatum = {
  month: string
  news: number
  reddit: number
  bluesky: number
  mastodon: number
  total: number
}

export type Aggregates = {
  generatedAt: string
  kpis: {
    totalRecords: number
    dateStart: string
    dateEnd: string
    uniqueSources: number
    uniqueLocations: number
    uniqueFingerprints: number
    likelyOffTopic: number
  }
  facets: {
    platforms: Platform[]
    keywordFamilies: KeywordFamily[]
    keywords: string[]
    locations: string[]
    sources: string[]
    dateStart: string
    dateEnd: string
  }
  platformMix: CountDatum[]
  collectorMix: CountDatum[]
  keywordCounts: CountDatum[]
  keywordFamilyCounts: CountDatum[]
  keywordFamilyByYear: Array<Record<KeywordFamily | "year" | "total", number>>
  volumeByMonth: MonthDatum[]
  topLocations: CountDatum[]
  topSources: Record<Platform, CountDatum[]>
  engagementHistogram: {
    redditScore: CountDatum[]
    blueskyLikes: CountDatum[]
  }
  redditScatter: Array<{
    record_pk: number
    score: number
    comments: number
    source: string
  }>
  collectionLag: CountDatum[]
  relevanceStats: Array<{
    platform: Platform
    onTopic: number
    likelyOffTopic: number
    total: number
  }>
  qualityExamples: Array<{
    record_pk: number
    platform: Platform
    reason: string
    contentPreview: string
  }>
}
