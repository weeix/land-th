const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('event', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    blockNumber: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    transactionHash: {
      allowNull: false,
      type: DataTypes.STRING
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    }
  },
  {
    underscored: true
  });
}
