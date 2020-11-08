const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('tambon', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'รหัสตำบล ตามรหัสมาตรฐานเขตการปกครองของไทย'
    },
    amphoeId: {
      allowNull: false,
      type: DataTypes.SMALLINT,
      comment: 'รหัสอำเภอ ตามรหัสมาตรฐานเขตการปกครองของไทย'
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      comment: 'ชื่อตำบล'
    },
    geom: {
      allowNull: false,
      type: DataTypes.GEOMETRY('MULTIPOLYGON', 4326),
      comment: 'รูปแปลงตำบล'
    }
  },
  {
    underscored: true,
    comment: 'ตำบล'
  });
}
