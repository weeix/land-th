const sequelize = require('../sequelize');

const routeListLands = async (req, res, next) => {
  try {
    const lands = await sequelize.models.land.findAll({
      include: [{
        model: sequelize.models.tambon,
        attributes: {
          exclude: ['geom']
        },
        include: [{
          model: sequelize.models.amphoe,
          include: [{
            model: sequelize.models.changwat
          }]
        }]
      }],
      attributes: {
        exclude: ['geom']
      },
      order: [
        ['id', 'DESC']
      ]
    });
    return res.send(lands);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  routeListLands
};