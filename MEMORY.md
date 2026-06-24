# Project Memory

## 📖 Project Context
This project is `dbsc-express-demo`, a Node.js Express application. It serves as a demonstration and includes automated workflows for building, testing, and security scanning.

## 🎯 Current Objectives
- [x] Integrate standard security scanning and dependency update workflows.
- [ ] Continue building out application features and maintaining security posture.

## 🧠 Key Decisions & Architecture
- **2026-06-24 - Workflow Migration**: Ported Java/Maven specific GitHub Actions workflows (`nightly-dependency-update.yml` and `security-scan.yml`) to Node.js equivalents.
- **Dependency Management**: Utilizing `npm update --save`, followed by `npm ci` and `npm test` for the nightly automated dependency update process.
- **Security Scanning Strategy**:
  - **Secrets**: Gitleaks
  - **SAST**: Semgrep (replaced SpotBugs which was Java-specific)
  - **SCA & Container**: Trivy (handles Node.js dependencies natively, replacing OWASP Dependency-Check)
- **Findings Aggregation**: Implemented a custom `.github/scripts/parse-findings.js` to aggregate JSON reports from Gitleaks, Semgrep, and Trivy into a unified Markdown table for GitHub Issues.

## 👤 User Preferences
- Follow established bash scripts (`build-docker.sh`, `run-docker.sh`) for environment setup and lifecycle management.
- Maintain generic and reusable GitHub Actions where possible.
- Keep `MEMORY.md` updated after significant architecture decisions and milestones to capture learnings.

## 📝 Unresolved Issues / Gotchas
- **SAST/SCA Tool Overlap**: When migrating from Java, we noticed that Trivy handles package manager scanning (like `npm`) natively, making a separate OWASP Dependency-Check redundant and significantly speeding up the scan process.
- **Semgrep Output**: To ensure Semgrep findings are properly reported in GitHub Issues, its JSON output (`semgrep-results.json`) must be explicitly parsed by our `parse-findings.js` script, which required custom logic compared to the previous Java SAST tools.
