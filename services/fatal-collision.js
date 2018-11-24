const fs = require('fs')
const fatalCollisionDataset = require('./sample-dataset/fatal-collision-dataset.json')
const alasql = require('alasql')
const { getOverallData } = require('./namara')

//clean data first
const cleansedDataset = fatalCollisionDataset.data.map(data => {
  return {
    hour: data.hour,
    light: data.light,
    visibility: data.visibility,
    roadCondition: data.rdsfcond,
    victimType: data.invtype,
    victimAge: data.invage,
    vehicleType: data.vehtype,
    longitude: data.longitude.toPrecision(6),
    latitude: data.latitude.toPrecision(6)
  }
})

alasql('CREATE TABLE collisions \
(hour int, light string, visibility string, roadCondition string, victimType string, vehicleType string, longitude decimal, latitude decimal)');

alasql('SELECT * INTO collisions FROM ?',[cleansedDataset]);

const data = alasql('SELECT * from collisions')


// total num of fatal incident grouped by latitude and longitude
const aggregateByLatLon = () => {
  return alasql("\
  SELECT B.longitude, B.latitude, B.accidentCount, (SELECT COUNT(*) FROM collisions) as total \
  from (SELECT longitude, \
  latitude, Count(*) as accidentCount From collisions GROUP BY longitude,latitude) as B"
  )
}

//show which hour has the most accidents
const aggregateByHour = () => {
  return alasql("\
  SELECT B.hour, B.accidentCount, B.accidentCount / (SELECT COUNT(*) FROM collisions) as ratio\
  from (SELECT hour, \
   Count(*) as accidentCount From collisions GROUP BY hour) as B")
}

//show which visibility has the most accidents
const aggregateByVisibility = () => {
  return alasql("\
  SELECT B.visibility, B.accidentCount, B.accidentCount / (SELECT COUNT(*) FROM collisions) as ratio\
  from (SELECT visibility, \
   Count(*) as accidentCount From collisions GROUP BY visibility) as B")
}

module.exports = {
  aggregateByLatLon,
  aggregateByHour,
  aggregateByVisibility
}

// console.log(aggregateByLatLon())
// console.log(aggregateByHour())

//check if total number of fatal incident
//generator will take O (M*N),
// M is the length from aggragation of fatal collision dataset
// N is the length from aggragation of hazadous area dataset

// hazardousDataset.data.map(data=>{
//   aggregatedData.forEach(aggData=>{
//
//   })
// })
