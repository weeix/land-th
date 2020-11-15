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
  org,
  tambon,
} = sequelize.models;
org.hasMany(landtype);
landtype.belongsTo(org);
landtype.hasMany(land);
land.belongsTo(landtype);
changwat.hasMany(amphoe);
amphoe.belongsTo(changwat);
amphoe.hasMany(tambon);
tambon.belongsTo(amphoe);

module.exports = sequelize;