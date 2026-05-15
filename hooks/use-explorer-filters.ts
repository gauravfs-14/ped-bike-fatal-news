"use client"

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs"

import { defaultFilters } from "@/lib/records/filter"
import type {
  ExplorerFilters,
  KeywordFamily,
  Platform,
} from "@/lib/records/types"

function splitValue<T extends string>(value: string) {
  return value ? (value.split(",").filter(Boolean) as T[]) : []
}

function joinValue(value: string[]) {
  return value.length ? value.join(",") : null
}

export function useExplorerFilters() {
  const [query, setQuery] = useQueryStates(
    {
      platforms: parseAsString.withDefault(""),
      families: parseAsString.withDefault(""),
      keyword: parseAsString.withDefault(defaultFilters.keyword),
      location: parseAsString.withDefault(defaultFilters.location),
      source: parseAsString.withDefault(defaultFilters.source),
      text: parseAsString.withDefault(defaultFilters.text),
      from: parseAsString.withDefault(defaultFilters.from),
      to: parseAsString.withDefault(defaultFilters.to),
      hideOffTopic: parseAsBoolean.withDefault(defaultFilters.hideOffTopic),
    },
    {
      history: "push",
      shallow: true,
    }
  )

  const filters: ExplorerFilters = {
    platforms: splitValue<Platform>(query.platforms),
    keywordFamilies: splitValue<KeywordFamily>(query.families),
    keyword: query.keyword,
    location: query.location,
    source: query.source,
    text: query.text,
    from: query.from,
    to: query.to,
    hideOffTopic: query.hideOffTopic,
  }

  return {
    filters,
    setFilters: (next: Partial<ExplorerFilters>) =>
      setQuery({
        platforms: next.platforms ? joinValue(next.platforms) : undefined,
        families: next.keywordFamilies
          ? joinValue(next.keywordFamilies)
          : undefined,
        keyword: next.keyword,
        location: next.location,
        source: next.source,
        text: next.text,
        from: next.from,
        to: next.to,
        hideOffTopic: next.hideOffTopic,
      }),
    resetFilters: () =>
      setQuery({
        platforms: null,
        families: null,
        keyword: null,
        location: null,
        source: null,
        text: null,
        from: null,
        to: null,
        hideOffTopic: null,
      }),
  }
}
