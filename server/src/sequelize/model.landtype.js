const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('landtype', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    orgId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  },
  {
    underscored: true
  });
}
