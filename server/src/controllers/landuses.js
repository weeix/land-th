const sequelize = require('../sequelize');

const routeListLanduses = async (req, res, next) => {
  try {
    if (!('landId' in req.params)) {
      return res.status(400).send('land ID not specified');
    }
    const lands = await sequelize.models.landuse.findAll({
      include: [{
        model: sequelize.models.landusetype
      }],
      order: [
        ['id', 'DESC']
      ],
      where: {
        landId: parseInt(req.params.landId)
      }
    });
    return res.send(lands);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  routeListLanduses
};