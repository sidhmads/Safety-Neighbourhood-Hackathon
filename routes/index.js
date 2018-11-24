var express = require('express');
var router = express.Router();
const dataHandler = require('../services/namara').getOverallData
const getScore = require('../managers/area-score')
/* GET home page. */
router.get('/', async function(req, res, next) {
  var data = await dataHandler(req.query)
  console.log(data.hazard)
  res.end()
});


router.get('/dangerLevel/lat/:latitude/lon/:longitude', async (req, res, next) => {

    const {latitude, longitude} = req.params
    const level = await getScore(latitude, longitude)
    res.json(level)
})

module.exports = router;
