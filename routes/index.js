var express = require('express');
var router = express.Router();
var request = require('request')

let HAZARDOUS_DRIVING_ENDPOINT = 'https://api.namara.io/v0/data_sets/cd367856-61fe-4939-9dee-b11ea05def2b/data/en-1?geometry_format=wkt&api_key=f7d210705fe136228b60d637403dd6f3c8f85e8535ace49707ed23ad48e75cd8&organization_id=5bdc5265c0b35c45d030159b&project_id=5bdc6e1ac0b35c47d0a721d3&select=geohash%2Clatitude_sw%2Clongitude_sw%2Clatitude_ne%2Clongitude_ne%2Clatitude%2Clongitude%2Ccity%2Ccounty%2Cstate%2Ccountry%2Ciso_3166_2%2Cseverityscore%2Cincidentstotal%2Cincidentscar%2Cincidentsmpv%2Cincidentsldt%2Cincidentsmdt%2Cincidentshdt%2Cincidentsother%2Cupdatedate%2Cversion%2Cgeometry';
let POLICE_ENDPOINT = 'https://api.namara.io/v0/data_sets/74287125-2cc6-4da1-8079-d59a09acd187/data/en-0?geometry_format=wkt&api_key=f7d210705fe136228b60d637403dd6f3c8f85e8535ace49707ed23ad48e75cd8&organization_id=5bdc5265c0b35c45d030159b&project_id=5bdc5ca1b0006245734c433c&select=geometry%2Cindex%2Caccnum%2Cyear%2Cdate%2Ctime%2Chour%2Cstreet1%2Cstreet2%2Coffset%2Croad_class%2Cdistrict%2Clatitude%2Clongitude%2Cloccoord%2Caccloc%2Ctraffctl%2Cvisibility%2Clight%2Crdsfcond%2Cacclass%2Cimpactype%2Cinvtype%2Cinvage%2Cinjury%2Cfatal_no%2Cinitdir%2Cvehtype%2Cmanoeuver%2Cdrivact%2Cdrivcond%2Cpedtype%2Cpedact%2Cpedcond%2Ccyclistype%2Ccycact%2Ccyccond%2Cpedestrian%2Ccyclist%2Cautomobile%2Cmotorcycle%2Ctruck%2Ctrsn_city_veh%2Cemerg_veh%2Cpassenger%2Cspeeding%2Cag_driv%2Credlight%2Calcohol%2Cdisability%2Cdivision%2Cward_name%2Cward_id%2Chood_id%2Chood_name%2Cfid';

function create_query(query) {
  var return_string = '';
  for (var col of query) {
    if (return_string === '') {
      return_string += col;
    } else {
      return_string += '%2C' + col;
    }
  }
  return return_string;
}

async function getHazardData() {
  return new Promise (function(resolve,reject) {
    request(HAZARDOUS_DRIVING_ENDPOINT, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body.length)
        resolve(body);
      }
      else {
        reject(err);
      }
    })
  })
}

async function getPoliceData() {
  return new Promise (function(resolve,reject) {
    request(POLICE_ENDPOINT, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else {
        reject(err);
      }
    })
  })
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  var policeData = await getPoliceData();
  var hazardData = await getHazardData();
  var results = {'police': policeData,  'hazard': hazardData}
  res.render('index', { result: results });
});



module.exports = router;
