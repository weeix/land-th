const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.POSTGRES_USER,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: 'db',
    dialect: 'postgres'
  }
);

const modelDefiners = [
  require('./model.org'),
  require('./model.officer'),
  require('./model.landtype'),
  require('./model.land'),
  require('./model.event')
];

// define all models according to their files
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// add associations
const {
  land,
  landtype,
  org
} = sequelize.models;
org.hasMany(landtype);
landtype.belongsTo(org);
landtype.hasMany(land);
land.belongsTo(landtype);

module.exports = sequelize;