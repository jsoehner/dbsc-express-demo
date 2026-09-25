# Architectural Decision Records (ADRs)

This directory contains the Architectural Decision Records (ADRs) for the project, maintained in accordance with our ADR governance policy (see [ADR 0000](0000-record-architecture-decisions.md)).

## Decision Log

| ID | Title | Date | Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| 0000 | [Record Architecture Decisions](0000-record-architecture-decisions.md) | 2024-05-23 | Accepted | Mandate ADRs stored in `docs/adr/` for significant architectural and security choices. |
| 0001 | [Security Baseline & Governance](0001-security-baseline.md) | 2024-05-22 | Accepted | Adopt Security by Design with SAST, secret scanning, and automated governance. |
| 0002 | [Fix ReferenceError for MemoryReplayCache in server.js](0002-fix-memory-replay-cache-import.md) | 2026-09-14 | Accepted | Add explicit import for `MemoryReplayCache` to prevent migration runtime failures. |
| 0003 | [Switch to Debian-based Node.js images in Docker](0003-switch-to-debian-based-node-images.md) | 2026-09-14 | Accepted | Switch from Alpine to Debian images to support native `better-sqlite3` build. |
| 0004 | [Standardize Data Directory within Application Workdir](0004-standardize-data-directory-in-docker.md) | 2026-09-15 | Accepted | Standardize persistence paths to `./data/` relative to `/app` in container. |
| 0005 | [Security Testing Workflow Hardening and Reporting-Mode Trivy](0005-security-testing-workflow-hardening.md) | 2026-09-19 | Accepted | Configure Trivy scanning in reporting mode to provide continuous visibility without blocking CI on demo assets. |
| 0006 | [Security Pipeline Audit Results](0006-security-pipeline-audit-results.md) | 2026-09-19 | Accepted | Validate defense-in-depth posture, DBSC hardware-backed session security, and zero CVE baseline. |
| 0007 | [Consolidate Security Governance, Pin Action SHAs, and Retire Redundant Testing Workflow](0007-consolidate-security-governance-and-pin-workflow-shas.md) | 2026-09-25 | Accepted | Retire duplicate testing workflow, pin GitHub Actions to full commit SHAs, and prevent script injection. |
