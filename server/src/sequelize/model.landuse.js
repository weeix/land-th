const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('landuse', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    landusetypeId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    landId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    issueDate: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    expireDate: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    updateComment: {
      allowNull: true,
      type: DataTypes.STRING
    }
  },
  {
    underscored: true
  });
}
