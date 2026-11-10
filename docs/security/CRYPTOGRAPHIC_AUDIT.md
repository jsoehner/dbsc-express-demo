## 🛡️ Cryptographic Bill of Materials (CBOM) & PQC Migration Assessment

**Format**: CycloneDX (v1.7) | **First-Party Code Crypto Assets**: 132 | **Total Tracked Crypto Assets**: 2

### 📊 Post-Quantum Migration Scorecard

| Metric | Count | Migration Status |
|---|---|---|
| **Post-Quantum Ready (PQC)** | **0** | 🟢 Quantum-Resistant (NIST FIPS 203/204/205) |
| **Quantum-Vulnerable (Backlog)** | **0** | 🔴 At Risk of 'Harvest Now, Decrypt Later' |
| **Classical Symmetric / Digest** | **2** | 🟡 Classical Security (Requires AES-256 / SHA-256+) |
| **Asymmetric PQC Migration Progress** | **N/A (0 detected)** | (No asymmetric primitives detected in current scope) |

### 🎯 Cryptographic Supply Chain Coverage & Confidence

| Evaluation Layer | Coverage / Status | Audit Confidence Assessment |
|---|---|---|
| **First-Party Code (`src/`, `scripts/`)** | **100% Audited** (132 Crypto Primitive(s) Inventoried) | 🟢 **HIGH** (Direct AST & SAST verified) |
| **Third-Party Supply Chain** | **10.8%** (14 of 130 dependencies cataloged) | 🔴 LOW (Known profiles assimilated) |
| **Overall Audit Confidence Score** | **11.5%** | 🔴 LOW (116 unassimilated supply chain dependencies) |

| **System OS Inventory** | **Pending Update** | 🟡 **Warning** (Local OS crypto components not yet inventoried) |

### ✅ Post-Quantum Ready Assets

> ⚠️ **No Post-Quantum Ready assets detected.** Immediate migration planning recommended for asymmetric key exchanges and digital signatures.

### ⚠️ Quantum-Vulnerable Assets & Remediation Plan

> ℹ️ **No quantum-vulnerable asymmetric assets found.** Asymmetric cryptographic primitives were not detected in current scope.

### 🔒 Classical Symmetric & Digest Assets

| Component Name | Primitive | Key Length | Quantum Resistance Assessment | Provenance / Location(s) |
|---|---|---|---|---|
| `server.key` | unknown | N/A | Review key length for Grover resistance | First-Party Code (SAST/AST)<br>Dependencies / External |
| `server.key` | unknown | N/A | Review key length for Grover resistance | First-Party Code (SAST/AST)<br>Dependencies / External |

### ⚠️ Unassimilated Third-Party Binaries & Cryptographic Blind Spots

> ℹ️ *The following third-party dependencies do not have verified upstream CBOM attestations in the catalog. They lower the audit confidence score until explicit CBOMs or attestations are published.* 

| Dependency Name | Version | Package URL (purl) | Status |
|---|---|---|---|
| `better-auth` | 1.2.2 | `pkg:npm/%40dbsc-toolkit/better-auth@1.2.2` | 🟡 Unassimilated (No upstream CBOM) |
| `better-auth` | 1.7.19 | `pkg:npm/better-auth@1.7.19` | 🟡 Unassimilated (No upstream CBOM) |
| `core` | 1.7.19 | `pkg:npm/%40better-auth/core@1.7.19` | 🟡 Unassimilated (No upstream CBOM) |
| `utils` | 0.5.1 | `pkg:npm/%40better-auth/utils@0.5.1` | 🟡 Unassimilated (No upstream CBOM) |
| `hashes` | 2.4.0 | `pkg:npm/%40noble/hashes@2.4.0` | 🟡 Unassimilated (No upstream CBOM) |
| `fetch` | 1.3.3 | `pkg:npm/%40better-fetch/fetch@1.3.3` | 🟡 Unassimilated (No upstream CBOM) |
| `better-call` | 1.4.5 | `pkg:npm/better-call@1.4.5` | 🟡 Unassimilated (No upstream CBOM) |
| `zod` | 4.6.7 | `pkg:npm/zod@4.6.7` | 🟡 Unassimilated (No upstream CBOM) |
| `rou3` | 0.9.2 | `pkg:npm/rou3@0.9.2` | 🟡 Unassimilated (No upstream CBOM) |
| `set-cookie-parser` | 3.2.2 | `pkg:npm/set-cookie-parser@3.2.2` | 🟡 Unassimilated (No upstream CBOM) |
| `jose` | 6.2.17 | `pkg:npm/jose@6.2.17` | 🟡 Unassimilated (No upstream CBOM) |
| `kysely` | 0.29.8 | `pkg:npm/kysely@0.29.8` | 🟡 Unassimilated (No upstream CBOM) |
| `nanostores` | 1.5.5 | `pkg:npm/nanostores@1.5.5` | 🟡 Unassimilated (No upstream CBOM) |
| `spec` | 1.1.0 | `pkg:npm/%40standard-schema/spec@1.1.0` | 🟡 Unassimilated (No upstream CBOM) |
| `drizzle-adapter` | 1.7.19 | `pkg:npm/%40better-auth/drizzle-adapter@1.7.19` | 🟡 Unassimilated (No upstream CBOM) |
| *... and 101 more unassimilated dependencies* | | | |
