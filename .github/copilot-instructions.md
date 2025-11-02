## ATEK Cloud Platform — Copilot instructions

Be concise and prefer edits that are small, obvious, and easy to validate. Focus on repository conventions, commands, and concrete file examples so a developer can be productive immediately.

- Repo type: TypeScript monorepo using pnpm workspace (see `pnpm-workspace.yaml`) and Node >=20. Use `pnpm` for installs and cross-package scripts.
- Local stack: many services are run via Docker Compose (see `docker-compose.yml`) and the README (`README.md`) contains canonical local startup commands.

Key components & where to look
- API: `apps/api` — Fastify + tRPC. Entry: `apps/api/src/index.ts`. Router logic and simple DB queries live in `apps/api/src/router.ts` (uses `pg` client). OpenAPI stub: `apps/api/src/openapi.ts`.
- Web: `apps/web` — Next.js dashboard. Run locally on port 3000.
- DB & schema: `packages/db/prisma/schema.prisma` is the canonical domain model (tenants, facilities, readings, alarms, signatures). Use Prisma-related scripts at root (`package.json`): `db:generate`, `db:migrate`, `db:seed`.
- Local helpers: `local/ingestor` (MQTT → DB bridge) and `local/simulators` (device simulators). They are started with `pnpm --filter` commands (see README examples).
- Config: `packages/config` contains runtime zod-backed configuration patterns — follow that style when adding new config.

Important developer commands (copyable, canonical)
- Install deps: `pnpm install`
- Start core local services (DB, Keycloak, MinIO, MQTT): use Docker Compose per `README.md`:
  - `docker compose up -d db mosquitto minio mailhog keycloak`
- Bootstrap local DB & clients:
  - `pnpm bootstrap:local` (runs Prisma generate, migrate, seed)
- Run whole stack dev (API + Web): `pnpm dev` (root script uses `concurrently` and runs `@apps/api` and `@apps/web`).
- Run a single package: `pnpm --filter @apps/api dev` or `pnpm --filter @apps/web dev`.

Patterns and conventions to follow
- Monorepo package names: packages use `@atek/*` and apps use `@apps/*`. Use `pnpm --filter` for targeted commands.
- Auth model: Keycloak is the authority locally. API expects Keycloak-issued JWTs with a `tenantId` claim; see `README.md` Keycloak defaults.
- DB access: the API currently uses `pg` client directly in `apps/api/src/router.ts` for queries — changes touching query surface should also update tests and consider moving to `packages/db` helpers.
- Domain model = source-of-truth: modify `packages/db/prisma/schema.prisma` for data model changes and then update migrations/seeds.

Integration points & deploy notes
- Infra: `infra/` contains Terragrunt/OpenTofu scaffolding. Production infra is staged under `infra/live`. Treat infra changes as separate from app code changes and coordinate with terraform/terragrunt flows.
- Evidence & storage: raw payloads are stored in MinIO (S3-compatible). Ingestor writes to DB + MinIO; refer to `local/ingestor` for the integration pattern.

Quick examples to reference when coding
- Add an API procedure: follow `apps/api/src/router.ts` tRPC pattern. Keep inputs validated with `zod` (the router currently uses `z.object(...)`).
- Add domain field: update `packages/db/prisma/schema.prisma`, then run `pnpm db:generate` and `pnpm db:migrate`.

Testing and CI
- Unit test runner: `vitest` for packages that define tests (see `apps/api/package.json`).
- End-to-end: Playwright is present under `tests/` and `playwright.config.ts` — run e2e tests from the `tests` package.

When in doubt
- Consult `README.md` for local developer flows and seeded Keycloak accounts.
- Prefer small, reversible changes (seed data + migrations are explicit).

If you need to change this guidance, propose edits to this file and include a short example of how you ran/validated the change (commands + files updated).
