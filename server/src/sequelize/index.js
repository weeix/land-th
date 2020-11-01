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

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

module.exports = sequelize;