# ADR 0010: Hybrid Post-Quantum Cryptography (PQC) TLS & Audit Signing Migration

* **Status:** Accepted
* **Deciders:** DBSC Express Demo Engineering & Security Team
* **Date:** 2026-11-17

---

## 1. Context & Problem Statement

Our Cryptographic Bill of Materials (CBOM) audit (`docs/security/CRYPTOGRAPHIC_AUDIT.md`) identified 6 quantum-vulnerable asymmetric cryptographic assets across transport key exchange and session/token signatures, exposing traffic and audit records to "Harvest Now, Decrypt Later" (HNDL) threats.

In accordance with our **Hybrid Post-Quantum Cryptography Migration and CBOM Audit Standard**, we must transition transport key exchange and first-party cryptographic integrity mechanisms to NIST FIPS 203 (ML-KEM-768) and FIPS 204 (ML-DSA-65) while maintaining backward compatibility for browser clients and hardware TPM/WebAuthn session bindings.

---

## 2. Decision Drivers & Constraints

1. **Zero-Breakage Hybrid Transport**: Modern Chromium/Firefox clients support `X25519MLKEM768` in TLS 1.3 natively, while older clients require classical `X25519`/`P-256` fallback.
2. **Verifiable First-Party Audit Integrity**: Security audit events written to `logs/security.log` should carry post-quantum digital signatures (`ML-DSA-65`, FIPS 204).
3. **Hardware-Bound DBSC Compatibility**: W3C Device Bound Session Credentials (`dbsc-toolkit`) and WebAuthn currently rely on TPM/Secure Enclave ECDSA P-256 / RSA-2048 keys; these upstream dependencies cannot be unilaterally replaced until browser WebCrypto/TPM and `jose` standardize FIPS 204.

---

## 3. Decision Outcome

1. **Hybrid Post-Quantum TLS 1.3 Key Exchange (`server.js`)**:
   - Configure `https.createServer` with `ecdhCurve: "X25519MLKEM768:X25519:P-256:P-384"` and `minVersion: "TLSv1.2"` when supported by the Node/OpenSSL runtime.
2. **Post-Quantum Audit Event Signing (`@noble/post-quantum`)**:
   - Sign structured security audit events (`logAuthEvent` in `server.js`) using **FIPS 204 `ML-DSA-65`** via `@noble/post-quantum/ml-dsa.js`.
   - Expose `GET /api/crypto/pqc-status` to report live hybrid PQC TLS support, the active `ML-DSA-65` public key, and the remaining DBSC/WebAuthn migration roadmap.
3. **Roadmap for Remaining Upstream Assets**:
   - `dbsc-toolkit`, `@dbsc-toolkit/better-auth`, `better-auth`, and `jose` remain tracked in `docs/security/CRYPTOGRAPHIC_AUDIT.md` for hybrid `ML-DSA-65` adoption as W3C DBSC and IETF JOSE PQC specifications finalize.

---

## 4. Consequences

### Positive
* Protects all HTTPS traffic against Harvest Now, Decrypt Later attacks via `X25519MLKEM768`.
* Provides quantum-resistant integrity signatures (`ML-DSA-65`) on security audit logs.
* Moves CBOM PQC migration progress above 0% with verified `POST-QUANTUM READY` assets.

### Negative / Trade-offs
* Adds `@noble/post-quantum` (~zero-dependency audited JS) to `package.json`.
* Runtime `ML-DSA-65` audit keys are ephemeral per process restart unless persisted to a KMS/HSM in production.
