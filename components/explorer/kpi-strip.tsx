import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Aggregates } from "@/lib/records/types"

const formatter = new Intl.NumberFormat("en")

export function KpiStrip({
  aggregates,
  filteredCount,
}: {
  aggregates: Aggregates
  filteredCount: number
}) {
  const items = [
    {
      label: "Filtered records",
      value: formatter.format(filteredCount),
      note: `${formatter.format(aggregates.kpis.totalRecords)} total mentions`,
    },
    {
      label: "Date coverage",
      value: `${aggregates.kpis.dateStart.slice(0, 4)}-${aggregates.kpis.dateEnd.slice(0, 4)}`,
      note: `${aggregates.kpis.dateStart} to ${aggregates.kpis.dateEnd}`,
    },
    {
      label: "Sources",
      value: formatter.format(aggregates.kpis.uniqueSources),
      note: "Outlets, communities, and instances",
    },
    {
      label: "Locations",
      value: formatter.format(aggregates.kpis.uniqueLocations),
      note: "News query locations",
    },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} size="sm" className="bg-card/80">
          <CardHeader>
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-3xl">{item.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{item.note}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
