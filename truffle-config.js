require('dotenv-flow').config({ debug: process.env.DEBUG });
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: process.env.BLOCKCHAIN_HOST,
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
