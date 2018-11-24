var express = require('express');
var router = express.Router();
const dataHandler = require('../services/namara').getOverallData

/* GET home page. */
router.get('/', async function(req, res, next) {
  var data = await dataHandler(req.query)
  console.log(data.hazard)
  res.end()
});


module.exports = router;
