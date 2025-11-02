# ADR-0001: Use TigerData TigerCloud TimescaleDB in prod; TimescaleDB locally
Status: Superseded Previous Decision (Amazon Timestream) → Accepted
Date: 2025-11-02

## Context
- The platform requires a single multi-tenant data store that can handle both high-volume time-series telemetry and transactional workloads.
- Aurora Serverless does not currently support installing the TimescaleDB extension, preventing us from consolidating OLTP + time-series on Aurora.
- Amazon Timestream would force a dual-database architecture (Timestream + Aurora) with additional sync/consistency logic and more complex validation controls.
- TigerData’s TigerCloud (managed TimescaleDB) runs natively on AWS infrastructure and supports AWS VPC peering/PrivateLink, allowing low-latency private connectivity from IoT Core/Lambda/API Gateway workloads.

## Decision
Adopt TigerCloud TimescaleDB as the production-grade database for telemetry and transactional data. Continue using self-hosted TimescaleDB for local integration tests and developer workflows. All data access goes through a repository/service layer so runtime deployments (TigerCloud vs local container) remain transparent to the application code.

## Consequences
- Simplifies schema management with a single Postgres-compatible engine across environments (TigerCloud in prod, containerized TimescaleDB locally).
- Requires establishing VPC peering (or PrivateLink) between the ATEK AWS account and the TigerCloud-managed VPC; includes network ACL, security group, and routing updates in IaC.
- Connection management must account for Lambda concurrency; introduce PgBouncer or managed pooling to stay within TigerCloud connection quotas.
- Performance expectations improve versus cross-service setups, but we must monitor throughput/latency SLAs defined by the selected TigerCloud tier.
- Compliance alignment remains straightforward because TigerCloud inherits AWS controls; documentation must note vendor responsibilities, data residency, and validation activities for the managed service.
