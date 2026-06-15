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
