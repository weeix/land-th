const { Router } = require('express');
const { routeLandtypesGet } = require('../controllers/landtypes');

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

module.exports = router;
