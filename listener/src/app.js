const fsPromises = require('fs').promises;
const Web3 = require('web3');
const sequelize = require('./sequelize');

const PROVIDER_URL = 'ws://blockchain:8545';
const RETRY_TIMEOUT = 10000;
const SYNC_LIMIT = 10000;
const CONTRACT_FILE_PATH = __dirname + '/contracts/LandTH.json';

/**
 * Connect to the database / sync database tables
 */
async function step0() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database.');
    await sequelize.sync();
    console.log('Synced database tables.');
    step1();
  } catch (error) {
    setTimeout(step0, RETRY_TIMEOUT);
    console.log(
      'Can not connect to the database. Retrying in ' + RETRY_TIMEOUT/1000 + 's'
    );
  }
}

/**
 * Load Web3 and get network ID
 */
async function step1() {
  try {
    const web3 = new Web3(PROVIDER_URL);
    const networkId = await web3.eth.net.getId();
    console.log('Connected to the blockchain.');
    step2(web3, networkId);
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
 * @param {number} networkId Network ID
 */
async function step2(web3, networkId) {
  let filehandle, contract;
  try {
    filehandle = await fsPromises.readFile(CONTRACT_FILE_PATH);
    contract = JSON.parse(filehandle);
  } catch (error) {
    console.error(error);
    process.exit();
  }
  const deployedNetwork = contract.networks[networkId];
  if (!deployedNetwork) {
    setTimeout(step2.bind(web3, networkId), RETRY_TIMEOUT);
    console.log(
      'Contract not deployed in this network. Retrying in ' + RETRY_TIMEOUT/1000 + 's'
    );
  } else {
    console.log('Contract loaded.');
    step3(web3, contract, deployedNetwork);
  }
}

/**
 * Create contract instace and start the listener
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

  // Sync old events

  let syncedBlock = await sequelize.models.event.max('block_number') || 0;
  let latestBlock = (await web3.eth.getBlock('latest')).number;

  while (syncedBlock < latestBlock) {
    let fromBlock = syncedBlock + 1;
    let toBlock = latestBlock;
    if (toBlock - fromBlock >= SYNC_LIMIT) {
      toBlock = fromBlock + SYNC_LIMIT - 1;
    }
  
    const events = await instance.getPastEvents('allEvents', { fromBlock: fromBlock, toBlock: toBlock });

    for (e of events) {
      handleEvent(e);
    }
    syncedBlock = toBlock;
    latestBlock = (await web3.eth.getBlock('latest')).number;

  }

  // Listen for new events

  instance.events.allEvents()
    .on("data", e => handleEvent(e))
    .on("error", e => console.log(e));

}

async function handleEvent(e) {

  // store events in database
  await sequelize.models.event.create({
    block_number: e.blockNumber,
    transaction_hash: e.transactionHash,
    name: e.event
  });

  // store data
  if (e.event === 'OrgCreated') {
    await sequelize.models.org.create({
      id: e.returnValues.id,
      name: e.returnValues.name,
      abbr: e.returnValues.abbr
    })
  } else if (e.event === 'LandTypeCreated') {
    await sequelize.models.landtype.create({
      id: e.returnValues.id,
      name: e.returnValues.name,
      description: e.returnValues.description,
      org_id: e.returnValues.orgId
    })
  } else if (e.event === 'LandCreated') {
    await sequelize.models.land.create({
      id: e.returnValues.id,
      landtype_id: e.returnValues.landTypeId,
      issue_date: e.returnValues.issueDate,
      geom: sequelize.fn('ST_GeomFromText', e.returnValues.geom, 4326)
    })
  }

  console.log(e.blockNumber + ' ' + e.transactionHash + ' ' + e.event);
}

step0();
