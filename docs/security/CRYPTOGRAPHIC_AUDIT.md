## 🛡️ Cryptographic Bill of Materials (CBOM) & PQC Migration Assessment

**Format**: CycloneDX (v1.6) | **First-Party Code Crypto Assets**: 0 | **Total Tracked Crypto Assets**: 16

### 📊 Post-Quantum Migration Scorecard

| Metric | Count | Migration Status |
|---|---|---|
| **Post-Quantum Ready (PQC)** | **0** | 🟢 Quantum-Resistant (NIST FIPS 203/204/205) |
| **Quantum-Vulnerable (Backlog)** | **6** | 🔴 At Risk of 'Harvest Now, Decrypt Later' |
| **Classical Symmetric / Digest** | **10** | 🟡 Classical Security (Requires AES-256 / SHA-256+) |
| **Asymmetric PQC Migration Progress** | **0.0%** | (0 of 6 asymmetric/vulnerable primitives migrated) |

### 🎯 Cryptographic Supply Chain Coverage & Confidence

| Evaluation Layer | Coverage / Status | Audit Confidence Assessment |
|---|---|---|
| **First-Party Code (`src/`, `scripts/`)** | **100% Audited** (0 Custom Primitives) | 🟢 **HIGH** (Direct AST & SAST verified) |
| **Third-Party Supply Chain** | **97.8%** (131 of 134 dependencies cataloged) | 🟢 HIGH (Known profiles assimilated) |
| **Overall Audit Confidence Score** | **97.8%** | 🟢 HIGH (2 unassimilated supply chain dependencies) |

| **System OS Inventory** | **Pending Update** | 🟡 **Warning** (Local OS crypto components not yet inventoried) |

### ✅ Post-Quantum Ready Assets

> ⚠️ **No Post-Quantum Ready assets detected.** Immediate migration planning recommended for asymmetric key exchanges and digital signatures.

### ⚠️ Quantum-Vulnerable Assets & Remediation Plan

| Component / Algorithm | Type / Primitive | Key Length / Curve | Recommended Target | Provenance / Context |
|---|---|---|---|---|
| **`@better-auth/core (Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: @better-auth/core@1.7.23` |
| **`@better-auth/utils (Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: @better-auth/utils@0.5.1` |
| **`@dbsc-toolkit/better-auth (DBSC Hardware-Bound Session Proof-of-Possession JWT (ES256 / RS256))`**<br><sub>ECDSA-P256 / RSA-2048</sub> | signature / signature | 256 / 2048 | **Migrate DBSC hardware-bound proof-of-possession signatures to hybrid ML-DSA-65 (FIPS 204) as W3C DBSC and WebCrypto PQC standards mature** | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: @dbsc-toolkit/better-auth@1.3.0` |
| **`better-auth (Auth OIDC / WebAuthn Asymmetric Verification (ES256 / RS256 / Ed25519))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Transition asymmetric OIDC/WebAuthn verifiers to ML-DSA (FIPS 204)** | Assimilated Upstream CBOM: Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: better-auth@1.7.23` |
| **`dbsc-toolkit (DBSC Hardware-Bound Session Proof-of-Possession JWT (ES256 / RS256))`**<br><sub>ECDSA-P256 / RSA-2048</sub> | signature / signature | 256 / 2048 | **Migrate DBSC hardware-bound proof-of-possession signatures to hybrid ML-DSA-65 (FIPS 204) as W3C DBSC and WebCrypto PQC standards mature** | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: dbsc-toolkit@2.15.1` |
| **`jose (JOSE Asymmetric JWS / JWE Key Management (ES256 / RS256 / EdDSA / ECDH-ES))`**<br><sub>ECDSA-P256 / RSA-2048 / Ed25519</sub> | signature / signature | 256 / 2048 | **Adopt IETF JOSE Post-Quantum ML-DSA (FIPS 204) and ML-KEM (FIPS 203) algorithms** | Assimilated Upstream CBOM: IETF JOSE (RFC 7515 JWS / RFC 7516 JWE / RFC 7519 JWT) Cryptographic Profile<br>`Dependency: jose@6.2.17` |

### 🔒 Classical Symmetric & Digest Assets

| Component Name | Primitive | Key Length | Quantum Resistance Assessment | Provenance / Location(s) |
|---|---|---|---|---|
| `@better-auth/core (Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: @better-auth/core@1.7.23` |
| `@better-auth/utils (Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: @better-auth/utils@0.5.1` |
| `@dbsc-toolkit/better-auth (DBSC Challenge & Session Binding Digest)` | hash | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: @dbsc-toolkit/better-auth@1.3.0` |
| `@noble/ciphers (Noble Authenticated Symmetric Ciphers (AES-256-GCM / ChaCha20-Poly1305 / XChaCha20))` | block-cipher | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Noble Audited JavaScript Ciphers (AES-GCM / ChaCha20-Poly1305)<br>`Dependency: @noble/ciphers@2.4.0` |
| `@noble/hashes (Noble Cryptographic Digest & KDF Suite (SHA-256 / SHA-512 / SHA3-256 / HKDF / scrypt))` | hash | 256 / 512 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Noble Audited JavaScript Hashes & KDFs (SHA-2 / SHA-3 / HKDF / PBKDF2 / scrypt)<br>`Dependency: @noble/hashes@2.4.0` |
| `better-auth (Auth Session Token Signing & CSRF HMAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Session, OIDC & CSRF Cryptographic Specification<br>`Dependency: better-auth@1.7.23` |
| `cookie-signature (Express Signed Cookie HMAC-SHA256 MAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Express Cookie HMAC-SHA256 Signing Specification<br>`Dependency: cookie-signature@1.0.6` |
| `cookie-signature (Express Signed Cookie HMAC-SHA256 MAC)` | mac | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: Express Cookie HMAC-SHA256 Signing Specification<br>`Dependency: cookie-signature@1.2.2` |
| `dbsc-toolkit (DBSC Challenge & Session Binding Digest)` | hash | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: W3C Device Bound Session Credentials (DBSC) Proof-of-Possession Specification<br>`Dependency: dbsc-toolkit@2.15.1` |
| `jose (JOSE Symmetric JWE Content Encryption & HMAC (A256GCM / HS256))` | block-cipher | 256 | Quantum-Resistant (Grover's proof) | Assimilated Upstream CBOM: IETF JOSE (RFC 7515 JWS / RFC 7516 JWE / RFC 7519 JWT) Cryptographic Profile<br>`Dependency: jose@6.2.17` |

### ⚠️ Unassimilated Third-Party Binaries & Cryptographic Blind Spots

> ℹ️ *The following third-party dependencies do not have verified upstream CBOM attestations in the catalog. They lower the audit confidence score until explicit CBOMs or attestations are published.* 

| Dependency Name | Version | Package URL (purl) | Status |
|---|---|---|---|
| `dbsc-express-demo` | 1.0.0 | `pkg:npm/dbsc-express-demo@1.0.0` | 🟡 Unassimilated (No upstream CBOM) |
| `fastify-plugin` | 6.0.1 | `pkg:npm/fastify-plugin@6.0.1` | 🟡 Unassimilated (No upstream CBOM) |

### ⚛️ Post-Quantum Cryptography (PQC) Modernization Roadmap

NIST finalized the principal post-quantum cryptography standards in August 2024: **FIPS 203** (ML-KEM), **FIPS 204** (ML-DSA), and **FIPS 205** (SLH-DSA). Below is the recommended migration path for replacing quantum-vulnerable public key algorithms and hardening symmetric ciphers against Grover's algorithm.

#### 🗺️ Cryptographic Algorithm Replacement Matrix

| Classical Primitive | Threat Mechanism | Post-Quantum Replacement | NIST Security Level | Migration Guidance |
|---|---|---|---|---|
| **RSA / Diffie-Hellman / ECDH / X25519** (Key Exchange / KEM) | Broken by Shor's algorithm | **ML-KEM-768 / ML-KEM-1024** (FIPS 203) or Hybrid **X25519MLKEM768** | Level 3 (AES-192 equiv) / Level 5 (AES-256 equiv) | Primary general-purpose key encapsulation. For TLS 1.3 and SSH, deploy hybrid `X25519MLKEM768` for seamless interoperability. |
| **RSA-PSS / ECDSA / Ed25519** (Digital Signatures) | Broken by Shor's algorithm | **ML-DSA-65 / ML-DSA-87** (FIPS 204) | Level 3 / Level 5 | Primary general-purpose lattice signatures for PKI, X.509 certs, code signing, and API tokens. |
| **High-Assurance Root / CA Signatures** | Broken by Shor's algorithm | **SLH-DSA** (FIPS 205 / SPHINCS+) | Level 1, 3, 5 | Stateless hash-based signatures with zero lattice assumptions; ideal for long-lived root trust stores. |
| **Firmware / Secure Boot Signing** | Broken by Shor's algorithm | **LMS / XMSS** (RFC 8554 / RFC 8391, NIST SP 800-208) | Level 3 / Level 5 | Stateful hash-based signatures with minimal memory/code overhead; optimal for microcontrollers. |
| **AES-128 (Symmetric Encryption)** | Halved by Grover's (effective 64-bit security) | **AES-256-GCM** or **ChaCha20-Poly1305** | Level 5 (effective 128-bit quantum security) | Upgrade symmetric key lengths from 128-bit to 256-bit to preserve Grover resistance. |
| **SHA-1 / MD5 (Hash Functions)** | Broken classical collisions + quantum Grover | **SHA-256 / SHA-384 / SHA-512 / SHA-3-256** | Level 3 - 5 | Deprecate weak digests immediately. Use SHA-256 or SHA-3-256 as quantum-safe baseline. |

#### 💻 Multi-Language PQC Implementation Recipes

<details>
<summary><b>Swift (iOS, macOS, Server-side Swift)</b></summary>

```swift
import CryptoKit
// 1. Symmetric Grover resistance (use 256-bit keys)
let symmetricKey = SymmetricKey(size: .bits256)
let sealedBox = try AES.GCM.seal(data, using: symmetricKey)

// 2. Post-Quantum KEM via SwiftCrypto / liboqs-swift:
#if canImport(OQS)
import OQS
let kem = OQSKEM(algorithm: .mlkem768)
let (publicKey, secretKey) = try kem.generateKeyPair()
let (ciphertext, sharedSecretSender) = try kem.encapsulate(publicKey: publicKey)
let sharedSecretReceiver = try kem.decapsulate(ciphertext: ciphertext, secretKey: secretKey)
#endif
```
</details>

<details>
<summary><b>Go (Go 1.24+ crypto/mlkem & Hybrid TLS)</b></summary>

```go
package main

import (
    "crypto/mlkem" // Standard library in Go 1.24+
    "crypto/tls"
)

func main() {
    // 1. FIPS 203 ML-KEM-768 Key Encapsulation
    decapsKey, _ := mlkem.GenerateKey768()
    encapsKey := decapsKey.EncapsulationKey()
    ciphertext, sharedSecretClient := encapsKey.Encapsulate()
    sharedSecretServer, _ := decapsKey.Decapsulate(ciphertext)
    _ = sharedSecretServer

    // 2. Hybrid Post-Quantum TLS 1.3 Client
    tlsConfig := &tls.Config{
        MinVersion:       tls.VersionTLS13,
        CurvePreferences: []tls.CurveID{tls.X25519MLKEM768, tls.X25519},
    }
    _ = tlsConfig
}
```
</details>

<details>
<summary><b>Python (cryptography 44.0+ & liboqs-python)</b></summary>

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# 1. Grover-resistant 256-bit symmetric AEAD
key = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(key)

# 2. FIPS 203 ML-KEM-768 via liboqs-python
import oqs
with oqs.KeyEncapsulation('ML-KEM-768') as kem:
    public_key = kem.generate_keypair()
    ciphertext, shared_secret_sender = kem.encap_secret(public_key)
    shared_secret_receiver = kem.decap_secret(ciphertext)
    assert shared_secret_sender == shared_secret_receiver
```
</details>

<details>
<summary><b>Rust (pqcrypto / aws-lc-rs)</b></summary>

```rust
use pqcrypto_kyber::kyber768; // FIPS 203 ML-KEM-768
use pqcrypto_traits::kem::{PublicKey, SecretKey, SharedSecret};

fn main() {
    let (pk, sk) = kyber768::keypair();
    let (ss_sender, ct) = kyber768::encapsulate(&pk);
    let ss_receiver = kyber768::decapsulate(&ct, &sk);
    assert_eq!(ss_sender.as_bytes(), ss_receiver.as_bytes());
}
```
</details>

<details>
<summary><b>Java / Kotlin (Bouncy Castle 1.78+)</b></summary>

```java
import org.bouncycastle.pqc.jcajce.provider.BouncyCastlePQCProvider;
import org.bouncycastle.pqc.jcajce.spec.MLKEMParameterSpec;
import java.security.*;

Security.addProvider(new BouncyCastlePQCProvider());
KeyPairGenerator kpg = KeyPairGenerator.getInstance("ML-KEM", "BCPQC");
kpg.initialize(MLKEMParameterSpec.ml_kem_768);
KeyPair kp = kpg.generateKeyPair();
```
</details>

<details>
<summary><b>TypeScript / Node.js</b></summary>

```typescript
import { mlkem768 } from '@noble/post-quantum/ml-kem';

const [aliceKeys, alicePub] = mlkem768.keygen();
const [ciphertext, sharedBob] = mlkem768.encapsulate(alicePub);
const sharedAlice = mlkem768.decapsulate(ciphertext, aliceKeys);
```
</details>

### 🌐 Open Source CBOM Intelligence & Supply Chain Attestation Locators

Third-party dependencies account for the vast majority of cryptographic attack surfaces. When upstream packages do not ship with explicit CBOM files, use the following sources and methods to uncover cryptographic metadata:

1. **OCI 1.1 / Sigstore Cosign Attestations (`application/vnd.cyclonedx+json`)**:
   - Many open-source container images and libraries attach CycloneDX CBOM attestations via Sigstore Cosign.
   - Query attestations using Cosign:
     ```bash
     cosign download attestation --predicate-type https://cyclonedx.org/bom ghcr.io/<org>/<image>:<tag> | jq -r .payload | base64 -d | jq .
     ```
2. **OpenSSF Security Insights (`SECURITY-INSIGHTS.yml`)**:
   - Repositories implementing OpenSSF Security Insights declare encryption standards and key management under `/.github/SECURITY-INSIGHTS.yml`.
3. **Package Registry Provenance & Hash Attestations**:
   - **PyPI (PEP 740)**: Inspect cryptographic provenance via `https://pypi.org/pypi/<package>/json`.
   - **npm Provenance**: Verify build provenance and sign-offs with `npm view <package> --json`.
   - **Swift Package Index**: Discover cryptography framework dependencies directly from SwiftPM manifests and DocC documentation.
4. **Direct Assimilation with `--external-cbom`**:
   - Ingest any vendor or upstream CycloneDX CBOM file directly into `jsi-bom-actions`:
     ```bash
     python scripts/analyze_cbom.py build/cbom.cyclonedx.json --sbom build/sbom.cyclonedx.json --external-cbom vendor.cbom.json
     ```
   - This directly credits verified dependencies and elevates the repository's **Audit Confidence Score**.
