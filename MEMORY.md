# Project Memory

## 📖 Project Context
This project is `dbsc-express-demo`, a Node.js Express application. It serves as a demonstration and includes automated workflows for building, testing, and security scanning.

## 🎯 Current Objectives
- [x] Integrate standard security scanning and dependency update workflows.
- [ ] Continue building out application features and maintaining security posture.

## 🧠 Key Decisions & Architecture
- **2026-06-24 - Workflow Migration**: Ported Java/Maven specific GitHub Actions workflows (`nightly-dependency-update.yml` and `security-scan.yml`) to Node.js equivalents.
- **2026-06-29 - TPM & Binding Tier Indicators**: Added dashboard indicators (TPM / Secure Enclave capability check via WebAuthn API, and DBSC binding tier vs fallback session indicator) to improve visual observability of the cryptographic session state.
- **2026-09-12 - Automated Dependency Workflow Resolution**: Fixed automated PR creation in `nightly-dependency-update.yml` and pinned GitHub Actions to Node 24 compatible SHAs.
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
- **GitHub Actions Logical Operators Evaluated as Booleans**: In GitHub Actions expressions `${{ a || b }}`, `||` evaluates to boolean `true`/`false` rather than the operand value. Writing `token: ${{ env.PR_TOKEN || github.token }}` passes the string `"true"` to git/actions, causing HTTP 401 and fatal git auth exit code 128. Fallbacks must be resolved in shell steps or verified explicitly.
- **Pull Request Self-Review Requests**: GitHub API rejects `POST /pulls/{pull_number}/requested_reviewers` with `422 Review cannot be requested from pull request author` when the requester/reviewer is identical to the PR author. In automated PR workflows, assignees should be used instead of reviewers for self-assigned PRs.
