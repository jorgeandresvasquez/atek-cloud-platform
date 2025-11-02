# ATEK-Style Monitoring Platform

Modern, AI-first TypeScript monorepo for an ATEK-inspired IoT compliance platform. The repository evolves software, infrastructure, and regulated lifecycle artefacts together so requirements, design, implementation, and verification stay aligned.

## Monorepo Layout
- `apps/api` – Fastify + tRPC edge API (will expose REST via generated OpenAPI).
- `apps/web` – Next.js dashboard and admin console.
- `local/ingestor` – MQTT → database bridge mirroring AWS IoT ingestion.
- `local/simulators` – Synthetic device publishers for facilities/metrics.
- `packages/config` – Zod-backed runtime configuration loader.
- `packages/db` – Prisma client, schema, and seed data (multitenant domain).
- `packages/auth` – Token verification utilities (Keycloak / dev secret).
- `docs/` – GAMP5/Part 11 documentation, ADRs, architecture models.
- `infra/` – Terragrunt/OpenTofu scaffolding (to be expanded in later iterations).

## Local Platform Topology
| Service        | Tech / Container                                            | Purpose                                                                    |
| -------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| PostgreSQL     | TimescaleDB (`db`)                                          | Shared-everything multitenant database + time-series hypertables           |
| Keycloak       | `quay.io/keycloak/keycloak:25` (`keycloak`)                 | Identity provider issuing JWTs with tenant claims                          |
| Mosquitto      | `eclipse-mosquitto` (`mosquitto`)                           | MQTT broker for device telemetry                                           |
| MinIO          | `quay.io/minio/minio` (`minio`)                             | S3-compatible WORM storage for raw payload evidence                        |
| MailHog        | `mailhog/mailhog` (`mailhog`)                               | Test notifications via SMTP                                                |
| API            | `apps/api` Dockerfile                                       | Fastify service secured with Keycloak-issued access tokens                 |
| Web            | `apps/web` Dockerfile                                       | React/Next.js dashboard + admin tooling                                    |
| Ingestor       | `local/ingestor` Dockerfile                                 | Subscribes to MQTT, stores readings, writes raw payloads to MinIO          |

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- Node.js `>=20` (recommend [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), or [Volta](https://volta.sh/))
- pnpm `>=9` (enable via Corepack for the repo)

```bash
# ensure Node 20+ is active, then:
corepack enable pnpm
corepack prepare pnpm@9 --activate
pnpm --version
```

Create a working copy of the environment file before running local processes:

```bash
cp .env.example .env
```

## Bring Up the Local Stack

```bash
pnpm install
docker compose up -d db mosquitto minio mailhog keycloak
pnpm bootstrap:local   # generate Prisma client, run migrations, seed tenant & metrics
pnpm --filter @local/ingestor dev   # terminal 1 – bridge MQTT → database/S3
pnpm --filter @local/simulators start   # terminal 2 – emit synthetic facility metrics
pnpm dev   # terminal 3 – run API + Web locally with live reload
```

### Keycloak Defaults
- Admin console: http://localhost:8080/admin (admin / admin).
- Realm: `atek`
- Pre-seeded user: `admin@atek.dev` / `ChangeMe123!` (realm role `tenant-admin`, tenant `atek-dev`).
- OAuth clients:
  - `atek-web` (public) – Next.js app; configure PKCE auth flows.
  - `atek-api` (bearer-only) – API audience for service verification.

### Verifying the Flow
1. Log into the web UI at http://localhost:3000 with the seeded user (future iteration will enable actual login flow).
2. Telemetry simulators publish temperature/humidity metrics to MQTT; the ingestor writes readings into TimescaleDB and stores raw payloads in MinIO.
3. API endpoints will require a Keycloak-issued JWT containing `tenantId`, enabling per-tenant data isolation via Prisma.

## Database & Seeding
The Prisma schema (`packages/db/prisma/schema.prisma`) models tenants, facilities, metric definitions, facility-specific metric bindings, thresholds, alarms, notifications, audit events, and 21 CFR Part 11 electronic signatures. Run migrations or generate the client via:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

> The default seed creates `atek-dev` with a manufacturing facility, temperature/humidity metrics, and threshold definitions ready for dashboard visualisations.

## Next Iterations
- Refine Fastify API into modular controllers/services leveraging `@atek/db` and `@atek/auth`.
- Extend the Next.js app with authenticated dashboard views and admin CRUD tooling.
- Expand Terragrunt modules for AWS IoT Core, Timestream, Aurora, Verified Permissions, and CI policy checks.
- Generate OpenAPI artifacts, traceability matrices, and validation protocols from the shared domain model.

---

Questions or ideas for the next iteration? Capture them in `Notes_Jorge.md` or a new ADR and we will fold them into the plan. 🚀
