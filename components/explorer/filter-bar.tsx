"use client"

import { RiCloseLine, RiSearchLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import type {
  Aggregates,
  ExplorerFilters,
  KeywordFamily,
  Platform,
} from "@/lib/records/types"

export function FilterBar({
  aggregates,
  filters,
  setFilters,
  resetFilters,
}: {
  aggregates: Aggregates
  filters: ExplorerFilters
  setFilters: (next: Partial<ExplorerFilters>) => void
  resetFilters: () => void
}) {
  return (
    <div className="sticky top-0 z-20 border-b bg-background/85 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <RiSearchLine className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.text}
              onChange={(event) => setFilters({ text: event.target.value })}
              placeholder="Search headlines, posts, sources, terms..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={filters.keyword}
              onValueChange={(keyword) => setFilters({ keyword })}
            >
              <SelectTrigger className="min-w-44">
                <SelectValue placeholder="Keyword" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All keywords</SelectItem>
                  {aggregates.facets.keywords.slice(0, 60).map((keyword) => (
                    <SelectItem key={keyword} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={filters.location}
              onValueChange={(location) => setFilters({ location })}
            >
              <SelectTrigger className="min-w-44">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All locations</SelectItem>
                  {aggregates.facets.locations.slice(0, 80).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={filters.source}
              onValueChange={(source) => setFilters({ source })}
            >
              <SelectTrigger className="min-w-44">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All sources</SelectItem>
                  {aggregates.facets.sources.slice(0, 80).map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={resetFilters}>
              <RiCloseLine data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <ToggleGroup
            type="multiple"
            value={filters.platforms}
            onValueChange={(platforms) =>
              setFilters({ platforms: platforms as Platform[] })
            }
            className="justify-start"
          >
            {aggregates.facets.platforms.map((platform) => (
              <ToggleGroupItem key={platform} value={platform} className="capitalize">
                {platform}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup
            type="multiple"
            value={filters.keywordFamilies}
            onValueChange={(keywordFamilies) =>
              setFilters({ keywordFamilies: keywordFamilies as KeywordFamily[] })
            }
            className="justify-start"
          >
            {aggregates.facets.keywordFamilies.slice(0, 6).map((family) => (
              <ToggleGroupItem key={family} value={family} className="capitalize">
                {family}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="date"
              value={filters.from}
              min={aggregates.facets.dateStart}
              max={aggregates.facets.dateEnd}
              onChange={(event) => setFilters({ from: event.target.value })}
              className="w-fit"
            />
            <Input
              type="date"
              value={filters.to}
              min={aggregates.facets.dateStart}
              max={aggregates.facets.dateEnd}
              onChange={(event) => setFilters({ to: event.target.value })}
              className="w-fit"
            />
            <label className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <Checkbox
                checked={filters.hideOffTopic}
                onCheckedChange={(checked) =>
                  setFilters({ hideOffTopic: checked === true })
                }
              />
              Hide likely off-topic
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
