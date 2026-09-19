# ADR 0001: Security Baseline & Governance

## Status
Accepted

## Date
2024-05-22

## Context
The project is a SQL query builder implementation using Kysely and Zod. To ensure production readiness, we need to establish a security governance framework that includes threat modeling, automated scanning, and documented security decisions.

## Decision
We will adopt a "Security by Design" approach involving:
1. **Automated SAST/Secret Scanning**: Integration of Semgrep and Gitleaks in GitHub Actions.
2. **Dependency Management**: Using Dependabot with a 7-day security cooldown.
3. **ADR-based Governance**: All significant security decisions (crypto, auth, risk) must be documented as Security ADRs.
4. **Pre-commit Hooks**: Local enforcement of secret scanning and ADR checks.

## Threat Context (STRIDE)
- **Tampering**: SQL injection is mitigated by Kysely's use of parameterized queries.
- **Information Disclosure**: Error messages must be sanitized to prevent schema leakage.
- **Denial of Service**: Implementation of query execution timeouts.

## Residual Risk
- **Risk**: Human error in configuring database permissions.
- **Mitigation**: Mandatory use of least-privilege DB users and regular security audits.

## Compliance Traceability
- **OWASP Top 10**: Addresses A03:2021-Injection.
- **SOC2**: Addresses Logical Access and System Operations.

## Consequences
- **Positive**: Automated detection of vulnerabilities, clear audit trail of security decisions, and reduced risk of SQL injection.
- **Negative**: Slight increase in CI/CD build time and overhead for documenting every security decision.
