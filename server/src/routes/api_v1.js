const { Router } = require('express');
const { routeLandtypesGet } = require('../controllers/landtypes');
const { routeListLands } = require('../controllers/lands');
const { routeListLandusetypes } = require('../controllers/landusetypes');
const { routeListLanduses } = require('../controllers/landuses');

const API_NAME = 'land-th state'
const API_VERSION = 1;

const router = Router();

router.get('/', (req, res) => {
  res.send({
    title: API_NAME,
    version: API_VERSION
  });
});

router.get('/landtypes', routeLandtypesGet);
router.get('/lands', routeListLands);
router.get('/lands/:landId/usages', routeListLanduses);
router.get('/landusetypes', routeListLandusetypes);

module.exports = router;
