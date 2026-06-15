#!/bin/bash

# Configuration
GITHUB_USER="jsoehner"
DOCKER_USER=${DOCKER_USER:-"jsoehner"}
REPO_NAME="dbsc-express-demo"

# Image URLs
GHCR_IMAGE="ghcr.io/$GITHUB_USER/$REPO_NAME:latest"
DOCKERHUB_IMAGE="docker.io/$DOCKER_USER/$REPO_NAME:latest"

# Argument parsing
if [ "$1" == "ghcr" ]; then
    TARGET_IMAGE=$GHCR_IMAGE
elif [ "$1" == "dockerhub" ] || [ "$1" == "docker.io" ]; then
    TARGET_IMAGE=$DOCKERHUB_IMAGE
else
    echo "Usage: ./run-docker.sh [ghcr | dockerhub]"
    echo ""
    echo "  ghcr      - Pulls and runs from GitHub Container Registry ($GHCR_IMAGE)"
    echo "  dockerhub - Pulls and runs from Docker Hub ($DOCKERHUB_IMAGE)"
    echo ""
    echo "Note: To use a different Docker Hub username, set the DOCKER_USER env var."
    echo "Example: DOCKER_USER=myusername ./run-docker.sh dockerhub"
    exit 1
fi

# Check if certs directory exists
if [ ! -d "certs" ]; then
    echo "🔐 Generating localhost certificates in 'certs' directory..."
    mkdir certs
    openssl req -nodes -new -x509 -keyout certs/server.key -out certs/server.cert -days 365 -subj "/CN=localhost"
fi

echo "🚀 Pulling latest image from $TARGET_IMAGE..."
docker pull $TARGET_IMAGE

echo ""
echo "🔒 Starting DBSC Demo Container..."
echo "Access the app at: https://localhost:3000"
echo "Press Ctrl+C to stop the container."
echo "--------------------------------------------------------"

# Run the container
# --rm: Automatically remove the container when it exits
# -it: Interactive terminal
# -p: Map port 3000
# -v: Map certs directly to the files expected by the app
docker run -v "$(pwd)/certs/server.key:/app/server.key" -v "$(pwd)/certs/server.cert:/app/server.cert" -p 3000:3000 --rm -it $TARGET_IMAGE
