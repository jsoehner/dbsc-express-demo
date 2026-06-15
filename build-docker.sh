#!/bin/bash

# Default image name
IMAGE_NAME="dbsc-express-demo:local"

# Argument parsing
if [ "$1" == "--multi-arch" ]; then
    echo "🏗️  Building multi-architecture image (linux/amd64, linux/arm64)..."
    docker buildx build --platform linux/amd64,linux/arm64 -t $IMAGE_NAME .
else
    echo "🏗️  Building image for the local host architecture..."
    docker build -t $IMAGE_NAME .
fi

echo ""
echo "✅ Build complete!"
echo "To run the container locally, you can use:"
echo "docker run --rm -it -p 3000:3000 -v \"\$(pwd)/certs/server.key:/app/server.key\" -v \"\$(pwd)/certs/server.cert:/app/server.cert\" $IMAGE_NAME"
