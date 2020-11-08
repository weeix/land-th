const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('changwat', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.SMALLINT,
      comment: 'รหัสจังหวัด ตามรหัสมาตรฐานเขตการปกครองของไทย'
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      comment: 'ชื่อจังหวัด'
    }
  },
  {
    underscored: true,
    comment: 'จังหวัด'
  });
}
