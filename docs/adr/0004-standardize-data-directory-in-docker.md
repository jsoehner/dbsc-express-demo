# ADR 0004: Standardize Data Directory within Application Workdir in Docker

## Status
Accepted

## Date
2026-09-15

## Context
The Docker build was failing with a `not found` error during the `COPY` step because the database was being created in a root-level directory (`/data`) while the build process was looking for it within the application workdir (`/app/data`). This mismatch caused the cache key calculation to fail.

## Decision
Standardize all data persistence paths to be relative to the application's working directory (`/app`). 

Changes include:
- Changing `mkdir` commands to create `data` inside `/app`.
- Updating `DATABASE_URL` to `./data/db.sqlite`.
- Updating `COPY` commands to reference `/app/data/db.sqlite` consistently.

## Consequences
- **Positive**: Resolves the Docker build failure and follows standard Docker best practices for application structure.
- **Negative**: None.
