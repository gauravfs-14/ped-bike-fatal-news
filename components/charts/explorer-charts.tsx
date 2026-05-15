"use client"

import { Fragment } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Aggregates, CountDatum } from "@/lib/records/types"

const platformConfig = {
  news: { label: "News", color: "var(--chart-1)" },
  reddit: { label: "Reddit", color: "var(--chart-2)" },
  bluesky: { label: "Bluesky", color: "var(--chart-3)" },
  mastodon: { label: "Mastodon", color: "var(--chart-4)" },
} satisfies ChartConfig

const countConfig = {
  count: { label: "Records", color: "var(--chart-2)" },
} satisfies ChartConfig

function compactNumber(value: number) {
  return Intl.NumberFormat("en", { notation: "compact" }).format(value)
}

export function VolumeTimelineChart({
  data,
}: {
  data: Aggregates["volumeByMonth"]
}) {
  return (
    <ChartContainer
      config={platformConfig}
      className="h-[320px] w-full"
      aria-label="Monthly media volume by platform"
    >
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis tickFormatter={compactNumber} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="news"
          stackId="1"
          stroke="var(--color-news)"
          fill="var(--color-news)"
          fillOpacity={0.74}
        />
        <Area
          dataKey="reddit"
          stackId="1"
          stroke="var(--color-reddit)"
          fill="var(--color-reddit)"
          fillOpacity={0.64}
        />
        <Area
          dataKey="bluesky"
          stackId="1"
          stroke="var(--color-bluesky)"
          fill="var(--color-bluesky)"
          fillOpacity={0.54}
        />
        <Area
          dataKey="mastodon"
          stackId="1"
          stroke="var(--color-mastodon)"
          fill="var(--color-mastodon)"
          fillOpacity={0.44}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function PlatformMixChart({ data }: { data: CountDatum[] }) {
  return (
    <ChartContainer
      config={platformConfig}
      className="mx-auto h-[260px] max-w-md"
      aria-label="Platform mix"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Pie data={data} dataKey="count" nameKey="name" innerRadius={58}>
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={`var(--chart-${(index % 5) + 1})`}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export function HorizontalCountChart({
  data,
  height = 360,
  labelWidth = 124,
}: {
  data: CountDatum[]
  height?: number
  labelWidth?: number
}) {
  return (
    <ChartContainer
      config={countConfig}
      className="w-full"
      style={{ height }}
      aria-label="Ranked count chart"
    >
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickFormatter={compactNumber} hide />
        <YAxis
          dataKey="name"
          type="category"
          width={labelWidth}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" radius={6} fill="var(--color-count)" />
      </BarChart>
    </ChartContainer>
  )
}

export function EngagementHistogramChart({
  data,
}: {
  data: CountDatum[]
}) {
  return (
    <ChartContainer
      config={countConfig}
      className="h-[260px] w-full"
      aria-label="Engagement histogram"
    >
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={compactNumber} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={6} />
      </BarChart>
    </ChartContainer>
  )
}

export function RedditScatterChart({
  data,
}: {
  data: Aggregates["redditScatter"]
}) {
  return (
    <ChartContainer
      config={{
        score: { label: "Score", color: "var(--chart-3)" },
      }}
      className="h-[300px] w-full"
      aria-label="Reddit score versus comments"
    >
      <ScatterChart>
        <CartesianGrid />
        <XAxis
          dataKey="score"
          name="Score"
          tickFormatter={compactNumber}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey="comments"
          name="Comments"
          tickFormatter={compactNumber}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Scatter data={data} fill="var(--color-score)" />
      </ScatterChart>
    </ChartContainer>
  )
}

export function RelevanceByPlatformChart({
  data,
}: {
  data: Aggregates["relevanceStats"]
}) {
  return (
    <ChartContainer
      config={{
        onTopic: { label: "Likely relevant", color: "var(--chart-2)" },
        likelyOffTopic: { label: "Likely off-topic", color: "var(--chart-5)" },
      }}
      className="h-[280px] w-full"
      aria-label="Relevance heuristic by platform"
    >
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="platform" tickLine={false} axisLine={false} />
        <YAxis tickFormatter={compactNumber} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="onTopic" stackId="a" fill="var(--color-onTopic)" radius={4} />
        <Bar
          dataKey="likelyOffTopic"
          stackId="a"
          fill="var(--color-likelyOffTopic)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}

export function KeywordYearHeatmap({
  data,
}: {
  data: Aggregates["keywordFamilyByYear"]
}) {
  const families = [
    "pedestrian",
    "bicyclist",
    "cyclist",
    "bicycle",
    "aggregate",
    "noise",
  ] as const
  const max = Math.max(
    ...data.flatMap((row) => families.map((family) => Number(row[family] ?? 0)))
  )

  return (
    <div
      className="overflow-x-auto rounded-lg border bg-card p-3"
      aria-label="Keyword family by year heatmap"
    >
      <div className="grid min-w-[780px] gap-1" style={{ gridTemplateColumns: `96px repeat(${families.length}, minmax(92px, 1fr))` }}>
        <div />
        {families.map((family) => (
          <div key={family} className="text-xs font-medium capitalize text-muted-foreground">
            {family}
          </div>
        ))}
        {data.map((row) => (
          <Fragment key={row.year}>
            <div key={`${row.year}-label`} className="text-sm font-medium">
              {row.year}
            </div>
            {families.map((family) => {
              const value = Number(row[family] ?? 0)
              const opacity = max ? 0.12 + (value / max) * 0.88 : 0.12
              return (
                <div
                  key={`${row.year}-${family}`}
                  className="rounded-md border px-2 py-2 text-xs"
                  style={{
                    backgroundColor: `color-mix(in oklch, var(--chart-2) ${Math.round(opacity * 100)}%, transparent)`,
                  }}
                >
                  {value.toLocaleString()}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
