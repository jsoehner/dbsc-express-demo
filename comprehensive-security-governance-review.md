# Comprehensive Security Governance Review
**Project:** `dbsc-express-demo`  
**Date:** 2026-09-12  
**Frameworks:** STRIDE, OWASP ASVS v4.0, GDPR/CCPA, W3C Device-Bound Session Credentials (DBSC)  
**Status:** Orchestrated Security Review & Threat Assessment

---

## 1. Executive Summary & Audit Scope

The `dbsc-express-demo` application demonstrates Device-Bound Session Credentials (DBSC) implemented on Node.js/Express, Better Auth, and SQLite. DBSC mitigates cookie theft and session hijacking by binding user sessions to client cryptographic hardware (TPM / Secure Enclave) via asymmetric key pairs and per-request signed proofs.

This governance review evaluates the architectural security posture across five key dimensions:
1. **Secrets & Cryptographic Assets**: Key management, certificate generation, `.gitignore` filtering.
2. **Authentication & Session Lifecycle**: Better Auth configuration, DBSC proof verification, session retention.
3. **Application & API Hardening**: Express middleware stack, Helmet CSP/headers, CORS, rate limiting, and error handling.
4. **Container & Environment Isolation**: Docker multi-stage builds, non-root execution, file permission boundaries.
5. **CI/CD Supply Chain Security**: GitHub Actions workflow integrity, action SHA pinning, token scopes, automated dependency pipelines.

---

## 2. Audit of Existing Controls (Verification of SEC-REQ-001 – 004)

| Control ID | Requirement | Implementation Status | Verification Findings |
|---|---|---|---|
| **SEC-REQ-001** | Structured Audit Logging | **Implemented** | Configured `pino` and `pino-http` in [server.js](file:///Users/jsoehner/dbsc-express-demo/server.js#L21-L26). Auth hooks log session creation, deletion, and user registration. DBSC plugin logs TPM/DBSC binding tier events. |
| **SEC-REQ-002** | Granular Auth Rate Limiting | **Implemented** | Applied 100 req/15min global limiter, plus a tighter 20 req/5min limiter specifically on `/api/auth` routes in [server.js](file:///Users/jsoehner/dbsc-express-demo/server.js#L126-L132). |
| **SEC-REQ-003** | Error Handling & Stack Masking | **Implemented** | Global Express error handler masks raw stack traces and error details when `NODE_ENV === "production"`, emitting structured error logs to Pino in [server.js](file:///Users/jsoehner/dbsc-express-demo/server.js#L147-L152). |
| **SEC-REQ-004** | Session Data Retention Cleanup | **Implemented** | Hourly background task purges expired sessions from SQLite using parameterized queries in [server.js](file:///Users/jsoehner/dbsc-express-demo/server.js#L54-L70). |

---

## 3. Threat Modeling (STRIDE Analysis)

| Threat Category | Potential Attack Vectors | Current Controls | Severity | Residual Risk & Action Items |
|---|---|---|---|---|
| **S**poofing | • Session cookie theft (Infostealers, malware)<br>• Replay of intercepted DBSC challenge responses<br>• Downgrade attacks from Hardware-bound to Unbound sessions | • `better-auth` secure cookie management<br>• DBSC client-side TPM key pair generation<br>• `requireProof()` middleware on `/me` | **Low** | • **Finding**: DBSC tier downgrade detection is logged to stdout but not enforced as a hard gate across all non-public APIs.<br>• **Action**: Ensure endpoints enforce minimum DBSC binding tier (e.g. require `hardware` tier for sensitive transactions). |
| **T**ampering | • Local SQLite database tampering on container volume<br>• Manipulation of request payloads / prototype pollution<br>• MITM modification of traffic | • Self-signed HTTPS enforcement (`https.createServer`)<br>• JSON body parsing capped at 10KB (`express.json({ limit: '10kb' })`)<br>• Non-root `node` container execution | **Low** | • **Finding**: Self-signed certificates without strict CA pinning are vulnerable to interception if client trusts untrusted roots.<br>• **Action**: Ensure production uses valid CA-signed certs (e.g., Let's Encrypt / reverse proxy terminating TLS). |
| **R**epudiation | • User denies performing actions<br>• Administrator denies config modifications | • Structured Pino logging for auth hooks (`session_created`, `session_deleted`, `user_registered`) | **Low** | • **Finding**: IP addresses and User-Agents are not consistently logged in audit events.<br>• **Action**: Enrich session audit logs with client IP, user agent, and DBSC key ID. |
| **I**nformation Disclosure | • Private key leakage via git tracking or Docker layers<br>• Leaking server version and stack details<br>• Permissive CORS allowing cross-origin exfiltration | • `helmet()` default security headers<br>• `.gitignore` includes `certs/`, `*.key`, `*.cert`<br>• CORS restricted to `BASE_URL` | **Medium** | • **Finding 1**: Dockerfile bakes `server.key` into container image layers.<br>• **Finding 2**: In [server.js](file:///Users/jsoehner/dbsc-express-demo/server.js#L32), CORS origin defaults to `http://localhost:3000` while HTTPS listens on `https://localhost:3000`.<br>• **Finding 3**: Rogue backtick syntax in `.gitignore` on line 21.<br>• **Finding 4**: Untracked `database.db` not covered by `.gitignore` (only `db.sqlite` is listed). |
| **D**enial of Service | • Auth brute forcing & credential stuffing<br>• Slowloris / HTTP body exhaustion<br>• ReDoS (Regular Expression Denial of Service) | • Dual-tiered rate limiting (global + `/api/auth`)<br>• 10KB payload body limit<br>• Single-process non-blocking async handlers | **Low** | • **Finding**: SQLite lock contention if concurrent writes spike under heavy load.<br>• **Action**: Enable SQLite WAL (Write-Ahead Logging) mode on database connection initialization. |
| **E**levation of Privilege | • Container breakout to host system<br>• Unauthorized horizontal/vertical privilege escalation | • Non-root `USER node` in Dockerfile<br>• Minimal Alpine Linux base image (`node:24-alpine`)<br>• Dependency vulnerability gating (`npm audit`: 0 vulnerabilities) | **Low** | • **Finding**: No explicit Role-Based Access Control (RBAC) model defined yet in Better Auth configuration.<br>• **Action**: Add explicit role verification (e.g. Better Auth admin plugin) as application expands. |

---

## 4. Compliance & Privacy Posture

### 4.1 GDPR & CCPA (Data Privacy & Minimization)
- **Data Collected**: `email`, `name`, `ipAddress`, `userAgent`, and `session` tokens stored in SQLite.
- **Data Minimization**: Implemented automated hourly purge of expired sessions (`DELETE FROM session WHERE expiresAt < ?`).
- **Right to Erasure (Article 17 GDPR)**: Currently, there is no self-service user deletion endpoint (`/api/auth/delete-account`). Adding an account deletion route with cascading removal of user credentials and DBSC binding keys is required for full GDPR compliance.
- **Lawful Basis & Notice**: Application privacy notice must document that IP addresses and user agents are collected under **Legitimate Interest** for fraud prevention and cryptographic session binding.

### 4.2 W3C DBSC Specification Alignment
- **Binding Tier Observability**: Application successfully tracks binding tiers (`hardware`, `software`, `fallback`).
- **Proof-of-Possession**: Endpoints decorated with `requireProof()` enforce cryptographic challenge-response validation.
- **Session Termination**: Calling `/api/auth/sign-out` clears cookies and emits DBSC lifecycle events.

---

## 5. Vulnerability Scanning & Supply Chain Assurance

1. **Dependency Audit (`npm audit`)**:
   - Status: **0 vulnerabilities** found across 152 audited packages.
   - Core dependencies up to date: `better-auth` (^1.7.4), `express` (^5.2.1), `helmet` (^8.3.0), `pino` (^10.3.1), `qs` (^6.16.0).

2. **GitHub Actions Supply Chain Hardening**:
   - Pinned all actions to explicit 40-character commit SHAs in accordance with the `github-actions-node24` security standard.
   - Replaced mutable tag references (`actions/checkout@v7` -> `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1`).
   - Hardened `nightly-dependency-update.yml` with resilient token verification to avoid credential failure.

---

## 6. Security Requirements Extraction (Backlog)

The following actionable security requirements are derived from this governance review:

### **[SEC-REQ-005] Clean up `.gitignore` and add database file wildcards**
- **Priority**: High (P1)
- **Description**: Remove rogue markdown block (` ``` `) in [.gitignore](file:///Users/jsoehner/dbsc-express-demo/.gitignore#L21). Add `database.db`, `*.db`, and audit folders (`piolium/`) to `.gitignore` to prevent accidental commit of local test databases or security artifacts.
- **Acceptance Criteria**: `git status` reports clean working directory with no untracked `.db` or audit output files.

### **[SEC-REQ-006] Align CORS Fallback with HTTPS Default**
- **Priority**: Medium (P2)
- **Description**: Update CORS fallback in [server.js](file:///Users/jsoehner/dbsc-express-demo/server.js#L32) from `http://localhost:3000` to `https://localhost:3000` to match the HTTPS listener configuration.
- **Acceptance Criteria**: Cross-origin requests over HTTPS from localhost succeed without CORS origin rejection when `BASE_URL` is omitted.

### **[SEC-REQ-007] Enforce SQLite Write-Ahead Logging (WAL)**
- **Priority**: Medium (P2)
- **Description**: Enable WAL mode (`db.pragma('journal_mode = WAL');`) and synchronous normal mode on SQLite database connection in [server.js](file:///Users/jsoehner/dbsc-express-demo/server.js#L50).
- **Acceptance Criteria**: Concurrent reads do not block auth writes, improving DoS resilience and database stability.

### **[SEC-REQ-008] Enforce Secure Cookie Flag Conditionally on HTTPS**
- **Priority**: Medium (P2)
- **Description**: Configure `cookie.secure` in Better Auth to be enabled whenever HTTPS is enabled (`process.env.NODE_ENV === "production" || !process.env.HTTP_ONLY`), ensuring cookies are never transmitted in cleartext.
- **Acceptance Criteria**: Session cookies bear the `Secure` flag on HTTPS connections.

### **[SEC-REQ-009] Decouple SSL Key Generation from Container Build**
- **Priority**: Low (P3) - Best Practice
- **Description**: In production deployments, mount SSL certificates via environment variables or secret volumes rather than baking self-signed certificates into the Docker image build.
- **Acceptance Criteria**: Container image contains no private key material; certificates are injected at runtime via `HTTPS_KEY_PATH` and `HTTPS_CERT_PATH`.

---

## 7. Actionable Remediation & Implementation Steps

1. **Fix `.gitignore` immediately** (addressing SEC-REQ-005):
   - Remove rogue line 21.
   - Ignore `*.db`, `*.db-journal`, `*.db-wal`, `piolium/`, and `.DS_Store`.
2. **Apply server hardening enhancements** (addressing SEC-REQ-006, SEC-REQ-007, SEC-REQ-008):
   - Set `db.pragma('journal_mode = WAL')`.
   - Harmonize default `BASE_URL` to `https://localhost:3000`.
   - Enforce cookie `secure: true` for HTTPS execution.
3. **Capture Knowledge**:
   - Run memory capture script `python3 ~/memory_system/capture_knowledge.py` to record this security governance review into local memory storage.
