## 🛡️ Cryptographic Bill of Materials (CBOM) & PQC Migration Assessment

**Format**: CycloneDX (v1.7) | **First-Party Code Crypto Assets**: 132 | **Total Tracked Crypto Assets**: 18

### 📊 Post-Quantum Migration Scorecard

| Metric | Count | Migration Status |
|---|---|---|
| **Post-Quantum Ready (PQC)** | **0** | 🟢 Quantum-Resistant (NIST FIPS 203/204/205) |
| **Quantum-Vulnerable (Backlog)** | **6** | 🔴 At Risk of 'Harvest Now, Decrypt Later' |
| **Classical Symmetric / Digest** | **12** | 🟡 Classical Security (Requires AES-256 / SHA-256+) |
| **Asymmetric PQC Migration Progress** | **0.0%** | (0 of 6 asymmetric primitives migrated) |

### 🎯 Cryptographic Supply Chain Coverage & Confidence

| Evaluation Layer | Coverage / Status | Audit Confidence Assessment |
|---|---|---|
| **First-Party Code (`src/`, `scripts/`)** | **100% Audited** (132 Crypto Primitive(s) Inventoried) | 🟢 **HIGH** (Direct AST & SAST verified) |
| **Third-Party Supply Chain** | **98.5%** (128 of 130 dependencies cataloged) | 🟢 HIGH (Known profiles assimilated) |
| **Overall Audit Confidence Score** | **98.5%** | 🟢 HIGH (0 unassimilated supply chain dependencies) |

| **System OS Inventory** | **Pending Update** | 🟡 **Warning** (Local OS crypto components not yet inventoried) |

### ✅ Post-Quantum Ready Assets

> ⚠️ **No Post-Quantum Ready assets detected.** Immediate migration planning recommended for asymmetric key exchanges and digital signatures.

### ⚠️ Quantum-Vulnerable Assets & Remediation Plan

| Component / Algorithm | Type / Primitive | Key Length / Curve | Recommended Target | Provenance / Context |
|---|---|---|---|---|
| **`better-auth (DBSC Hardware-Bound Session Proof-of-Possession JWT (ES256 / RS256))`**<br><sub>ECDSA-P256 / RSA-2048</sub> | signature / signature | 256 / 2048 | **Migrate DBSC hardware-bound proof-of-possession signatures to hybrid ML-DSA-65 (FIPS 204) as W3C DBSC and WebCrypto PQC standards mature** | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: better-auth@1.2.2` |
| **`better-auth (Better Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: better-auth@1.7.19` |
| **`core (Better Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: core@1.7.19` |
| **`utils (Better Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: utils@0.5.1` |
| **`jose (JOSE Asymmetric JWS / JWE Key Management (ES256 / RS256 / EdDSA / ECDH-ES))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Adopt IETF JOSE Post-Quantum ML-DSA (FIPS 204) and ML-KEM (FIPS 203) algorithms** | Assimilated Upstream CBOM: IETF JOSE (RFC 7515 JWS / RFC 7516 JWE / RFC 7519 JWT) Cryptographic Profile<br>`Dependency: jose@6.2.17` |
| **`dbsc-toolkit (DBSC Hardware-Bound Session Proof-of-Possession JWT (ES256 / RS256))`**<br><sub>ECDSA-P256 / RSA-2048</sub> | signature / signature | 256 / 2048 | **Migrate DBSC hardware-bound proof-of-possession signatures to hybrid ML-DSA-65 (FIPS 204) as W3C DBSC and WebCrypto PQC standards mature** | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: dbsc-toolkit@2.14.1` |

### 🔒 Classical Symmetric & Digest Assets

| Component Name | Primitive | Key Length | Quantum Resistance Assessment | Provenance / Location(s) |
|---|---|---|---|---|
| `server.key` | unknown | N/A | Review key length for Grover resistance | First-Party Code (SAST/AST)<br>Dependencies / External |
| `server.key` | unknown | N/A | Review key length for Grover resistance | First-Party Code (SAST/AST)<br>Dependencies / External |
| `better-auth (DBSC Challenge & Session Binding Digest)` | hash | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: better-auth@1.2.2` |
| `better-auth (Better Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: better-auth@1.7.19` |
| `core (Better Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: core@1.7.19` |
| `utils (Better Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: utils@0.5.1` |
| `hashes (Noble Cryptographic Digest & KDF Suite (SHA-256 / SHA-512 / SHA3-256 / HKDF / scrypt))` | hash | 256 / 512 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Noble Audited JavaScript Hashes & KDFs (SHA-2 / SHA-3 / HKDF / PBKDF2 / scrypt)<br>`Dependency: hashes@2.4.0` |
| `jose (JOSE Symmetric JWE Content Encryption & HMAC (A256GCM / HS256))` | block-cipher | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: IETF JOSE (RFC 7515 JWS / RFC 7516 JWE / RFC 7519 JWT) Cryptographic Profile<br>`Dependency: jose@6.2.17` |
| `ciphers (Noble Authenticated Symmetric Ciphers (AES-256-GCM / ChaCha20-Poly1305 / XChaCha20))` | block-cipher | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Noble Audited JavaScript Ciphers (AES-GCM / ChaCha20-Poly1305)<br>`Dependency: ciphers@2.4.0` |
| `dbsc-toolkit (DBSC Challenge & Session Binding Digest)` | hash | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: dbsc-toolkit@2.14.1` |
| `cookie-signature (Express Signed Cookie HMAC-SHA256 MAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Express Cookie HMAC-SHA256 Signing Specification<br>`Dependency: cookie-signature@1.2.2` |
| `cookie-signature (Express Signed Cookie HMAC-SHA256 MAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Express Cookie HMAC-SHA256 Signing Specification<br>`Dependency: cookie-signature@1.0.6` |
