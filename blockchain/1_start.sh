#!/bin/sh
# export NETWORK_ID=5777
# export NETWORK_ADDRESS=158.108.30.231
# export NETWORK_RESTRICT=158.108.30.0/24
# export BOOTSTRAP_NODE_RECORD=enr:-KO4QD9ws9ybiZyxlHacZTcl9rjq0-xOtNs9N2njXr51S939YUionusFa7-eGct66rM44s-MXb3Ls6sk6kzd_tXLSrWGAXz6nBT6g2V0aMfGhOT0fyGAgmlkgnY0gmlwhJ5sHuaJc2VjcDI1NmsxoQMHu4AxV1tpFvCsX-RKWIB8eH0KUpGw13x3k5y9KPdU0YRzbmFwwIN0Y3CCdl-DdWRwgnZf
# export BLOCKCHAIN_SIGNER_ACCOUNT=41078D02A9619352c4e9B8412d653B2089dC708a
if [ $1 = "boot" ]
then
    echo "Starting bootstrap node"
    docker run -p 30303:30303 --name geth -d --restart unless-stopped \
        weeix/ethereum-client-go:latest \
        --networkid=${NETWORK_ID} \
        --nat=extip:${NETWORK_ADDRESS} \
        --netrestrict=${NETWORK_RESTRICT}
elif [ $1 = "signer" ]
then
    echo "Starting signer node"
    docker run -p 30303:30303 --name geth -d --restart unless-stopped \
        weeix/ethereum-client-go:latest \
        --networkid=${NETWORK_ID} \
        --nat=extip:${NETWORK_ADDRESS} \
        --bootnodes=${BOOTSTRAP_NODE_RECORD} \
        --mine \
        --unlock=${BLOCKCHAIN_SIGNER_ACCOUNT} \
        --password=/root/.ethereum/geth/password \
        --netrestrict=${NETWORK_RESTRICT}
elif [ $1 = "rpc" ]
then
    echo "Starting rpc node"
    docker run -p 8545:8545 -p 8546:8546 -p 30303:30303 --name geth -d --restart unless-stopped \
        weeix/ethereum-client-go:latest \
        --networkid=${NETWORK_ID} \
        --nat=extip:${NETWORK_ADDRESS} \
        --bootnodes=${BOOTSTRAP_NODE_RECORD} \
        --http \
        --http.addr=0.0.0.0 \
        --ws \
        --ws.addr=0.0.0.0 \
        --allow-insecure-unlock \
        --netrestrict=${NETWORK_RESTRICT}
else
    echo "Unknown role: $1"
fi