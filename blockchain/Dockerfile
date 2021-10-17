FROM ethereum/client-go:latest

ARG ACCOUNT_PASSWORD
ARG PRIVATE_KEY
ARG KEEP_PASSWORD

COPY genesis.json /tmp

RUN geth init /tmp/genesis.json \
    && rm -f ~/.ethereum/geth/nodekey \
    && echo ${ACCOUNT_PASSWORD} > /tmp/password \
    && if [ -z ${PRIVATE_KEY} ]; \
    then geth account new --password /tmp/password; \
    else echo ${PRIVATE_KEY} > /tmp/privkey \
    && geth account import --password /tmp/password /tmp/privkey \
    && rm -f /tmp/privkey; \
    fi \
    && if [ ${KEEP_PASSWORD} = "true" ]; \
    then mv /tmp/password /root/.ethereum/geth/password \
    && chmod 600 /root/.ethereum/geth/password; \
    else rm -f /tmp/password; \
    fi

ENTRYPOINT ["geth"]