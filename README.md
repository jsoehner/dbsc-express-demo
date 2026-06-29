# DBSC Express Demo

This is a demonstration of Device Bound Session Credentials (DBSC) with Express.js running in Docker.

## Local Development with Docker

To improve the developer experience and make it easy to test changes locally, we support building and running the Docker container natively.

### Building the Image

You can build the Docker image for your local host architecture by running:

```bash
npm run docker:build
# or directly:
./build-docker.sh
```

**Note on Multi-Architecture Builds:** 
If you need to verify that the container supports both Mac (`linux/arm64`) and x64 (`linux/amd64`) platforms, you can run a multi-architecture build using Docker Buildx:
```bash
./build-docker.sh --multi-arch
```

### Running the Container

Once built, you can run the container locally:

```bash
npm run docker:run
```

This will run the container and automatically mount the necessary local TLS certificates generated in the `certs/` directory, mapping the container to `https://localhost:3000`.

## Lessons Learned

During development and UI iteration, several important lessons were learned:

1. **Database Migrations in Docker**: Better Auth's SQLite integration requires database migrations to run inside the same environment where the server runs. Updating `package.json` to execute `npx --yes @better-auth/cli migrate -y --config server.js` before starting the server ensures tables like `user` are created dynamically in the container on boot.
2. **Mounting Static Assets**: To avoid rebuilding the Docker container during frontend UI development, it's crucial to mount the `public/` directory via a Docker volume (`-v "$(pwd)/public:/app/public"`).
3. **Intercepting SDK Network Requests**: The DBSC client SDK automatically captures a reference to the native `window.fetch`. To successfully intercept and log these cryptographic protocol requests for the UI animation, the custom `fetch` override must be defined in the `<head>` of the HTML *before* the SDK script is loaded.
4. **CSS Animation Timings with Fast Localhosts**: When animating visual packets to represent network requests, extremely fast responses on `localhost` can cause CSS animations to jitter or instantly reverse before reaching their destination. Awaiting a minimum forward-animation duration alongside the network `fetch` Promise guarantees the packet reaches the "server" node visually.
5. **DBSC Phase vs Tier Checks**: When handling DBSC status, the `phase` property (e.g., `native-dbsc`) indicates the *browser's capability*, but the server may ultimately reject the TPM attestation and fallback to a Web Crypto polyfill. To accurately display the active session's security level in the UI, always use the `tier` property (e.g., `outcome.tier === 'bound'` vs `'dbsc'`) as the source of truth rather than checking the `phase`.
6. **Debugging Native DBSC Support**: Native DBSC requires specific Chromium versions (e.g., 146+) and often requires explicitly enabling `chrome://flags/#enable-bound-session-credentials`. If native registration is unavailable or fails, the `dbsc-toolkit` provides a `skipReason` in the outcome object (e.g. `quota_exceeded`, `user_declined`). Surfacing this reason in the UI is highly recommended as it helps users quickly diagnose why their browser fell back to the Web Crypto polyfill.
7. **Docker Layer Size Explosions**: Docker uses a Copy-on-Write (CoW) filesystem. Running commands like `RUN chown -R node:node /app` after `node_modules` is already populated forces Docker to duplicate every single file into a new image layer, drastically inflating the image size. Always apply ownership at the time of copying by using the `COPY --chown=node:node` flag.
8. **Multi-Stage Node Builds**: Moving to a multi-stage Docker build is a great way to discard the bulky dependencies (like OS packages such as `openssl` or cached `npm` modules) needed to build certificates or generate SQLite migration files, yielding a significantly smaller, hardened production container.
9. **State Preservation in DBSC UIs**: When interacting with APIs that only return the session's current active `tier` (e.g., fetching a protected `/me` route), be careful not to accidentally overwrite the browser's hardware capability `phase` state in your UI. A session's tier may be `bound` (Web Crypto) even if the hardware phase is `native-dbsc` (due to server fallbacks). Always preserve the initial hardware capability phase globally to prevent UI components from spontaneously downgrading when receiving partial state updates.
10. **Native DBSC vs polyfill `boundFetch`**: The `dbsc-toolkit` provides a `window.boundFetch` polyfill wrapper AND monkey-patches `window.fetch` to fallback automatically in some cases. If the browser successfully negotiated Native DBSC (which runs at the OS/browser network stack level), you should **not** use the polyfill. Using it while native DBSC is active will accidentally intercept the request and perform a Web Crypto signature, overwriting the session's native registration on the server and downgrading the tier from `dbsc` to `bound`. Always capture an un-patched reference to `window.fetch` before the toolkit loads, and use a check (e.g., `isNative ? unpatchedFetch : window.boundFetch`) before dispatching requests.

## Frequently Asked Questions (FAQ)

### Q: Why does my session start as `tier=dbsc` but immediately downgrade to `tier=bound` when I make an API request?
**A:** This is the expected fallback behavior when Native DBSC network interception is disabled or failing (commonly due to `localhost`, missing HTTPS, or Chromium flag configurations). 

Here is what happens under the hood:
1. **Registration**: When you first initialize DBSC, the polyfill successfully uses WebAuthn (Passkeys/TPM) to prove hardware possession to the server, achieving `tier=dbsc`.
2. **The Challenge**: When you make an API request (e.g. `fetch('/me')`), the server responds with a `403 Forbidden` and a DBSC challenge.
3. **The Fallback**: If the browser's native network stack is functioning properly, it intercepts the 403 invisibly, signs the challenge, and retries. Because you are likely on `localhost`, the native stack ignores it. The `dbsc-toolkit`'s `boundFetch` wrapper catches the 403 instead.
4. **The Downgrade**: Because WebAuthn strictly requires a user interaction prompt (like a fingerprint scan) for every signature, the polyfill *cannot* use it transparently for background API requests. Instead, it generates a software Web Crypto key, registers it on the fly, and uses it to sign the request. The server accepts this new software key and updates your active session to `tier=bound`.

### Q: Can I just bypass the polyfill and use the native `fetch` API?
**A:** If you are developing locally on `localhost` or without fully trusted TLS certificates, **no**. Bypassing `boundFetch` means the `403 Forbidden` challenges will bubble directly up to your application, breaking your API requests. The polyfill is required to intercept and handle these challenges gracefully until your application is deployed to a production environment where Native DBSC network interception is supported.

### Q: How should I represent this state in the UI?
**A:** Your UI should track both the **hardware capability** (`phase`) discovered during registration, and the **active session security** (`tier`). If the session downgrades to `tier=bound` during a fetch, you should reflect that the *active requests* are software-bound, but you should **not** uncheck your "TPM / Secure Enclave Available" indicators, as the underlying hardware capability is still intact!
