const sequelize = require('../sequelize');

const routeLandtypesGet = async (req, res, next) => {
  try {
    const landtypes = await sequelize.models.landtype.findAll();
    return res.send(landtypes);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  routeLandtypesGet
};