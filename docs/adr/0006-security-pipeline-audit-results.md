# ADR 0006: Security Pipeline Audit Results

## Status
Accepted

## Date
2026-09-19

## Context
A full security pipeline was executed on the `dbsc-express-demo` project to evaluate its defense-in-depth posture. The pipeline included Threat Modeling (STRIDE), Requirement Extraction, Mitigation Mapping, SAST/Dependency Scanning, Hardening, and Compliance Verification.

## Decision
The project was audited and found to be in a high-security posture, with a few actionable supply-chain improvements. Key findings include:
- **Threats Addressed**: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.
- **Vulnerabilities**: 0 CVEs detected in core dependencies. However, 7 findings were identified regarding mutable tags in GitHub Actions workflows.
- **Controls**: DBSC (Device Bound Session Credentials) provides hardware-backed session binding. TLS and Helmet are used for transport and header security. Rate limiting is enforced globally and on auth endpoints.
- **Compliance**: The project meets basic data retention and session security requirements (GDPR/SOC2 alignment).

## Consequences
- **Positive**: Validated the security of the DBSC implementation and identified critical supply-chain hardening steps.
- **Negative**: Identified need to pin all GitHub Actions to specific commit SHAs to prevent potential supply-chain attacks.

## Audit Summary Table
| Tool | File | Severity | Description |
|------|------|----------|-------------|
| Semgrep | `.github\workflows\docker-publish.yml:51` | WARNING | GitHub Actions step uses a mutable tag or branch reference. |
| Semgrep | `.github\workflows\docker-publish.yml:59` | WARNING | GitHub Actions step uses a mutable tag or branch reference. |
| Semgrep | `.github\workflows\security-governance.yml:28` | WARNING | GitHub Actions step uses a mutable tag or branch reference. |
| Semgrep | `.github\workflows\security-governance.yml:48` | WARNING | GitHub Actions step uses a mutable tag or branch reference. |
| Semgrep | `.github\workflows\security-governance.yml:74` | WARNING | GitHub Actions step uses a mutable tag or branch reference. |
| Semgrep | `.github\workflows/security-governance.yml:101` | WARNING | GitHub Actions step uses a mutable tag or branch reference. |
| Semgrep | `.github\workflows/security-governance.yml:106` | WARNING | GitHub Actions step uses a mutable tag or branch reference. |
