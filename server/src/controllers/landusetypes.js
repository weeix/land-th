const sequelize = require('../sequelize');

const routeListLandusetypes = async (req, res, next) => {
  try {
    const landusetypes = await sequelize.models.landusetype.findAll();
    return res.send(landusetypes);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  routeListLandusetypes
};