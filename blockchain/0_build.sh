#!/bin/sh
# export ACCOUNT_PASSWORD=myPassword
# export KEEP_PASSWORD=true
# export PRIVATE_KEY=0a2b01db6ec8d98a542a114bec15e0bf916a6b3250fc77084118de7577697b5a
docker build -t weeix/ethereum-client-go:latest \
    --build-arg ACCOUNT_PASSWORD \
    --build-arg KEEP_PASSWORD \
    --build-arg PRIVATE_KEY .
