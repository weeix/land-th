#!/bin/sh
export NETWORK_NAME=mynetwork
export VOLUME_NAME=worldstate
docker network create $NETWORK_NAME
docker volume create $VOLUME_NAME
