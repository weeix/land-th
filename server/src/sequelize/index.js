const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_USER,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: 'db',
    dialect: 'postgres',
    logging: false
  }
);

const modelDefiners = [
  require('./model.amphoe'),
  require('./model.changwat'),
  require('./model.event'),
  require('./model.land'),
  require('./model.landtype'),
  require('./model.landuse'),
  require('./model.landusetype'),
  require('./model.officer'),
  require('./model.org'),
  require('./model.tambon')
];

// define all models according to their files
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// add associations
const {
  amphoe,
  changwat,
  land,
  landtype,
  landuse,
  landusetype,
  org,
  tambon,
} = sequelize.models;
org.hasMany(landtype);
org.hasMany(landusetype);
landtype.belongsTo(org);
landtype.hasMany(land);
land.belongsTo(landtype);
land.hasMany(landuse);
changwat.hasMany(amphoe);
amphoe.belongsTo(changwat);
amphoe.hasMany(tambon);
tambon.belongsTo(amphoe);
tambon.hasMany(land);
land.belongsTo(tambon);
landusetype.belongsTo(org);
landusetype.hasMany(landuse);
landuse.belongsTo(landusetype);
landuse.belongsTo(land);

module.exports = sequelize;