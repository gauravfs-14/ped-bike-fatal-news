import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { buildExplorerData } from "../lib/records/aggregates"
import type { MediaRecord } from "../lib/records/types"

const root = process.cwd()
const sourcePath = path.join(root, "data/fatal_ped_bike_crashes_records.jsonl")
const outputDir = path.join(root, "public/data")

async function main() {
  const raw = await readFile(sourcePath, "utf8")
  const records = raw
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as MediaRecord)

  const { index, aggregates } = buildExplorerData(records)

  await mkdir(outputDir, { recursive: true })
  await writeFile(
    path.join(outputDir, "records-index.json"),
    `${JSON.stringify(index)}\n`
  )
  await writeFile(
    path.join(outputDir, "aggregates.json"),
    `${JSON.stringify(aggregates, null, 2)}\n`
  )

  console.log(
    `Built explorer data: ${index.length.toLocaleString()} records, ${aggregates.kpis.uniqueSources.toLocaleString()} sources`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
