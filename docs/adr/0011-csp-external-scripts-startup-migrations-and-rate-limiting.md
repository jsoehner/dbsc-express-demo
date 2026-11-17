# ADR 0011: Strict CSP External JS Modules, Startup DB Migrations, and DBSC Rate-Limit Hardening

* **Status:** Accepted
* **Deciders:** DBSC Express Demo Engineering & Security Team
* **Date:** 2026-11-17

---

## 1. Context & Problem Statement

During live container verification in Chrome, three operational issues were uncovered:
1. **Inline Scripts Blocked by Strict CSP**: `helmet()` enforces `Content-Security-Policy: script-src 'self'; script-src-attr 'none'`, blocking the inline `<script>` blocks in `public/index.html` and preventing button click handlers from attaching.
2. **Build-Time CLI Migration Drift (`SCHEMA_MISMATCH`)**: Upgrading `better-auth` to `1.7.25` caused the build-time `@better-auth/cli` command in `Dockerfile` to leave `./data/db.sqlite` without the required `user`, `session`, `account`, `verification`, `dbscSession`, and `dbscBoundKey` tables.
3. **Plain-Text Rate-Limit Collisions**: `authLimiter` (`max: 20` per 5 min) counted DBSC SDK/state/challenge/registration calls alongside login attempts and returned plain text (`"Too many requests..."`), causing `res.json()` in the browser client to fail.

---

## 2. Decision Outcome

1. **Externalize Client Scripts for Strict CSP**:
   - Move inline scripts out of `public/index.html` into same-origin modules [`public/js/fetch-interceptor.js`](../../public/js/fetch-interceptor.js) and [`public/js/app.js`](../../public/js/app.js), preserving `helmet()`'s strict `script-src 'self'` policy without `'unsafe-inline'`.
2. **Programmatic Startup Migrations**:
   - Execute `getMigrations(auth.options)` from `better-auth/db/migration` automatically on startup in [`server.js`](../../server.js) (and via `MIGRATION=1 node -e "import('./server.js')"` in [`Dockerfile`](../../Dockerfile)) so both build-time images and fresh runtime volumes always have a valid schema.
3. **JSON Rate-Limit Responses & Safe Client Parsing**:
   - Configure `express-rate-limit` in `server.js` to return structured JSON (`{ error: "..." }`) and tune `authLimiter` (`max: 100` / 5 min) and global `limiter` (`max: 300` / 15 min) for interactive DBSC protocol flows, while safely parsing non-JSON responses in `public/js/app.js`.

---

## 3. Consequences

### Positive
* Preserves strict `script-src 'self'` XSS protection without weakening CSP.
* Eliminates `SCHEMA_MISMATCH` errors across upgrades and fresh container volumes.
* Prevents plain-text rate-limit parsing failures in the browser UI.

### Negative / Trade-offs
* Requires keeping client JS in `public/js/` rather than inline in `public/index.html` (enforced by regression tests in `tests/server.test.js`).
