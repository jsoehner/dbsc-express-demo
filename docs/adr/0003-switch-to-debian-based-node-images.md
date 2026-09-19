# ADR 0003: Switch to Debian-based Node.js images in Docker

## Status
Accepted

## Date
2026-09-14

## Context
The project was experiencing build failures in the GitHub Actions workflow during the `npm ci` step in the Docker build process. The error was caused by incompatibility between the `node:26-alpine` image (which uses `musl`) and the native compilation requirements of the `better-sqlite3` library.

## Decision
Switch the Dockerfile base images from Alpine-based to Debian-based:
- Use `node:26` for the builder stage.
- Use `node:26-slim` for the runner stage.

This ensures a consistent environment for building native modules while maintaining a relatively small footprint for the production image.

## Consequences
- **Positive**: Resolves the build failure in the CI/CD pipeline and ensures consistent behavior between local development and production.
- **Negative**: The final image size will be slightly larger than the Alpine-based version, but it remains optimized using the `slim` variant.
