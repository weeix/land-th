const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('org', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    abbr: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });
}
