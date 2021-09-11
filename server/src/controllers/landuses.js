const sequelize = require('../sequelize');

const routeListLanduses = async (req, res, next) => {
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

    if (!('landId' in req.params)) {
      return res.status(400).send('land ID not specified');
    }

    const landuse = await sequelize.models.landuse.findAndCountAll({
      include: [{
        model: sequelize.models.landusetype
      }],
      order: [
        ['id', 'DESC']
      ],
      where: {
        landId: parseInt(req.params.landId)
      },
      limit: pageSize,
      offset: pageOffset * pageSize
    });
    return res.send({
      currentPage: pageOffset,
      totalPages: Math.ceil(landuse.count/pageSize),
      totalItems: landuse.count,
      items: landuse.rows
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  routeListLanduses
};