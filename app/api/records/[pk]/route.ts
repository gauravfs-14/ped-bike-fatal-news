import { readFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse } from "next/server"

import type { MediaRecord } from "@/lib/records/types"

const dataPath = path.join(
  process.cwd(),
  "data/fatal_ped_bike_crashes_records.jsonl"
)

let recordMapPromise: Promise<Map<number, MediaRecord>> | null = null

function getRecordMap() {
  recordMapPromise ??= readFile(dataPath, "utf8").then((raw) => {
    const records = new Map<number, MediaRecord>()

    for (const line of raw.split("\n")) {
      if (!line) continue
      const record = JSON.parse(line) as MediaRecord
      records.set(record.record_pk, record)
    }

    return records
  })

  return recordMapPromise
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pk: string }> }
) {
  const { pk } = await params
  const recordPk = Number(pk)

  if (!Number.isInteger(recordPk)) {
    return NextResponse.json({ error: "Invalid record id" }, { status: 400 })
  }

  const records = await getRecordMap()
  const record = records.get(recordPk)

  if (!record) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 })
  }

  return NextResponse.json(record)
}
