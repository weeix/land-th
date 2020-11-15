const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('land', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    landtypeId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    tambonId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      comment: 'รหัสตำบล ตามรหัสมาตรฐานเขตการปกครองของไทย'
    },
    issueDate: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    geom: {
      allowNull: false,
      type: DataTypes.GEOMETRY('MULTIPOLYGON', 4326)
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
