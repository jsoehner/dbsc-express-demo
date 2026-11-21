# ADR 0012: Adopt `jsi-build-verify` Reusable Workflow for Automated Functional Verification

* **Status:** Accepted
* **Deciders:** DBSC Express Demo Security & Architecture
* **Date:** 2026-11-21

---

## 1. Context & Problem Statement

`dbsc-express-demo` currently runs security scanning (`security-governance.yml`), BOM governance (`sbom-cbom.yml`), commit linting (`commit-lint.yml`), and Docker image publishing (`docker-publish.yml`), but lacks an automated pull-request gate that builds the Express application, runs its test suite, starts the live server, and verifies HTTP API and browser UI behavior end-to-end.

---

## 2. Decision Drivers

1. **Zero-Config AI-Assisted Functional Verification**: Adopt the reusable `jsoehner/jsi-build-verify` workflow (`v1.0.0`) in PR test-harness mode (`commit_mode: report-only`, `fail_on_error: true`, `comment_on_pr: true`) so every pull request receives live build, API, and headless Chrome verification plus token/cost accounting.
2. **Supply-Chain Integrity (ADR 0007)**: Pin both the reusable workflow `uses:` reference and its `workflow_ref` tooling input to the immutable 40-character commit SHA `accaaa7b714267e48b08ec2d75aec2b3da24bb90` (`v1.0.0`).
3. **Trusted OSS Compatibility**: Automatically reuse the repository's existing `TRUSTED_OSS_*` variables and `OSS_MTLS_CLIENT_CERT`/`OSS_MTLS_CLIENT_KEY` secrets alongside `GEMINI_API_KEY`.

---

## 3. Decision Outcome

1. Added `.github/workflows/verify.yml` invoking `jsoehner/jsi-build-verify/.github/workflows/jsi-build-verify.yml@accaaa7b714267e48b08ec2d75aec2b3da24bb90 # v1.0.0` on `pull_request` and `workflow_dispatch`.
2. Configured `GEMINI_API_KEY` in repository Actions secrets.
3. Retained all existing non-overlapping workflows (`commit-lint.yml`, `docker-publish.yml`, `nightly-dependency-update.yml`, `sbom-cbom.yml`, `security-governance.yml`).

---

## 4. Consequences & Verification

- **Positive**: Pull requests automatically validate installation, unit tests, server startup, API responses, and browser rendering with screenshots and sticky PR verdict comments.
- **Positive**: Zero duplication of build/smoke-test CI logic across repositories; both `uses:` and `workflow_ref:` are SHA-pinned to `v1.0.0`.
