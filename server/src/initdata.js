const fs = require('fs');
const parse = require('csv-parse');
const sequelizeFn = require('sequelize').fn;

const AMPHOE_FILE_PATH = __dirname + '/seeddata/amphoe.csv';
const CHANGWAT_FILE_PATH = __dirname + '/seeddata/changwat.csv';
const TAMBON_FILE_PATH = __dirname + '/seeddata/tambon.csv';

async function initData(sequelize) {

  const {
    amphoe,
    changwat,
    tambon
  } = sequelize.models;

  // turn off triggers (improve performance)
  await sequelize.query('SET session_replication_role = "replica";');

  // changwat
  const changwatCount = await changwat.count();
  if (changwatCount === 0) {
    try {
      await importFromCsv(CHANGWAT_FILE_PATH, changwat.create.bind(changwat));
      console.log('Imported ' + CHANGWAT_FILE_PATH);
    } catch (error) {
      console.error(error);
    }
  }

  // amphoe
  const amphoeCount = await amphoe.count();
  if (amphoeCount === 0) {
    try {
      await importFromCsv(AMPHOE_FILE_PATH, amphoe.create.bind(amphoe));
      console.log('Imported ' + AMPHOE_FILE_PATH);
    } catch (error) {
      console.error(error);
    }
  }

  // tambon
  const tambonCount = await tambon.count();
  if (tambonCount === 0) {
    try {
      await importFromCsv(TAMBON_FILE_PATH, tambon.create.bind(tambon));
      console.log('Imported ' + TAMBON_FILE_PATH);
    } catch (error) {
      console.error(error);
    }
  }
  
  // turn on triggers
  await sequelize.query('SET session_replication_role = "origin";');

  return;

}

function importFromCsv(filePath, create) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(filePath);
    const parser = parse({ columns: true });

    parser.on('readable', async function(){
      let record;
      while (record = parser.read()) {
        if ('geom' in record) {
          record.geom = sequelizeFn('ST_GeomFromEWKT', record.geom);
        }
        await create(record);
      }
    });

    parser.on('error', function(err){
      reject(err.message);
    });

    parser.on('end', function(){
      resolve();
    });

    input.pipe(parser);

  });
}

module.exports = { initData };
