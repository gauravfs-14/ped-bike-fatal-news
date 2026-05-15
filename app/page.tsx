import { readFile } from "node:fs/promises"
import path from "node:path"
import { Suspense } from "react"

import { NuqsAdapter } from "nuqs/adapters/next/app"

import { ExplorerShell } from "@/components/explorer/explorer-shell"
import type { Aggregates } from "@/lib/records/types"

async function getAggregates() {
  const file = await readFile(
    path.join(process.cwd(), "public/data/aggregates.json"),
    "utf8"
  )

  return JSON.parse(file) as Aggregates
}

export default async function Page() {
  const aggregates = await getAggregates()

  return (
    <Suspense fallback={null}>
      <NuqsAdapter>
        <ExplorerShell aggregates={aggregates} />
      </NuqsAdapter>
    </Suspense>
  )
}
