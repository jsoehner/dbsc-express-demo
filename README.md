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
