const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('amphoe', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.SMALLINT,
      comment: 'รหัสอำเภอ ตามรหัสมาตรฐานเขตการปกครองของไทย'
    },
    changwatId: {
      allowNull: false,
      type: DataTypes.SMALLINT,
      comment: 'รหัสจังหวัด ตามรหัสมาตรฐานเขตการปกครองของไทย'
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      comment: 'ชื่ออำเภอ'
    }
  },
  {
    underscored: true,
    comment: 'อำเภอ'
  });
}
