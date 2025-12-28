#!/bin/bash
set -e

IMAGE="ghcr.io/oktimi/tt:${VERSION:-latest}"

echo "Pulling $IMAGE..."
docker pull $IMAGE

echo "Restarting services..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

echo "Done!"
