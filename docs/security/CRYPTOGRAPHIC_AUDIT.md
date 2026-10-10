## 🛡️ Cryptographic Bill of Materials (CBOM) & PQC Migration Assessment

**Format**: CycloneDX (v1.6) | **First-Party Code Crypto Assets**: 0 | **Total Tracked Crypto Assets**: 0

### 📊 Post-Quantum Migration Scorecard

| Metric | Count | Migration Status |
|---|---|---|
| **Post-Quantum Ready (PQC)** | **0** | 🟢 Quantum-Resistant (NIST FIPS 203/204/205) |
| **Quantum-Vulnerable (Backlog)** | **0** | 🔴 At Risk of 'Harvest Now, Decrypt Later' |
| **Classical Symmetric / Hashing** | **0** | 🟡 Classical Security (Requires AES-256 / SHA-256+) |
| **Asymmetric PQC Migration Progress** | **N/A (0 detected)** | (No asymmetric primitives detected in current scope) |

### 🎯 Cryptographic Supply Chain Coverage & Confidence

| Evaluation Layer | Coverage / Status | Audit Confidence Assessment |
|---|---|---|
| **First-Party Code (`src/`)** | **100% Audited** (0 Custom Primitives) | 🟢 **HIGH** (Direct AST & SAST verified clean) |
| **Third-Party Supply Chain** | **0.0%** (0 of 145 dependencies cataloged) | 🔴 LOW (Known profiles assimilated) |
| **Overall Audit Confidence Score** | **0.7%** | **🔴 LOW** (145 unassimilated supply chain dependencies) |

### ✅ Post-Quantum Cryptography Migrated Assets

> ⚠️ **No Post-Quantum Ready assets detected.** Immediate migration planning recommended for asymmetric key exchanges and digital signatures.

### ⚠️ Quantum-Vulnerable Assets & Remediation Plan

> ℹ️ **No quantum-vulnerable asymmetric assets found.** No asymmetric cryptographic primitives were detected in current scope.

### 🔒 Classical Symmetric & Digest Assets

### ⚠️ Unassimilated Third-Party Binaries & Cryptographic Blind Spots

> ℹ️ *The following third-party dependencies do not have verified upstream CBOM attestations in the catalog. They lower the audit confidence score until explicit CBOMs or attestations are published.* 

| Dependency Name | Version | Package URL (purl) | Status |
|---|---|---|---|
| `@better-auth/core` | 1.7.7 | `pkg:npm/%40better-auth/core@1.7.7` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-auth/drizzle-adapter` | 1.7.7 | `pkg:npm/%40better-auth/drizzle-adapter@1.7.7` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-auth/kysely-adapter` | 1.7.7 | `pkg:npm/%40better-auth/kysely-adapter@1.7.7` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-auth/memory-adapter` | 1.7.7 | `pkg:npm/%40better-auth/memory-adapter@1.7.7` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-auth/mongo-adapter` | 1.7.7 | `pkg:npm/%40better-auth/mongo-adapter@1.7.7` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-auth/prisma-adapter` | 1.7.7 | `pkg:npm/%40better-auth/prisma-adapter@1.7.7` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-auth/telemetry` | 1.7.7 | `pkg:npm/%40better-auth/telemetry@1.7.7` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-auth/utils` | 0.4.2 | `pkg:npm/%40better-auth/utils@0.4.2` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-auth/utils` | 0.5.0 | `pkg:npm/%40better-auth/utils@0.5.0` | 🟡 Unassimilated (No upstream CBOM) |
| `@better-fetch/fetch` | 1.3.2 | `pkg:npm/%40better-fetch/fetch@1.3.2` | 🟡 Unassimilated (No upstream CBOM) |
| `@dbsc-toolkit/better-auth` | 1.2.2 | `pkg:npm/%40dbsc-toolkit/better-auth@1.2.2` | 🟡 Unassimilated (No upstream CBOM) |
| `@noble/ciphers` | 2.4.0 | `pkg:npm/%40noble/ciphers@2.4.0` | 🟡 Unassimilated (No upstream CBOM) |
| `@noble/hashes` | 2.4.0 | `pkg:npm/%40noble/hashes@2.4.0` | 🟡 Unassimilated (No upstream CBOM) |
| `@opentelemetry/semantic-conventions` | 1.43.0 | `pkg:npm/%40opentelemetry/semantic-conventions@1.43.0` | 🟡 Unassimilated (No upstream CBOM) |
| `@pinojs/redact` | 0.4.0 | `pkg:npm/%40pinojs/redact@0.4.0` | 🟡 Unassimilated (No upstream CBOM) |
| *... and 130 more unassimilated dependencies* | | | |
