# Security Audit Report

## 1. Executive Summary
A comprehensive security audit of the `dbsc-express-demo` repository was conducted following DevSecOps and AppSec best practices. The application is a Node.js/Express service integrating Better Auth with device-bound session credentials (DBSC) and SQLite. Several vulnerabilities have been resolved, and further hardening measures are recommended.

## 2. Completed Remediation Activities
During the initial assessment, the following security improvements were proactively implemented:
- **Dependency Vulnerabilities:** Addressed an `npm audit` finding in `qs` which posed a DoS and array-limit bypass risk (CVE mitigation).
- **Hardcoded Secrets:** Removed a hardcoded, tracked private key (`certs/server.key`) and added `.gitignore` rules to prevent tracking local PKI infrastructure.
- **Workflow Security (Supply Chain):** Pinned GitHub Action dependencies (`actions/checkout`, `actions/github-script`) to explicit SHAs to mitigate mutable tag injection attacks.
- **HTTP Security Headers:** Implemented `helmet` to provide robust HTTP response headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options).
- **Rate Limiting & DoS Protection:** Integrated `express-rate-limit` (100 requests / 15 min per IP) and enforced a 10kb JSON body parsing limit (`express.json({ limit: '10kb' })`).
- **CORS Configuration:** Applied explicit CORS origins rather than defaulting to open origins.

## 3. Architecture & Code Review Findings

### 3.1 Docker & Container Security (DevSecOps)
- **Current State:** The Dockerfile employs multi-stage builds, successfully drops privileges to the `node` user, and avoids running the application as root.
- **Finding (Low): Reproducible Builds:** The builder stage uses `npm install` instead of `npm ci`. `npm ci` should be used in automated/CI environments to guarantee deterministic dependency resolution based on `package-lock.json`.
- **Finding (Low): Process Signal Handling:** The `CMD ["npm", "start"]` instruction executes via NPM, which does not forward OS signals (e.g., SIGTERM) gracefully to the underlying Node process, impacting graceful shutdown in Kubernetes/Docker environments.
  - **Recommendation:** Change to `CMD ["node", "server.js"]`.

### 3.2 Application Security & Piolium Scanner Output
- **Path Traversal / File Access:** The `piolium` scanner flagged multiple instances of `fs.readFileSync` (e.g., `server.js:79`). These are used exclusively during initialization for SSL certificates (`process.env.HTTPS_KEY_PATH`). Since these paths are controlled by environment variables deployed by trusted orchestrators, the risk of external path traversal is accepted.
- **Hidden Control Channel:** Piolium flagged Better Auth middleware logic. This is an expected pattern for authentication middleware acting on session data and does not represent an exposed vulnerability.

### 3.3 Database & State Management
- **SQLite Configuration:** The database uses `better-sqlite3`. Ensure that if deployed to a container orchestrator (like Kubernetes), `db.sqlite` is mounted on a persistent volume, or risk losing session states on container restart.
- **Injection:** Better Auth uses parameterized queries under the hood (via its adapter patterns), effectively mitigating SQL Injection for the current scope.

## 4. Compliance & Next Steps
- **Continuous Monitoring:** The implemented GitHub Actions (`security-scan.yml`) provide continuous SAST (Semgrep), Secret Scanning (Gitleaks), and SCA/Container scanning (Trivy).
- **Production SSL:** The local `openssl` generation is sufficient for local demo purposes. Ensure production deployments terminate SSL at an Application Load Balancer, Ingress Controller, or reverse proxy using legitimately signed certificates (e.g., Let's Encrypt).
