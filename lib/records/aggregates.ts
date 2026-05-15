import type {
  Aggregates,
  CountDatum,
  KeywordFamily,
  MediaRecord,
  Platform,
} from "./types"
import { toRecordIndexItem } from "./normalize"

const PLATFORMS: Platform[] = ["news", "reddit", "bluesky", "mastodon"]
const KEYWORD_FAMILIES: KeywordFamily[] = [
  "pedestrian",
  "bicyclist",
  "cyclist",
  "bicycle",
  "aggregate",
  "noise",
  "other",
]

function increment(map: Map<string, number>, key: string, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount)
}

function toTopCounts(
  map: Map<string, number>,
  total: number,
  limit = 20
): CountDatum[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total ? count / total : 0,
    }))
}

function bucketNumber(value: number, buckets: number[]) {
  for (const bucket of buckets) {
    if (value <= bucket) {
      return `≤ ${bucket}`
    }
  }

  return `> ${buckets[buckets.length - 1]}`
}

function collectionLagBucket(record: MediaRecord) {
  const published = Date.parse(record.timestamp)
  const collected = Date.parse(record.collected_at)

  if (Number.isNaN(published) || Number.isNaN(collected)) {
    return "Unknown"
  }

  const days = Math.max(0, Math.round((collected - published) / 86_400_000))

  if (days === 0) return "Same day"
  if (days <= 7) return "1-7 days"
  if (days <= 30) return "8-30 days"
  if (days <= 365) return "31-365 days"
  return "> 1 year"
}

export function buildExplorerData(records: MediaRecord[]) {
  const index = records.map(toRecordIndexItem)
  const total = index.length

  const platformMap = new Map<string, number>()
  const collectorMap = new Map<string, number>()
  const keywordMap = new Map<string, number>()
  const keywordFamilyMap = new Map<string, number>()
  const locationMap = new Map<string, number>()
  const sourceMaps = new Map<Platform, Map<string, number>>(
    PLATFORMS.map((platform) => [platform, new Map<string, number>()])
  )
  const monthMap = new Map<string, Record<Platform | "total", number>>()
  const familyYearMap = new Map<
    number,
    Record<KeywordFamily | "total", number>
  >()
  const redditScoreMap = new Map<string, number>()
  const blueskyLikesMap = new Map<string, number>()
  const lagMap = new Map<string, number>()
  const relevanceMap = new Map<Platform, { onTopic: number; likelyOffTopic: number }>(
    PLATFORMS.map((platform) => [platform, { onTopic: 0, likelyOffTopic: 0 }])
  )

  const fingerprints = new Set(records.map((record) => record.fingerprint))
  const sources = new Set<string>()
  const locations = new Set<string>()
  const dates = index
    .map((record) => Date.parse(record.timestamp))
    .filter((value) => !Number.isNaN(value))
  const qualityExamples: Aggregates["qualityExamples"] = []

  for (let i = 0; i < index.length; i += 1) {
    const item = index[i]
    const record = records[i]

    increment(platformMap, item.platform)
    increment(collectorMap, item.collector)
    increment(keywordMap, item.keyword)
    increment(keywordFamilyMap, item.keywordFamily)
    increment(sourceMaps.get(item.platform)!, item.source)
    increment(lagMap, collectionLagBucket(record))
    sources.add(item.source)

    if (item.location) {
      increment(locationMap, item.location)
      locations.add(item.location)
    }

    const month = monthMap.get(item.month) ?? {
      news: 0,
      reddit: 0,
      bluesky: 0,
      mastodon: 0,
      total: 0,
    }
    month[item.platform] += 1
    month.total += 1
    monthMap.set(item.month, month)

    const year = familyYearMap.get(item.year) ?? {
      pedestrian: 0,
      bicyclist: 0,
      cyclist: 0,
      bicycle: 0,
      aggregate: 0,
      noise: 0,
      other: 0,
      total: 0,
    }
    year[item.keywordFamily] += 1
    year.total += 1
    familyYearMap.set(item.year, year)

    if (item.platform === "reddit") {
      increment(redditScoreMap, bucketNumber(item.engagement.score, [0, 1, 5, 25, 100, 500]))
    }

    if (item.platform === "bluesky") {
      increment(blueskyLikesMap, bucketNumber(item.engagement.likes ?? 0, [0, 1, 5, 10, 50, 100]))
    }

    const relevance = relevanceMap.get(item.platform)!
    if (item.isLikelyOffTopic) {
      relevance.likelyOffTopic += 1
      if (qualityExamples.length < 12) {
        qualityExamples.push({
          record_pk: item.record_pk,
          platform: item.platform,
          reason:
            item.keywordFamily === "noise"
              ? "Broad cycling keyword"
              : "Matched off-topic content pattern",
          contentPreview: item.contentPreview,
        })
      }
    } else {
      relevance.onTopic += 1
    }
  }

  const topSources = Object.fromEntries(
    PLATFORMS.map((platform) => [
      platform,
      toTopCounts(sourceMaps.get(platform)!, platformMap.get(platform) ?? 0, 20),
    ])
  ) as Record<Platform, CountDatum[]>

  const aggregates: Aggregates = {
    generatedAt: new Date().toISOString(),
    kpis: {
      totalRecords: total,
      dateStart: new Date(Math.min(...dates)).toISOString().slice(0, 10),
      dateEnd: new Date(Math.max(...dates)).toISOString().slice(0, 10),
      uniqueSources: sources.size,
      uniqueLocations: locations.size,
      uniqueFingerprints: fingerprints.size,
      likelyOffTopic: index.filter((record) => record.isLikelyOffTopic).length,
    },
    facets: {
      platforms: PLATFORMS,
      keywordFamilies: KEYWORD_FAMILIES,
      keywords: [...keywordMap.keys()].sort(),
      locations: [...locations].sort((a, b) => a.localeCompare(b)),
      sources: [...sources].sort((a, b) => a.localeCompare(b)),
      dateStart: new Date(Math.min(...dates)).toISOString().slice(0, 10),
      dateEnd: new Date(Math.max(...dates)).toISOString().slice(0, 10),
    },
    platformMix: toTopCounts(platformMap, total, 10),
    collectorMix: toTopCounts(collectorMap, total, 12),
    keywordCounts: toTopCounts(keywordMap, total, 30),
    keywordFamilyCounts: toTopCounts(keywordFamilyMap, total, 10),
    keywordFamilyByYear: [...familyYearMap.entries()]
      .filter(([year]) => year > 0)
      .sort(([a], [b]) => a - b)
      .map(([year, values]) => ({ year, ...values })),
    volumeByMonth: [...monthMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({ month, ...values })),
    topLocations: toTopCounts(locationMap, total, 25),
    topSources,
    engagementHistogram: {
      redditScore: toTopCounts(redditScoreMap, platformMap.get("reddit") ?? 0, 20),
      blueskyLikes: toTopCounts(blueskyLikesMap, platformMap.get("bluesky") ?? 0, 20),
    },
    redditScatter: index
      .filter((record) => record.platform === "reddit")
      .sort((a, b) => b.engagement.score - a.engagement.score)
      .slice(0, 500)
      .map((record) => ({
        record_pk: record.record_pk,
        score: record.engagement.score,
        comments: record.engagement.comments ?? 0,
        source: record.source,
      })),
    collectionLag: toTopCounts(lagMap, total, 10),
    relevanceStats: PLATFORMS.map((platform) => {
      const values = relevanceMap.get(platform)!
      return {
        platform,
        onTopic: values.onTopic,
        likelyOffTopic: values.likelyOffTopic,
        total: values.onTopic + values.likelyOffTopic,
      }
    }),
    qualityExamples,
  }

  return { index, aggregates }
}
