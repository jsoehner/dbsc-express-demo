# Build & Functional Verification Report

- **Repository**: `jsoehner/dbsc-express-demo`
- **Verification Date**: `2026-11-20`
- **Verified By**: **Jeffs' Automated build and deploy agent**
- **Status**: `VERIFIED` (Build, Unit Tests, HTTPS APIs, Hybrid PQC Posture, and Guided Browser UI)
- **Runtime Tested**: Node.js `v22.23.2` / npm `10.9.8` (Linux)

## 1. Trusted OSS Split-Horizon Configuration

Configured via `setup_trusted_oss_repo.py` (`--mode virtual`):
- **Local LAN Cache URL** (`.env`, excluded from Git via `.gitignore` and `.git/info/exclude`): `http://oss.jsigroup.local:8080`
- **GitHub Actions WAN Variables**:
  - `TRUSTED_OSS_CACHE_URL=https://jsigroup-oss.duckdns.org`
  - `TRUSTED_OSS_MODE=virtual`
  - `TRUSTED_OSS_GPG_EMAIL=oss-signing@the-techy.com`
- **GitHub Actions mTLS Secrets**: `OSS_MTLS_CLIENT_CERT` and `OSS_MTLS_CLIENT_KEY` configured.
- **Registry Note**: The local Trusted OSS cache currently proxies PyPI/Maven (`http://oss.jsigroup.local:8080/npm/express` returns `404`), so Node.js dependencies were installed cleanly via `npm ci` from the lockfile (`package-lock.json`).

## 2. Build & Run Commands

```bash
# Clean install from lockfile
npm ci

# Run automated unit & integration test suite
npm test

# Run isolated HTTPS verification server on a clean port & SQLite DB
PORT=3001 BASE_URL=https://localhost:3001 DATABASE_URL=/tmp/dbsc-verify.sqlite node server.js
```

### Build Results
- `npm ci`: Added `115` packages, audited `116` packages, **0 vulnerabilities**.
- Startup migrations: Automatically applied Better Auth & DBSC SQLite tables (`user`, `session`, `account`, `verification`, `dbscSession`, `dbscBoundKey`).
- Hybrid PQC TLS 1.3 (`X25519MLKEM768`): **ENABLED**.

## 3. Functional Verification Results

### Automated Tests (`npm test`)
- Command: `node --test tests/server.test.js`
- Result: **6 / 6 passed** (`0` failed, `1489.6 ms`):
  1. `GET /health returns 200 and security headers`
  2. `GET /me rejects unauthenticated requests without DBSC proof`
  3. `POST /api/auth/delete-account rejects unauthenticated requests`
  4. `GET /api/crypto/pqc-status reports ML-DSA-65 and hybrid PQC TLS support`
  5. `GET / serves CSP-compliant HTML without inline scripts and serves external JS modules`
  6. `POST /api/auth/sign-up/email creates a user on a fresh migrated database`

### Guided Browser Verification (`browser_verify.py` via CDP)
- **Target URL**: `https://localhost:3001/`
- **HTTP Status**: `200`
- **Page Title**: `DBSC Device Binding Demo`
- **Expected Text (`"Device Bound Sessions"`)**: Found (`true`)
- **Interactive UI Test**: Clicked `#signup-btn` (`CLICKED`), triggering Better Auth registration and issuing `__Host-dbsc-session`, `__Host-dbsc-reg`, and `__Host-dbsc-challenge` cookies.
- **Console Errors**: `0`
- **Uncaught Exceptions**: `0`

### API Verification (`api_verify.py` via `curl`)

| Method | Endpoint | HTTP Status | Verification Outcome |
| :--- | :--- | :---: | :--- |
| `GET` | `https://localhost:3001/health` | `200` | `{"status":"ok","db":"connected"}` |
| `GET` | `https://localhost:3001/api/crypto/pqc-status` | `200` | `tlsKeyExchange: "X25519MLKEM768"`, `tlsHybridPqcSupported: true`, `auditSignatureAlgorithm: "ML-DSA-65"` (`NIST FIPS 204`) |
| `GET` | `https://localhost:3001/me` (unauthenticated) | `403` | Expected DBSC proof enforcement (`code: "NO_BINDING"`) |
| `GET` | `https://localhost:3001/js/app.js` | `200` | External CSP-compliant JS module served (`text/javascript`) |
| `POST` | `https://localhost:3001/api/auth/sign-up/email` | `200` | User registered and session token issued |
| `GET` | `https://localhost:3000/health` (existing Docker container) | `200` | Pre-existing `dbsc-express-demo` container confirmed healthy & untouched |
