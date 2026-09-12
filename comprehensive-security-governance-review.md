# Comprehensive Security Governance Review
**Project:** `dbsc-express-demo`
**Date:** 2026-09-11

## 1. Threat Modeling (STRIDE Analysis)
A high-level threat model of the Node.js/Express + SQLite + Better Auth architecture:

| Threat Category | Potential Attack Vectors | Current Controls | Residual Risk & Action Items |
|-----------------|--------------------------|------------------|------------------------------|
| **S**poofing | Cookie theft, session hijacking, credential stuffing | `better-auth` secure cookies; DBSC (Device-Bound Session Credentials) | **Low**: Ensure DBSC verification strictly blocks unbound sessions on sensitive endpoints. |
| **T**ampering | MITM attacks, modifying SQLite data | HTTPS enforcement, container `node` user isolation | **Low**: Ensure database volumes restrict host-level access in production orchestrators. |
| **R**epudiation | User denying malicious actions (e.g., unauthorized access) | None (default logging) | **Medium**: Need structured audit logging for authentication and state changes. |
| **I**nformation Disclosure | Stack trace leakage, hardcoded secrets, unprotected endpoints | `helmet` headers, ignored `certs/` directory, CORS limits | **Low**: Enforce `NODE_ENV=production` to suppress Express framework stack traces. |
| **D**enial of Service | Brute force logins, large payload exhaustion | `express-rate-limit` (100/15min), 10kb JSON limit | **Low**: Consider specific rate limits on `/api/auth` (e.g., 5 requests/minute for logins). |
| **E**levation of Privilege | Exploiting vulnerabilities to gain host or admin access | Non-root `node` Docker user, no admin roles defined yet | **Low**: Regularly patch dependencies (e.g., `npm ci`, Trivy scanning). |

## 2. Compliance Posture
Given the usage of `better-auth`, the SQLite database collects PII (Personally Identifiable Information) including `name`, `email`, `ipAddress`, and `userAgent`.

- **GDPR / CCPA Readiness:**
  - **Data Minimization:** Are `ipAddress` and `userAgent` strictly necessary? If used for security (fraud detection), it is a legitimate interest but must be disclosed in the privacy policy.
  - **Right to Erasure:** The application currently lacks a documented automated flow for users to delete their accounts and associated session data.
  - **Cookie Consent:** Secure sessions are essential (exempt from GDPR cookie banners), but if analytics are added later, consent mechanisms will be required.

## 3. Security Requirement Extraction
Based on the Threat Model and Compliance posture, the following actionable requirements must be added to the product backlog:

- **[SEC-REQ-001] Audit Logging:** Implement a structured logger (e.g., `pino` or `winston`) to record authentication events (success, failure, logout) with timestamps and pseudo-anonymized user IDs.
- **[SEC-REQ-002] Granular Rate Limiting:** Introduce an aggressive rate limiter specifically for `/api/auth/*` routes to prevent credential stuffing.
- **[SEC-REQ-003] Error Handling:** Create a global error-handling middleware that intercepts errors and returns generic JSON messages in production, preventing stack trace leaks.
- **[SEC-REQ-004] Data Retention Policy:** Implement a background cron job (or rely on Better Auth hooks) to purge expired sessions from the `db.sqlite` database to comply with data minimization principles.

## 4. Next Steps
1. Create tickets for **SEC-REQ-001** through **SEC-REQ-004**.
2. Update the system's privacy policy to reflect the collection of IP addresses and user agents.
