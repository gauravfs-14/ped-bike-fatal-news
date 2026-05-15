"use client"

import * as React from "react"
import {
  RiBarChartGroupedLine,
  RiDatabase2Line,
  RiFilter3Line,
  RiMapPinLine,
  RiPulseLine,
  RiSearchEyeLine,
  RiShieldCheckLine,
  RiStackLine,
  RiTimeLine,
} from "@remixicon/react"

import {
  EngagementHistogramChart,
  HorizontalCountChart,
  KeywordYearHeatmap,
  PlatformMixChart,
  RedditScatterChart,
  RelevanceByPlatformChart,
  VolumeTimelineChart,
} from "@/components/charts/explorer-charts"
import { ExportButton } from "@/components/explorer/export-button"
import { FilterBar } from "@/components/explorer/filter-bar"
import { KpiStrip } from "@/components/explorer/kpi-strip"
import { RecordDetailSheet } from "@/components/explorer/record-detail-sheet"
import { RecordTable } from "@/components/explorer/record-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useExplorerFilters } from "@/hooks/use-explorer-filters"
import { useFilteredRecords } from "@/hooks/use-filtered-records"
import { useRecordsIndex } from "@/hooks/use-records-index"
import type { Aggregates, RecordIndexItem } from "@/lib/records/types"

type SectionId =
  | "overview"
  | "records"
  | "keywords"
  | "geography"
  | "sources"
  | "engagement"
  | "collection"
  | "quality"

const sections: Array<{
  id: SectionId
  label: string
  description: string
  icon: React.ComponentType
}> = [
  {
    id: "overview",
    label: "Overview",
    description: "Volume, platform mix, and coverage.",
    icon: RiPulseLine,
  },
  {
    id: "records",
    label: "Records",
    description: "Filterable media mention table.",
    icon: RiDatabase2Line,
  },
  {
    id: "keywords",
    label: "Keywords",
    description: "Search phrases and family drift.",
    icon: RiSearchEyeLine,
  },
  {
    id: "geography",
    label: "Geography",
    description: "News query locations.",
    icon: RiMapPinLine,
  },
  {
    id: "sources",
    label: "Sources",
    description: "Outlets and social communities.",
    icon: RiStackLine,
  },
  {
    id: "engagement",
    label: "Engagement",
    description: "Reddit and Bluesky response.",
    icon: RiBarChartGroupedLine,
  },
  {
    id: "collection",
    label: "Collection",
    description: "Collectors and ingestion lag.",
    icon: RiTimeLine,
  },
  {
    id: "quality",
    label: "Data quality",
    description: "Noise, duplicates, and caveats.",
    icon: RiShieldCheckLine,
  },
]

function formatNumber(value: number) {
  return value.toLocaleString()
}

function SectionHeader({
  title,
  eyebrow,
  children,
}: {
  title: string
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
        {eyebrow}
      </div>
      <h2 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
        {children}
      </p>
    </div>
  )
}

function ExplorerNav({
  activeSection,
  setActiveSection,
}: {
  activeSection: SectionId
  setActiveSection: (section: SectionId) => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {sections.map((section) => {
        const Icon = section.icon
        const isActive = section.id === activeSection
        return (
          <Button
            key={section.id}
            variant={isActive ? "secondary" : "ghost"}
            className="h-auto justify-start px-3 py-2 text-left"
            onClick={() => setActiveSection(section.id)}
          >
            <Icon data-icon="inline-start" />
            <span className="flex min-w-0 flex-col items-start">
              <span>{section.label}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {section.description}
              </span>
            </span>
          </Button>
        )
      })}
    </nav>
  )
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function ExplorerShell({ aggregates }: { aggregates: Aggregates }) {
  const [activeSection, setActiveSection] =
    React.useState<SectionId>("overview")
  const [selectedRecord, setSelectedRecord] =
    React.useState<RecordIndexItem | null>(null)
  const [sort, setSort] =
    React.useState<"newest" | "oldest" | "engagement">("newest")
  const { records, isLoading, error } = useRecordsIndex()
  const { filters, setFilters, resetFilters } = useExplorerFilters()
  const filteredRecords = useFilteredRecords(records, filters, sort)
  const active = sections.find((section) => section.id === activeSection)!

  return (
    <div className="min-h-svh bg-background">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,var(--muted),transparent_34rem)]" />
      <div className="flex">
        <aside className="sticky top-0 hidden h-svh w-80 shrink-0 border-r bg-sidebar/80 p-4 backdrop-blur-xl lg:block">
          <div className="flex h-full flex-col gap-5">
            <div className="rounded-xl border bg-card/80 p-4">
              <Badge variant="secondary">PedBikeFatal</Badge>
              <h1 className="mt-3 font-heading text-2xl font-medium leading-tight">
                News Media Dataset Explorer
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Explore media mentions about pedestrian and bicycle fatalities
                across news, Reddit, Bluesky, and Mastodon.
              </p>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              <ExplorerNav
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            </ScrollArea>
            <div className="rounded-lg border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
              Keyword retrieval is not the same as a confirmed crash record.
              Use the data-quality section when interpreting counts.
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <header className="border-b px-4 py-5 lg:px-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RiFilter3Line data-icon="inline-start" />
                        Sections
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Explorer sections</SheetTitle>
                        <SheetDescription>
                          Jump between dataset views.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="px-4">
                        <ExplorerNav
                          activeSection={activeSection}
                          setActiveSection={setActiveSection}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Badge variant="secondary">PedBikeFatal</Badge>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                  PedBikeFatal News Media Dataset
                </p>
                <h1 className="font-heading text-4xl font-medium tracking-tight md:text-6xl">
                  {active.label}
                </h1>
                <p className="max-w-3xl text-muted-foreground">
                  {active.description} The current filtered set contains{" "}
                  {formatNumber(filteredRecords.length)} records.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {aggregates.kpis.dateStart} to {aggregates.kpis.dateEnd}
                </Badge>
                <Badge variant="outline">
                  {formatNumber(aggregates.kpis.totalRecords)} raw mentions
                </Badge>
              </div>
            </div>
          </header>
          <FilterBar
            aggregates={aggregates}
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
          />
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 lg:px-6">
            <KpiStrip
              aggregates={aggregates}
              filteredCount={filteredRecords.length}
            />
            {error ? (
              <Card>
                <CardHeader>
                  <CardTitle>Records could not be loaded</CardTitle>
                  <CardDescription>{error}</CardDescription>
                </CardHeader>
              </Card>
            ) : null}
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
              </div>
            ) : null}
            {!isLoading && activeSection === "overview" ? (
              <section className="flex flex-col gap-5">
                <SectionHeader title="Media volume at a glance" eyebrow="Overview">
                  See how the collection changes over time and how heavily it
                  leans toward Google News RSS compared with social platforms.
                </SectionHeader>
                <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
                  <ChartCard
                    title="Monthly mentions by platform"
                    description="Stacked trend from 2014 through the latest collection date."
                  >
                    <VolumeTimelineChart data={aggregates.volumeByMonth} />
                  </ChartCard>
                  <ChartCard
                    title="Platform mix"
                    description="News dominates the corpus, but social posts reveal engagement dynamics."
                  >
                    <PlatformMixChart data={aggregates.platformMix} />
                    <div className="mt-4 grid gap-2">
                      {aggregates.platformMix.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="capitalize text-muted-foreground">
                            {item.name}
                          </span>
                          <span>{formatNumber(item.count)}</span>
                        </div>
                      ))}
                    </div>
                  </ChartCard>
                </div>
              </section>
            ) : null}
            {!isLoading && activeSection === "records" ? (
              <section className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <SectionHeader title="Filtered record browser" eyebrow="Records">
                    Search, sort, inspect, and export the compact record index.
                    Click any row to fetch the full JSONL record on demand.
                  </SectionHeader>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={sort === "newest" ? "secondary" : "outline"}
                      onClick={() => setSort("newest")}
                    >
                      Newest
                    </Button>
                    <Button
                      variant={sort === "engagement" ? "secondary" : "outline"}
                      onClick={() => setSort("engagement")}
                    >
                      Engagement
                    </Button>
                    <ExportButton records={filteredRecords} />
                  </div>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <RecordTable
                      records={filteredRecords}
                      onSelectRecord={setSelectedRecord}
                    />
                  </CardContent>
                </Card>
              </section>
            ) : null}
            {!isLoading && activeSection === "keywords" ? (
              <section className="flex flex-col gap-5">
                <SectionHeader title="Search vocabulary and drift" eyebrow="Keywords">
                  The keyword field reflects collector queries, not entities
                  extracted from the text. Families help compare pedestrian,
                  bicyclist, cyclist, and broader non-motorist language.
                </SectionHeader>
                <div className="grid gap-4 xl:grid-cols-2">
                  <ChartCard
                    title="Top search terms"
                    description="Most frequent keyword phrases in the unified export."
                  >
                    <HorizontalCountChart
                      data={aggregates.keywordCounts.slice(0, 18)}
                      height={520}
                      labelWidth={148}
                    />
                  </ChartCard>
                  <ChartCard
                    title="Keyword families"
                    description="Normalized families used by the filters."
                  >
                    <HorizontalCountChart
                      data={aggregates.keywordFamilyCounts}
                      height={360}
                    />
                  </ChartCard>
                </div>
                <ChartCard
                  title="Keyword family by year"
                  description="A heatmap-style matrix showing which query families drive each year."
                >
                  <KeywordYearHeatmap data={aggregates.keywordFamilyByYear} />
                </ChartCard>
              </section>
            ) : null}
            {!isLoading && activeSection === "geography" ? (
              <section className="flex flex-col gap-5">
                <SectionHeader title="Geographic query footprint" eyebrow="Geography">
                  Locations come from news search metadata, so they should be
                  read as query locations rather than crash coordinates.
                </SectionHeader>
                <ChartCard
                  title="Top news locations"
                  description="Highest-volume non-null metadata.location values."
                >
                  <HorizontalCountChart
                    data={aggregates.topLocations}
                    height={620}
                    labelWidth={136}
                  />
                </ChartCard>
              </section>
            ) : null}
            {!isLoading && activeSection === "sources" ? (
              <section className="flex flex-col gap-5">
                <SectionHeader title="Publishers and communities" eyebrow="Sources">
                  Compare repeated news outlets, Reddit communities, social
                  domains, and collection sources.
                </SectionHeader>
                <Tabs defaultValue="news">
                  <TabsList>
                    <TabsTrigger value="news">News</TabsTrigger>
                    <TabsTrigger value="reddit">Reddit</TabsTrigger>
                    <TabsTrigger value="bluesky">Bluesky</TabsTrigger>
                    <TabsTrigger value="mastodon">Mastodon</TabsTrigger>
                    <TabsTrigger value="collectors">Collectors</TabsTrigger>
                  </TabsList>
                  {(["news", "reddit", "bluesky", "mastodon"] as const).map(
                    (platform) => (
                      <TabsContent key={platform} value={platform}>
                        <ChartCard
                          title={`Top ${platform} sources`}
                          description="Ranked source values from the unified schema."
                        >
                          <HorizontalCountChart
                            data={aggregates.topSources[platform]}
                            height={520}
                            labelWidth={156}
                          />
                        </ChartCard>
                      </TabsContent>
                    )
                  )}
                  <TabsContent value="collectors">
                    <ChartCard
                      title="Collector mix"
                      description="Backend collectors represented in metadata.collector."
                    >
                      <HorizontalCountChart
                        data={aggregates.collectorMix}
                        height={360}
                        labelWidth={180}
                      />
                    </ChartCard>
                  </TabsContent>
                </Tabs>
              </section>
            ) : null}
            {!isLoading && activeSection === "engagement" ? (
              <section className="flex flex-col gap-5">
                <SectionHeader title="Social response patterns" eyebrow="Engagement">
                  Engagement fields are platform-specific. Reddit combines score
                  and comments; Bluesky uses likes, replies, reposts, and quotes.
                </SectionHeader>
                <div className="grid gap-4 xl:grid-cols-2">
                  <ChartCard
                    title="Reddit engagement buckets"
                    description="Composite score buckets for Reddit records."
                  >
                    <EngagementHistogramChart
                      data={aggregates.engagementHistogram.redditScore}
                    />
                  </ChartCard>
                  <ChartCard
                    title="Bluesky like buckets"
                    description="Like-count distribution for Bluesky records."
                  >
                    <EngagementHistogramChart
                      data={aggregates.engagementHistogram.blueskyLikes}
                    />
                  </ChartCard>
                </div>
                <ChartCard
                  title="Reddit score vs comments"
                  description="Top 500 Reddit records by composite engagement."
                >
                  <RedditScatterChart data={aggregates.redditScatter} />
                </ChartCard>
              </section>
            ) : null}
            {!isLoading && activeSection === "collection" ? (
              <section className="flex flex-col gap-5">
                <SectionHeader title="Collection mechanics" eyebrow="Collection">
                  Inspect collector mix and the time between publication and
                  ingestion. News RSS windows often span many years.
                </SectionHeader>
                <div className="grid gap-4 xl:grid-cols-2">
                  <ChartCard
                    title="Collection lag"
                    description="Difference between timestamp and collected_at."
                  >
                    <EngagementHistogramChart data={aggregates.collectionLag} />
                  </ChartCard>
                  <ChartCard
                    title="Collector breakdown"
                    description="RSS and social collectors in the export."
                  >
                    <HorizontalCountChart
                      data={aggregates.collectorMix}
                      height={320}
                      labelWidth={176}
                    />
                  </ChartCard>
                </div>
              </section>
            ) : null}
            {!isLoading && activeSection === "quality" ? (
              <section className="flex flex-col gap-5">
                <SectionHeader title="Known noise and interpretation caveats" eyebrow="Data quality">
                  This tool flags likely off-topic items with deterministic
                  rules. Treat the flag as a triage aid, not a label.
                </SectionHeader>
                <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
                  <ChartCard
                    title="Likely relevant vs likely off-topic"
                    description="Heuristic flags by platform."
                  >
                    <RelevanceByPlatformChart data={aggregates.relevanceStats} />
                  </ChartCard>
                  <Card>
                    <CardHeader>
                      <CardTitle>Dataset caveats</CardTitle>
                      <CardDescription>
                        Important reading notes before using counts as evidence.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
                      <p>
                        Keyword retrieval can include motorcyclists, sports
                        cycling, policy articles, and international articles.
                      </p>
                      <Separator />
                      <p>
                        There are {formatNumber(aggregates.kpis.uniqueFingerprints)}{" "}
                        unique fingerprints across{" "}
                        {formatNumber(aggregates.kpis.totalRecords)} mentions.
                      </p>
                      <Separator />
                      <p>
                        {formatNumber(aggregates.kpis.likelyOffTopic)} records
                        are flagged by the first-pass relevance heuristic.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {aggregates.qualityExamples.map((example) => (
                    <Card key={example.record_pk} size="sm">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-3">
                          <span>{example.reason}</span>
                          <Badge variant="secondary">{example.platform}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                          {example.contentPreview}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </main>
      </div>
      <RecordDetailSheet
        record={selectedRecord}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(null)
        }}
      />
    </div>
  )
}
