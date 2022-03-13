#!/bin/sh
export NETWORK_NAME=mynetwork
export VOLUME_NAME=worldstate
export CONTAINER_NAME=db
export POSTGRES_USER=yourusername
export POSTGRES_PASSWORD=yourpassword
docker run -p 5432:5432 --net $NETWORK_NAME --name $CONTAINER_NAME -d --restart unless-stopped \
    -v ${VOLUME_NAME}:/var/lib/postgresql/data -e POSTGRES_USER \
    -e POSTGRES_PASSWORD postgis/postgis:latest
