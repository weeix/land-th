#!/bin/sh
docker exec -it geth sh -c "geth attach ~/.ethereum/geth.ipc --exec admin.peers"
