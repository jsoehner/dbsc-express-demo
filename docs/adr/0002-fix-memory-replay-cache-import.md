# ADR 0002: Fix ReferenceError for MemoryReplayCache in server.js

## Status
Accepted

## Date
2026-09-14

## Context
During the Docker build process, the GitHub Actions workflow failed because the `better-auth` migration step tried to execute `server.js`. `server.js` contained a reference to `MemoryReplayCache` which was not imported, leading to a `ReferenceError`.

## Decision
Add the explicit import for `MemoryReplayCache` from the `dbsc-toolkit` library in `server.js`.

## Consequences
- **Positive**: Fixes the CI/CD pipeline, allowing Docker images to be built and published successfully.
- **Negative**: None.
