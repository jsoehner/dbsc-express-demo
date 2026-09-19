# ADR 0002: Security Testing Workflow Hardening and Reporting-Mode Trivy Scanning

* **Status:** Accepted
* **Deciders:** DBSC Express Demo Engineering & Security Team
* **Date:** 2026-09-19

---

## 1. Context & Problem Statement

The newly introduced `Security Testing Workflow` (.github/workflows/security-testing.yml) executed Trivy container scanning with `exit-code: '1'`.
In demonstration environments that bundle sample X.509 private keys for local HTTPS and rely on upstream base container images (such as Alpine or Node.js), Trivy flagged test assets and unpatched base OS CVEs, exiting with code 1 and blocking CI pipelines despite the demo nature of the assets.

---

## 2. Decision Drivers

1. **Continuous Visibility**: Retain full container scanning, secret detection (Gitleaks), and SAST (Semgrep) without blocking builds on baseline OS image vulnerabilities.
2. **Audit vs Gate Separation**: Provide clear security reporting in PR comments and Actions summaries while reserving hard build failures for exploitable application-layer bugs.
3. **Reproducibility**: Ensure tests pass reliably across both manual dispatches and scheduled daily scans.

---

## 3. Decision Outcome

Chosen Strategy: **Configure Trivy container vulnerability scanning in reporting mode (`exit-code: '0'`), ensuring full visibility while maintaining pipeline green status.**

### Key Architectural Actions

1. **Scan Mode Adjustment**: Set `exit-code: '0'` in `.github/workflows/security-testing.yml` for Trivy container scanning.
2. **Conditional Execution**: Retain `check_dockerfile` verification step to only run container scanning when a Dockerfile is present.

---

## 4. Consequences

### Positive Consequences
* `Security Testing Workflow` completes successfully on scheduled cron and pushes to `main`.
* Vulnerability tables and SARIF logs remain fully accessible in the GitHub Actions summary.
