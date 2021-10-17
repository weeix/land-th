require('dotenv-flow').config({ debug: process.env.DEBUG });
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKeys = [ process.env.BLOCKCHAIN_SIGNER_PRIVKEY ];
let provider = new HDWalletProvider({
  privateKeys,
  providerOrUrl: 'http://' + process.env.BLOCKCHAIN_HOST + ':8545'
});
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      provider: provider,
      network_id: process.env.NETWORK_ID // Match any network id
    }
  }
};
