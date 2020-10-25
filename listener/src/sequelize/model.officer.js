const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('officer', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    cid: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });
}
