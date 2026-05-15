"use client"

import * as React from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RecordIndexItem } from "@/lib/records/types"

const columnHelper = createColumnHelper<RecordIndexItem>()

function platformLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function RecordTable({
  records,
  onSelectRecord,
}: {
  records: RecordIndexItem[]
  onSelectRecord: (record: RecordIndexItem) => void
}) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("timestamp", {
        header: "Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.accessor("platform", {
        header: "Platform",
        cell: (info) => <Badge variant="secondary">{platformLabel(info.getValue())}</Badge>,
      }),
      columnHelper.accessor("contentPreview", {
        header: "Record",
        cell: (info) => (
          <div className="max-w-[560px]">
            <div className="line-clamp-2 leading-relaxed">
              {info.getValue()}
            </div>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{info.row.original.source}</span>
              <span>{info.row.original.keyword}</span>
              {info.row.original.location ? <span>{info.row.original.location}</span> : null}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("engagement.score", {
        header: "Engagement",
        cell: (info) => (
          <span title={info.row.original.engagement.label}>
            {info.getValue().toLocaleString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "quality",
        header: "Quality",
        cell: (info) =>
          info.row.original.isLikelyOffTopic ? (
            <Badge variant="destructive">Flagged</Badge>
          ) : (
            <Badge variant="outline">Likely relevant</Badge>
          ),
      }),
      columnHelper.display({
        id: "action",
        header: "",
        cell: (info) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSelectRecord(info.row.original)}
          >
            View
          </Button>
        ),
      }),
    ],
    [onSelectRecord]
  )

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 78,
    overscan: 12,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const topPadding = virtualRows[0]?.start ?? 0
  const bottomPadding =
    rowVirtualizer.getTotalSize() -
    (virtualRows[virtualRows.length - 1]?.end ?? 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {records.length.toLocaleString()} filtered records.
        </p>
      </div>
      <div ref={parentRef} className="max-h-[620px] overflow-auto rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {topPadding > 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} style={{ height: topPadding }} />
              </TableRow>
            ) : null}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <TableRow key={row.id} data-index={virtualRow.index}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
            {bottomPadding > 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} style={{ height: bottomPadding }} />
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
