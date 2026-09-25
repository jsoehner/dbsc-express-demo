# ADR 0007: Consolidate Security Governance, Pin Action SHAs, and Retire Redundant Testing Workflow

* **Status:** Accepted
* **Deciders:** DBSC Express Demo Engineering & Security Team
* **Date:** 2026-09-25

---

## 1. Context & Problem Statement

Static analysis (Semgrep) identified supply chain risks in GitHub Actions workflows:
1. Steps referenced mutable tags (`docker/login-action@v3`), exposing builds to potential tag mutation and supply chain attacks.
2. A duplicate workflow (`.github/workflows/security-testing.yml`) remained from an earlier governance template installation, creating redundant scan jobs and runner conflicts with `.github/workflows/security-governance.yml`.

---

## 2. Decision Outcome

1. **Retire Redundant Workflow**: Removed `.github/workflows/security-testing.yml`. The repository's authoritative security gating pipeline is `.github/workflows/security-governance.yml`.
2. **Commit SHA Pinning**: Pinned all third-party GitHub Actions across `.github/workflows/security-governance.yml`, `.github/workflows/docker-publish.yml`, and `.github/workflows/security-scan.yml` to full 40-character commit hashes.
3. **Runner Script Hardening & Bot Exemption**: In `.github/workflows/security-governance.yml`, isolated GitHub context variables into a step-level `env:` block (`$ACTOR`, `$BASE_REF`, `$EVENT_NAME`) and added bot exemption for automated dependency PRs.
4. **Deploy Gatekeeper Utility**: Added `scripts/adr_security_gatekeeper.py` to ensure local and CI gatekeeper conformance.

---

## 3. Consequences

### Positive Consequences
* Eliminated workflow duplication, conflicting job executions, and runner resource waste.
* Fully hardened against supply chain tag tampering and bash script injection.
* Semgrep automated security scan across `.github/workflows/` and full repository passes with **0 findings**.

### Negative Consequences
* Dependency upgrade automation is required to manage future action version updates.
