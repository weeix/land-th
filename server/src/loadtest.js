const fs = require('fs');
const fsPromises = require('fs').promises;
const parse = require('csv-parse');
const Web3 = require('web3');

const PROVIDER_URL = 'ws://localhost:8545';
const RETRY_TIMEOUT = 10000;
const CONTRACT_FILE_PATH = __dirname + '/contracts/LandTH.json';
const PSEUDO_DATA_FILE_PATH = __dirname + '/seeddata/pseudodata.csv';

/**
 * Load Web3 and get network ID
 */
async function step1() {
  try {
    const web3 = new Web3(PROVIDER_URL);
    await web3.eth.net.getId();
    console.log('Connected to the blockchain.');
    step2(web3);
  } catch (error) {
    if (error.code === 1006) {
      setTimeout(step1, RETRY_TIMEOUT);
      console.log(
        'Can not connect to the blockchain. Retrying in ' + RETRY_TIMEOUT/1000 + 's'
      );
    } else {
      console.error(error);
      process.exit();
    }
  }
}

/**
 * Load contract ABI and get deployed network
 * @param {Web3} web3 Web3 instance
 */
async function step2(web3) {
  let filehandle, contract;
  try {
    filehandle = await fsPromises.readFile(CONTRACT_FILE_PATH);
    contract = JSON.parse(filehandle);
  } catch (error) {
    if (error.errno === -2) {
      setTimeout(step2.bind(null, web3), RETRY_TIMEOUT);
      console.log(
        CONTRACT_FILE_PATH + ' not found. Retrying in ' + RETRY_TIMEOUT/1000 + 's'
      );
      return;
    } else {
      console.error(error);
      process.exit();
    }
  }
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = contract.networks[networkId];
  if (!deployedNetwork) {
    setTimeout(step2.bind(null, web3), RETRY_TIMEOUT);
    console.log(
      'Network ' + networkId + ' not found. Retrying in ' + RETRY_TIMEOUT/1000 + 's'
    );
  } else {
    console.log(CONTRACT_FILE_PATH + ' loaded.');
    step3(web3, contract, deployedNetwork);
  }
}

/**
 * Create contract instace and start load testing
 * @param {Web3} web3 Web3 instance
 * @param {*} contract contract json file
 * @param {*} deployedNetwork Deployed network
 */
async function step3(web3, contract, deployedNetwork) {

  // Create contract instance
  const instance = new web3.eth.Contract(
    contract.abi,
    deployedNetwork && deployedNetwork.address,
  );

  // Get account list
  const accounts = await web3.eth.getAccounts();

  importFromCsv(PSEUDO_DATA_FILE_PATH, accounts[0], instance);

}

async function importFromCsv(filePath, account, instance) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(filePath);
    const parser = parse({ columns: true });

    console.log('Start: ' + (Date.now() / 1000 | 0));

    parser.on('readable', async function(){
      let record;
      let i = 0;
      while (record = parser.read()) {
        // Send transaction
        const result = await instance.methods.addLand(
          record.landTypeId,
          record.issueDate,
          record.geom
        ).send({ from: account, gas: '5000000' });

        // console.log(result.blockNumber + ' ' + result.transactionHash);

        if (i > 1000) {
          console.log('End: ' + (Date.now() / 1000 | 0));
          process.exit();
        }
        i++;
      }
    });

    parser.on('error', function(err){
      reject(err.message);
    });

    parser.on('end', function(){
      console.log('End: ' + (Date.now() / 1000 | 0));
      resolve();
    });

    input.pipe(parser);

  });
}

step1();
