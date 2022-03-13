#!/bin/sh
export NETWORK_NAME=mynetwork
export VOLUME_NAME=worldstate
export CONTAINER_NAME=listener
export RPC_URL=ws://158.108.30.232:8546
export POSTGRES_HOST=db
export POSTGRES_USER=yourusername
export POSTGRES_PASSWORD=yourpassword
docker run --net $NETWORK_NAME --name $CONTAINER_NAME -d \
    -v $(pwd)/server:/app -e RPC_URL -e POSTGRES_HOST -e POSTGRES_USER \
    -e POSTGRES_PASSWORD --restart unless-stopped \
    node:14 node /app/src/listener.js
