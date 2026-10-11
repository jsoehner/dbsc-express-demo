# ADR 0007: Automated SBOM and CBOM Supply Chain Governance

* **Status:** Accepted
* **Deciders:** DBSC Express Demo Engineering & Security Team
* **Date:** 2026-10-11

---

## 1. Context & Problem Statement

Modern software supply chain governance mandates granular visibility into software components and their embedded cryptographic mechanisms. As a reference implementation of Device Bound Session Credentials (DBSC) leveraging TPM attestation, WebAuthn, Web Crypto, and TLS transport security, `dbsc-express-demo` requires rigorous cryptographic auditing and dependency transparency.

Without automated Bill of Materials (BOM) pipelines:
- Third-party dependency risks and open-source license postures are opaque.
- Cryptographic primitives (algorithms, key lengths, padding schemes) are difficult to inventory across application runtime and container boundaries.
- Readiness for Post-Quantum Cryptography (PQC) transitions cannot be systematically tracked.

---

## 2. Decision Drivers & Constraints

1. **Dual-Engine SBOM Coverage**: Produce both CycloneDX and SPDX industry standards for compatibility with downstream vulnerability and compliance engines.
2. **Cryptographic Bill of Materials (CBOM)**: Inventory all cryptographic assets, primitives, and protocol handshakes in compliance with emerging CycloneDX cryptography extension standards.
3. **AST Semantic Analysis & Reconciliation**: Validate declared cryptographic components against actual AST call sites in the codebase to prevent drift or uncataloged cryptography.
4. **CI/CD Automation & Test Harness**: Validate integrity, non-emptiness, and validity of generated BOMs automatically in CI (`.github/workflows/sbom-cbom.yml`) and locally.
5. **PQC Migration Readiness**: Generate quantum-readiness scoring and reports mapping classical vs. quantum-safe algorithms.

---

## 3. Considered Options

| Option | Approach Summary | Security Benefits | Trade-offs & Costs | Residual Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Option A (Chosen)** | Automated dual-engine SBOM (Syft), CBOM (cbomkit), AST crypto scanning, and CI test harness | End-to-end supply chain transparency, PQC readiness tracking, zero drift | Slight CI execution overhead (~1-2 min) | Low |
| **Option B** | SBOM-only generation (Syft CycloneDX) | Dependency vulnerability detection | Zero visibility into cryptographic algorithms and PQC risks | Medium |
| **Option C** | Manual periodic security & crypto audits | Zero CI infrastructure overhead | High human effort, quickly becomes stale, misses PR regressions | High |

---

## 4. Decision Outcome

**Chosen Option**: **Option A** — Integrate an automated dual-engine SBOM and CBOM generation pipeline, semantic AST crypto auditing, and continuous test verification harness.

### Key Architectural Components

1. **GitHub Actions Workflow (`.github/workflows/sbom-cbom.yml`)**:
   - Anchore / Syft action for CycloneDX JSON (`oss/sbom.cyclonedx.json`) and SPDX JSON (`oss/sbom.spdx.json`).
   - `cbomkit-action` for Cryptographic Bill of Materials (`oss/cbom.json`).
   - Python-based AST semantic crypto scanner (`scripts/scan_crypto_ast.py`) reconciling call sites with CBOM assets.
   - Verification test harness (`scripts/test_boms.sh`) asserting structural and semantic validity.
   - PQC migration dashboard generator (`scripts/analyze_cbom.py`) outputting to GitHub Step Summaries and publishing `docs/security/CRYPTOGRAPHIC_AUDIT.md`.
   - Node 24 standard pinned actions with full SHA pinning.
2. **Local Developer Tooling (`scripts/`)**:
   - `scripts/generate_boms.sh`: Generates SBOM and CBOM artifacts locally via Docker / Syft / cbomkit.
   - `scripts/scan_crypto_ast.py`: Scans application AST for crypto invocations.
   - `scripts/analyze_cbom.py`: Assesses quantum safety and algorithm migration posture.
   - `scripts/test_boms.sh`: Verifies generated artifacts locally.

---

## 5. Consequences

### Positive Consequences
* Complete transparency into software dependencies and cryptographic assets for DBSC implementation.
* Continuous PQC posture tracking across client and server layers.
* Automated gating against corrupt, empty, or schema-invalid BOM artifacts.
* Local developer workflows mirror CI pipeline capabilities.

### Negative Consequences / Trade-offs
* Requires maintaining Python helper scripts and tooling in `scripts/`.
* Added workflow steps increase CI run times slightly on main branch pushes and pull requests.
