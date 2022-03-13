#!/bin/sh
export NETWORK_NAME=mynetwork
export VOLUME_NAME=worldstate
export CONTAINER_NAME=app
export POSTGRES_HOST=db
export POSTGRES_USER=yourusername
export POSTGRES_PASSWORD=yourpassword
docker run --net $NETWORK_NAME --name $CONTAINER_NAME -p 5000:5000 -d \
    -v $(pwd)/server:/app -e POSTGRES_HOST -e POSTGRES_USER \
    -e POSTGRES_PASSWORD --restart unless-stopped \
    node:14 node /app/src/app.js
