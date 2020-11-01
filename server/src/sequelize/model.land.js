const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('land', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    landtype_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    issue_date: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    geom: {
      allowNull: false,
      type: DataTypes.GEOMETRY('MULTIPOLYGON', 4326)
    },
    update_comment: {
      allowNull: true,
      type: DataTypes.STRING
    }
  });
}