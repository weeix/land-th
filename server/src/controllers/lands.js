const sequelize = require('../sequelize');
const { Op } = require("sequelize");

const routeListLands = async (req, res, next) => {
  try {

    let pageOffset = 0;
    let pageSize = 10;

    if (
      'page' in req.query &&
      Number.isInteger(parseInt(req.query.page)) &&
      parseInt(req.query.page) >= 0
    ) {
      pageOffset = parseInt(req.query.page);
    }

    if (
      'size' in req.query &&
      ['10', '50', '100'].indexOf(req.query.size) >= 0
    ) {
      pageSize = parseInt(req.query.size);
    }

    const land = await sequelize.models.land.findAndCountAll({
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
      ],
      limit: pageSize,
      offset: pageOffset * pageSize
    });
    return res.send({
      currentPage: pageOffset,
      totalPages: Math.ceil(land.count/pageSize),
      totalItems: land.count,
      items: land.rows
    });
  } catch (error) {
    next(error);
  }
}

const routeLandOverlaps = async (req, res, next) => {
  try {
    const intersections = await sequelize.models.land.findAll({
      where: {
        [Op.or]: [
          sequelize.where(
            sequelize.fn(
              'ST_Overlaps',
              sequelize.col('geom'),
              sequelize.fn('ST_GeomFromText', req.body.geom, 4326)
            ),
            true
          ),
          sequelize.where(
            sequelize.fn(
              'ST_Equals',
              sequelize.col('geom'),
              sequelize.fn('ST_GeomFromText', req.body.geom, 4326)
            ),
            true
          )
        ]
      }
    });
    return res.send(intersections);
  } catch (error) {
    if ('name' in error && error.name == 'SequelizeDatabaseError') {
      res.status(400);
      return res.send({
        error: error.message
      });
    }
    next(error);
  }
}

module.exports = {
  routeListLands,
  routeLandOverlaps
};