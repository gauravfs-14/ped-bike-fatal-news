"use client"

import * as React from "react"
import { RiExternalLinkLine } from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import type { MediaRecord, RecordIndexItem } from "@/lib/records/types"

export function RecordDetailSheet({
  record,
  onOpenChange,
}: {
  record: RecordIndexItem | null
  onOpenChange: (open: boolean) => void
}) {
  const [detail, setDetail] = React.useState<MediaRecord | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    if (!record) return
    const recordPk = record.record_pk

    async function loadDetail() {
      setIsLoading(true)
      const response = await fetch(`/api/records/${recordPk}`)
      const data = (await response.json()) as MediaRecord
      if (!cancelled) {
        setDetail(data)
        setIsLoading(false)
      }
    }

    loadDetail().catch(() => {
      if (!cancelled) {
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [record])

  return (
    <Sheet open={Boolean(record)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Record detail</SheetTitle>
          <SheetDescription>
            Full content, collector metadata, and source link.
          </SheetDescription>
        </SheetHeader>
        {!record ? null : (
          <div className="flex flex-col gap-5 px-4 pb-6">
            <div className="flex flex-wrap gap-2">
              <Badge>{record.platform}</Badge>
              <Badge variant="secondary">{record.keywordFamily}</Badge>
              {record.isLikelyOffTopic ? (
                <Badge variant="destructive">Likely off-topic</Badge>
              ) : null}
            </div>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-48" />
              </div>
            ) : detail?.record_pk === record.record_pk ? (
              <>
                <div className="flex flex-col gap-2">
                  <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Published {new Date(detail.timestamp).toLocaleString()}
                  </div>
                  <p className="text-base leading-7">{detail.content}</p>
                </div>
                <div className="grid gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Source:</span>{" "}
                    {detail.source}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Author:</span>{" "}
                    {detail.author ?? "Unknown"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Keywords:</span>{" "}
                    {detail.keywords.join(", ")}
                  </div>
                  <Button asChild size="sm" className="w-fit">
                    <a href={detail.url} target="_blank" rel="noreferrer">
                      Open source
                      <RiExternalLinkLine data-icon="inline-end" />
                    </a>
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-sm font-medium">
                    Raw metadata
                  </h3>
                  <pre className="max-h-72 overflow-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
                    {JSON.stringify(detail.metadata, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                The record detail could not be loaded.
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
