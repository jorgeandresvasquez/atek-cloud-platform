# Various Domain Notes

## GAMP5 Notest
- Overview
    - https://www.linkedin.com/pulse/mastering-gamp5-comprehensive-how-to-guide-pharcell-hsgef
- SDLC that integrates GMAP5 and Compliance for Life Sciences domain
    - statics.teams.cdn.office.net/evergreen-assets/safelinks/2/atp-safelinks.html
- GAMP5 and Regulatory Compliance
    - https://intuitionlabs.ai/pdfs/gamp-5-computerized-system-validation-in-pharma.pdf

## FDA 21 CFR Part 11 compliance
- Overview:
    - https://intuitionlabs.ai/articles/21-cfr-part-11-electronic-records-signatures-overview
    - https://www.tsaprocessequipments.com/fda-21-cfr-part-11-gamp-5-compliance-in-pharma/
- GxP in AWS (AWS Audit Manager):
    - https://docs.aws.amazon.com/audit-manager/latest/userguide/GxP.html
- For FDA-regulated products: If the lab is involved in the development, manufacturing, or quality control of drugs or medical devices, sensor data is subject to the FDA's regulations.
- Key compliance requirements
    - Electronic Signatures: Use electronic signatures to replace handwritten signatures, which are legally binding equivalents.
    - Audit Trails: Maintain audit trails that track all changes to the data and who made them.
    - Data Integrity: Ensure data is attributable, legible, contemporaneous, original, and accurate (ALCOA).
    - Security: Securely store data long-term and prevent unauthorized access.
    - System Validation: The hardware, software, and procedures must all work together and be validated to  ensure they can meet the compliance requirements.
    Standard Operating Procedures (SOPs): You must have documented procedures for installation, calibration, user training, and record retention

## Important Clarifications on Compliance
- Before diving into details, remember:
    - Every record that influences product quality or patient safety = must be compliant.
    - Compliance is not about paperwork — it’s about traceability, validation, and control.
    - Everything in your lifecycle must be planned, executed, documented, reviewed, and traceable.
CSV (Computer System Validation)
│
├── IQ (Installation Qualification)
│    → Is it installed correctly?
│
├── OQ (Operational Qualification)
│    → Does it function correctly?
│
└── PQ (Performance Qualification)
     → Does it perform as intended in real use?


## Development Environment Ideas
- Leverage devContainer to simplify runtime environments
    - https://code.visualstudio.com/docs/devcontainers/containers

## Architecture
- AWS IoT
- AWS Timestream (serverless time-series DB purpose-built for IoT metrics)
- Serverless Aurora for Central Operational plane (tenants, facilities, devices, alarms, user-to-scope, calibrations master data, payments, billing).
- Calibration records/history (immutable log you append and read by device/tenant/time)
- Shared Everything Multitenant design
- AWS region:  ca-central-1 (Canada Central)
- Branching model:  GitHub Flow (main + feature branches + PRs)

## Tech Stack
- Front
    - React + next.js
- Backend (REST API)
    - API Gateway + Lambdas + Fastify + OpenAPI + TypeScript
- Database
    - Aurora Serverless (PostgreSQL)?       
        - Seems like TimescaleDB extension  is not compatible with serverless Aurora
    - Amazon Timestream for time-series data
    - Managed TigerCloud by Tiger Data
        - https://www.tigerdata.com/blog/do-more-with-timescale-on-aws-iot-core
        - Validate latency between AWS IoT Core and TigerCloud
            - The actual latency will depend on your specific network architecture within AWS (e.g., using VPC peering vs. public internet, same AZ vs. different regions), but Tiger Cloud is designed to support high-performance, low-latency applications within the AWS ecosystem when configured correctly.
- Authentication/Authorization
    - AWS Cognito
- Integration Testing
    - Playwright
- Unit Testing
    - Vitest
- E2E Testing
    - Cypress?  (Analysis pending)
- CI/CD
    - GitHub Actions
- Monitoring
    - Dynatrace?  (Analysis pending)
- Leverage OpenAPI to maintain up-to-date API Specs that are in sync with the REST API and generate documentation for integration with third parties if requuired, offering customers access to their data for custom integrations with other systems they may have
- IaC
    - Terragrunt + OpenTofu
- Docker Compose to be able to run everything locally for local tests
- Type-safe ORM (Object-Relational Mapper) for TypeScript/Node.js.
    - Prisma
- Policy as Code for IaC (Infrastructure-as-Code) security and compliance.
    - Checkov
        - static analysis tool that scans Infrastructure as Code (IaC) for misconfigurations,
    - OPA
        - is a more general-purpose policy engine that can be used to enforce policies across various systems, including IaC
- Architecture Diagrams
    - Mermaid:  Lightweight diagrams to embed in markdown, very simple but not too feature complete.
    - Structurizr:  Architecture-as-code modeling framework based on the C4 model (Context, Containers, Components, Code).
    - PlantUML:  For more detailed and sophisticated architecture diagrams 
- AI Tools
    - Chatgpt Codex
    - Copilot
    - ChatGPT

## Ideas
- Testability and development-centric approach
    - Capability to run the full ecosystem locally (DB, IoT device simulators, data ingestion pipelines, frontend application)
    - Capability to run hybrids with certain parts running locally and others in AWS
    - Provision a full E2E test environment from scratchm run E2E tests and destroy when done
- Evolve requirements, design and implementation together
- Derive tests, documentation, implementation from specs
- Key documentation to keep in the code:
    - ADR
- Features written using Ghuerkin?  Depending on how effective this works in practice...
- One product evolving together with its operational aspects, features, maintenance instructions, verfications
- Rationale for suggestions:
    - Testing is hard in most places so testability approach from day 1 will favor continuos quality and promote developers to test their work thoroughly as well as to automate as much as possible via CI/CD
    - Documentation in silos that evolve separately repeatedly creat the same problem that the products and their docs on not in sync (99% of companies I have worked for have this same problem!)

## Glossary:
ADRs:  Architecture Decision Records
SOP:  Standard Operating Procedures
URS:  User Requirements
VP:  Validation Plan
DS:  Design Specification
RTM:  Traceability Matrix
RA:  Risk Assessment
CSV:  Computer System Validation
GxP:  GxP is an umbrella term for Good [Something] Practice standards in regulated industries (especially life sciences and pharma).
URS:  User Requirements Spec
FS:  Functional Spec 
DS:  Design Spec

URS  →  FS  →  DS  →  IQ/OQ/PQ  →  Validation Report

CSV (Computer System Validation)
│
├── IQ (Installation Qualification)
│    → Is it installed correctly?
│
├── OQ (Operational Qualification)
│    → Does it function correctly?
│
└── PQ (Performance Qualification)
     → Does it perform as intended in real use?

| “x”        | Meaning                                  | Example Regulation / Scope                         |
| ---------- | ---------------------------------------- | -------------------------------------------------- |
| **GMP**    | Good Manufacturing Practice              | Production and quality control of drugs or devices |
| **GLP**    | Good Laboratory Practice                 | Pre-clinical testing, lab research                 |
| **GCP**    | Good Clinical Practice                   | Clinical trials and human studies                  |
| **GDP**    | Good Distribution Practice               | Storage and transport of products                  |
| **GEP**    | Good Engineering Practice                | Facility and system design                         |
| **GAMP 5** | Good Automated Manufacturing Practice v5 | Guidance for validation of computerized systems    |



## Other AI Tools
- General tools to boost productivity
    - Wispr Flow
        - Transcribes what you say, spits out text with perfect grammar, etc.
        - Writing emails, slack messages, etc.
    - Eleven Labs
        - They have perfected voice cloning
    - ChatGPT voice mode
        - Great for brainstorming
        - Having a full conversation
        - Work through any problems
        - Ask it to summarize everything you discusses in a well structured document
    - Claude Projects
        - Great for writing
        - Create different projects for different types of writing
            - LinkedIn
            - Writing youtube scripts
            - You upload examples of your best work
            - Give it specific instructions
    - Nano Banana (aka:  Gemini 2.5 Flash Image)
        - Best image editor and generator
- AI automations and agents
    - Anthropic Prompt Generator
    - Firecrawl
        - Search and read websites
        - Tell it what information to extract
- Dedicated AI agent builders
    - lindy.ai
        - quick to get started
    - relevance ai
        - More advanced stuff
        - Entire AI Agent department working together
    - Google AI Studio
        - Create full features apps 
        - Free AI Development Studio
- Business tools
    - Notion.ai
        - Supports AI blocks to reuse the same AI command across a team
    - Air Tables
    - Circleback
        - Transcribe meetings
        - AI Powered search across all meetings
    - Attio
        - CRM with AI in mind
    - Clay
        - Scale Sales Outreach
        - GTM Engineer
        - Spreadsheet on Steroids for finding and enriching prospects
    - Cassidy.ai
        - Build Specialized assistants for every department in your business
        - Automate RFP processes, support tickets, competitive analysis
    - Super.work
        - AI search for looking for scattered information (slack, notes, email, wiki)
    - Chatgpt Agent Mode

## Installation setup extras
```bash
corepack enable pnpm
corepack prepare pnpm@9 --activate
pnpm --version
pnpm install
docker compose up -d db mosquitto minio mailhog keycloak
pnpm bootstrap:local
pnpm --filter @local/ingestor dev          # separate terminal
pnpm --filter @local/simulators start      # separate terminal
pnpm dev                                   # API + Web
```
 
## Plan for Next Steps
- Finalize tech stack choices
- Draft initial architecture diagrams
    - Add containers.puml diagram
- Set up monorepo structure with pnpm workspaces
- Create initial project scaffolding for core components (API, Web, Ingestor, Simulators)
- Define initial database schema with Prisma
- Implement basic Docker Compose setup for local development
- Document development environment setup and key commands in README.md
- Begin drafting CSV documentation templates (URS, FS, DS, VP, RTM)
- Establish CI/CD pipeline for automated testing and deployment
- Add project references in addition to path based imports in tsconfig.json for better DX (every workspace runs against the emitted types of its dependencies)
    - Introduce a root tsconfig.base.json with shared compiler options.
    - Each package tsconfig.json extends it, sets "references": [{ "path": "../config" }, …], and keeps rootDir/outDir.
    - Add a tsconfig.build.json or use tsc -b targets for CI builds.

## Checks upon every milestone
- Does the code follow object-oriented principles?
- Is the code self-documenting with clear naming conventions?
- Are GAMP5 documentation standards being met?
- Are FDA 21 CFR Part 11 compliance considerations addressed?
- Please run a consistency check across all files and we can proceed to push the first release to a github public repository that I own named atek-cloud-platform.

