var request = require('request')

let HAZARDOUS_DRIVING_ENDPOINT = 'https://api.namara.io/v0/data_sets/cd367856-61fe-4939-9dee-b11ea05def2b/data/en-1?geometry_format=wkt&api_key=f7d210705fe136228b60d637403dd6f3c8f85e8535ace49707ed23ad48e75cd8&organization_id=5bdc5265c0b35c45d030159b&project_id=5bdc6e1ac0b35c47d0a721d3&select=';
let DEFAULT_HAZARDOUS_QUERY = 'latitude_sw%2Clongitude_sw%2Clatitude_ne%2Clongitude_ne%2Clatitude%2Clongitude%2Cseverityscore%2Cincidentstotal%2Cincidentscar%2Cincidentsmpv%2Cincidentsldt%2Cincidentsmdt%2Cincidentshdt%2Cincidentsother';

let POLICE_ENDPOINT = 'https://api.namara.io/v0/data_sets/74287125-2cc6-4da1-8079-d59a09acd187/data/en-0?geometry_format=wkt&api_key=f7d210705fe136228b60d637403dd6f3c8f85e8535ace49707ed23ad48e75cd8&organization_id=5bdc5265c0b35c45d030159b&project_id=5bdc5ca1b0006245734c433c&select=';
let DEFAULT_POLICE_QUERY = 'hour%2Clatitude%2Clongitude%2Clight%2Crdsfcond%2Cinvtype%2Cinvage%2Cvehtype%2Cvisibility';

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

async function getHazardData(query) {
    return new Promise (function(resolve,reject) {
      request(HAZARDOUS_DRIVING_ENDPOINT + query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        }
        else {
          reject(err);
        }
      })
    })
  }
  
  async function getPoliceData(query) {
    return new Promise (function(resolve,reject) {
      request(POLICE_ENDPOINT + query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
        }
        else {
          reject(err);
        }
      })
    })
  }

  async function getOverallData(query) {
    var hazard_query, police_query;
    var results = {};
    if (query) {
      if (Object.keys(query).includes('hazard')) {
        var custom_hazard_query = query.hazard;
        hazard_query = create_query(custom_hazard_query.split(','));
      }
      if (Object.keys(query).includes('police')) {
        var custom_police_query = query.police;
        police_query = create_query(custom_police_query.split(','));
      }
    }
    if (!hazard_query) {
      hazard_query = DEFAULT_HAZARDOUS_QUERY;
    }
    if (!police_query) {
      police_query = DEFAULT_POLICE_QUERY;
    }
    var policeData = await getPoliceData(police_query);
    var hazardData = await getHazardData(hazard_query);
    var results = {'police': policeData,  'hazard': hazardData}
    return results;
  }

module.exports = {
    getOverallData
  }