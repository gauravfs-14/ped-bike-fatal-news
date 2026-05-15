# PedBikeFatal News Media Dataset Explorer

Interactive dashboard for exploring the **PedBikeFatal News Media Dataset** — unified media mentions about pedestrian and bicycle fatalities from news, Reddit, Bluesky, and Mastodon (2014–2026).

## Local development

```bash
pnpm install
pnpm data:build   # regenerate public/data/*.json from data/*.jsonl
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

After updating `data/fatal_ped_bike_crashes_records.jsonl`, run `pnpm data:build` again (or rely on `prebuild` during `pnpm build`).

## Production build

```bash
pnpm install
pnpm build        # runs data:build via prebuild, then next build
pnpm start        # serves on port 3000
```

## Deployment

This app is a standard **Next.js 16** Node deployment.

| Requirement | Notes |
|-------------|--------|
| **Node.js** | 20.x or 22.x recommended |
| **Package manager** | pnpm (see `packageManager` in `package.json`) |
| **Build command** | `pnpm build` |
| **Start command** | `pnpm start` |
| **Source data** | Commit `data/fatal_ped_bike_crashes_records.jsonl` with the repo |
| **Generated assets** | `public/data/aggregates.json` and `public/data/records-index.json` are produced at build time by `prebuild` |

### Vercel / similar platforms

- Framework preset: **Next.js**
- Install: `pnpm install`
- Build: `pnpm build`
- No environment variables required for the default dataset layout.

The record detail API reads `data/fatal_ped_bike_crashes_records.jsonl` at runtime. `next.config.mjs` includes that file in the server bundle via `outputFileTracingIncludes`.

### Docker (optional)

Use a multi-stage image: install dependencies and run `pnpm build` in the build stage, then `pnpm start` in the runtime stage. The JSONL file must remain at `data/fatal_ped_bike_crashes_records.jsonl` relative to the app root.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Development server (Turbopack) |
| `pnpm data:build` | Build explorer JSON from JSONL |
| `pnpm build` | Production build (includes `data:build`) |
| `pnpm start` | Production server |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |

## UI stack

- Next.js App Router, React 19
- shadcn/ui (`radix-vega`, mist theme)
- Recharts, TanStack Table / Virtual, nuqs
