/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/records/[pk]": ["./data/fatal_ped_bike_crashes_records.jsonl"],
  },
}

export default nextConfig
