## 🛡️ Cryptographic Bill of Materials (CBOM) & PQC Migration Assessment

**Format**: CycloneDX (v1.7) | **First-Party Code Crypto Assets**: 136 | **Total Tracked Crypto Assets**: 24

### 📊 Post-Quantum Migration Scorecard

| Metric | Count | Migration Status |
|---|---|---|
| **Post-Quantum Ready (PQC)** | **3** | 🟢 Quantum-Resistant (NIST FIPS 203/204/205) |
| **Quantum-Vulnerable (Backlog)** | **9** | 🔴 At Risk of 'Harvest Now, Decrypt Later' |
| **Classical Symmetric / Digest** | **12** | 🟡 Classical Security (Requires AES-256 / SHA-256+) |
| **Asymmetric PQC Migration Progress** | **25.0%** | (3 of 12 asymmetric primitives migrated) |

### 🎯 Cryptographic Supply Chain Coverage & Confidence

| Evaluation Layer | Coverage / Status | Audit Confidence Assessment |
|---|---|---|
| **First-Party Code (`src/`, `scripts/`)** | **100% Audited** (136 Crypto Primitive(s) Inventoried) | 🟢 **HIGH** (Direct AST & SAST verified) |
| **Third-Party Supply Chain** | **97.0%** (128 of 132 dependencies cataloged) | 🟢 HIGH (Known profiles assimilated) |
| **Overall Audit Confidence Score** | **97.0%** | 🟢 HIGH (2 unassimilated supply chain dependencies) |

| **System OS Inventory** | **Pending Update** | 🟡 **Warning** (Local OS crypto components not yet inventoried) |

### ✅ Post-Quantum Ready Assets

| Component Name | Primitive | Key/Parameter Set | PQC Standard | Provenance / Location(s) |
|---|---|---|---|---|
| `ML-DSA-65` | signature | N/A | ML-DSA-65 (FIPS 204) | First-Party Code (SAST/AST)<br>`server.js:19`<br>`server.js:34`<br>`server.js:49`<br>`server.js:52`<br>`server.js:199` |
| `post-quantum (Noble ML-DSA-65 Post-Quantum Digital Signatures (Security Audit Log Attestation))` | signature | 1952-byte public key / 3309-byte signature | ML-DSA-65 (FIPS 204) | Assimilated Upstream CBOM: Noble Audited Post-Quantum Cryptography (NIST FIPS 203 ML-KEM & FIPS 204 ML-DSA)<br>`Dependency: post-quantum@0.7.1` |
| `post-quantum (Noble ML-KEM-768 Post-Quantum Key Encapsulation)` | kem | 1184-byte public key | ML-KEM-768 (FIPS 203) | Assimilated Upstream CBOM: Noble Audited Post-Quantum Cryptography (NIST FIPS 203 ML-KEM & FIPS 204 ML-DSA)<br>`Dependency: post-quantum@0.7.1` |

### ⚠️ Quantum-Vulnerable Assets & Remediation Plan

| Component / Algorithm | Type / Primitive | Key Length / Curve | Recommended Target | Provenance / Context |
|---|---|---|---|---|
| **`ECDSA-P256`**<br><sub>ECDSA-P256</sub> | algorithm / signature | secp256r1 | **ML-DSA-65 / Dilithium (FIPS 204)** | First-Party Code (SAST/AST)<br>`server.js:35`<br><sub><code>const PQC_TLS_CURVES = "X25519MLKEM768:X25519:P-256:P-384";</code></sub><br><br>`server.js:202`<br><sub><code>dbscSessionBinding: "ECDSA-P256 / RSA-2048 (Hardware TPM / WebCrypto - awaiting W3C DBSC PQC)",</code></sub> |
| **`ECDH-X25519`**<br><sub>ECDH-X25519</sub> | algorithm / key-agreement | 25519 | **ML-KEM-768 / Kyber (FIPS 203)** | First-Party Code (SAST/AST)<br>`server.js:35`<br><sub><code>const PQC_TLS_CURVES = "X25519MLKEM768:X25519:P-256:P-384";</code></sub><br><br>`server.js:197`<br><sub><code>tlsKeyExchange: supportsHybridPqcTls ? "X25519MLKEM768" : "X25519",</code></sub> |
| **`RSA-2048`**<br><sub>RSA-2048</sub> | algorithm / signature | 2048 | **ML-KEM-768 / Kyber (FIPS 203)** | First-Party Code (SAST/AST)<br>`server.js:202`<br><sub><code>dbscSessionBinding: "ECDSA-P256 / RSA-2048 (Hardware TPM / WebCrypto - awaiting W3C DBSC PQC)",</code></sub> |
| **`better-auth (DBSC Hardware-Bound Session Proof-of-Possession JWT (ES256 / RS256))`**<br><sub>ECDSA-P256 / RSA-2048</sub> | signature / signature | 256 / 2048 | **Migrate DBSC hardware-bound proof-of-possession signatures to hybrid ML-DSA-65 (FIPS 204) as W3C DBSC and WebCrypto PQC standards mature** | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: better-auth@1.3.0` |
| **`better-auth (Better Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: better-auth@1.7.25` |
| **`core (Better Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: core@1.7.25` |
| **`utils (Better Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: utils@0.5.1` |
| **`jose (JOSE Asymmetric JWS / JWE Key Management (ES256 / RS256 / EdDSA / ECDH-ES))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Adopt IETF JOSE Post-Quantum ML-DSA (FIPS 204) and ML-KEM (FIPS 203) algorithms** | Assimilated Upstream CBOM: IETF JOSE (RFC 7515 JWS / RFC 7516 JWE / RFC 7519 JWT) Cryptographic Profile<br>`Dependency: jose@6.2.17` |
| **`dbsc-toolkit (DBSC Hardware-Bound Session Proof-of-Possession JWT (ES256 / RS256))`**<br><sub>ECDSA-P256 / RSA-2048</sub> | signature / signature | 256 / 2048 | **Migrate DBSC hardware-bound proof-of-possession signatures to hybrid ML-DSA-65 (FIPS 204) as W3C DBSC and WebCrypto PQC standards mature** | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: dbsc-toolkit@2.16.2` |

### 🔒 Classical Symmetric & Digest Assets

| Component Name | Primitive | Key Length | Quantum Resistance Assessment | Provenance / Location(s) |
|---|---|---|---|---|
| `server.key` | unknown | N/A | Review key length for Grover resistance | First-Party Code (SAST/AST)<br>Dependencies / External |
| `server.key` | unknown | N/A | Review key length for Grover resistance | First-Party Code (SAST/AST)<br>Dependencies / External |
| `better-auth (DBSC Challenge & Session Binding Digest)` | hash | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: better-auth@1.3.0` |
| `better-auth (Better Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: better-auth@1.7.25` |
| `core (Better Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: core@1.7.25` |
| `utils (Better Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Better Auth Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: utils@0.5.1` |
| `hashes (Noble Cryptographic Digest & KDF Suite (SHA-256 / SHA-512 / SHA3-256 / HKDF / scrypt))` | hash | 256 / 512 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Noble Audited JavaScript Hashes & KDFs (SHA-2 / SHA-3 / HKDF / PBKDF2 / scrypt)<br>`Dependency: hashes@2.4.0` |
| `jose (JOSE Symmetric JWE Content Encryption & HMAC (A256GCM / HS256))` | block-cipher | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: IETF JOSE (RFC 7515 JWS / RFC 7516 JWE / RFC 7519 JWT) Cryptographic Profile<br>`Dependency: jose@6.2.17` |
| `ciphers (Noble Authenticated Symmetric Ciphers (AES-256-GCM / ChaCha20-Poly1305 / XChaCha20))` | block-cipher | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Noble Audited JavaScript Ciphers (AES-GCM / ChaCha20-Poly1305)<br>`Dependency: ciphers@2.4.0` |
| `dbsc-toolkit (DBSC Challenge & Session Binding Digest)` | hash | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: dbsc-toolkit@2.16.2` |
| `cookie-signature (Express Signed Cookie HMAC-SHA256 MAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Express Cookie HMAC-SHA256 Signing Specification<br>`Dependency: cookie-signature@1.2.2` |
| `cookie-signature (Express Signed Cookie HMAC-SHA256 MAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Express Cookie HMAC-SHA256 Signing Specification<br>`Dependency: cookie-signature@1.0.6` |

### ⚠️ Unassimilated Third-Party Binaries & Cryptographic Blind Spots

> ℹ️ *The following third-party dependencies do not have verified upstream CBOM attestations in the catalog. They lower the audit confidence score until explicit CBOMs or attestations are published.* 

| Dependency Name | Version | Package URL (purl) | Status |
|---|---|---|---|
| `fastify-plugin` | 6.0.1 | `pkg:npm/fastify-plugin@6.0.1` | 🟡 Unassimilated (No upstream CBOM) |
| `curves` | 2.4.0 | `pkg:npm/%40noble/curves@2.4.0` | 🟡 Unassimilated (No upstream CBOM) |
