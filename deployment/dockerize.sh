#!/bin/bash

docker build . -f deployment/Dockerfile  --target movies     --tag mattes3/ddd-video-club-movies:latest
docker build . -f deployment/Dockerfile  --target rental     --tag mattes3/ddd-video-club-rental:latest
docker build . -f deployment/Dockerfile  --target pricing    --tag mattes3/ddd-video-club-pricing:latest
docker build . -f deployment/Dockerfile  --target accounting --tag mattes3/ddd-video-club-accounting:latest
docker build . -f deployment/Dockerfile  --target frontend   --tag mattes3/ddd-video-club-frontend:latest
