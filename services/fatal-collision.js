const fs = require('fs')
const alasql = require('alasql')
const { getOverallData } = require('./namara')
const Rx = require('rxjs')
const subject = new Rx.BehaviorSubject(null)

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

getOverallData().then(data=>{
    //clean data first
    const cleansedDataset = JSON.parse(data.police).map(data => {
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

    alasql('SELECT * from collisions')

    subject.next({
      aggLatLon: aggregateByLatLon(),
      aggHour: aggregateByHour(),
      aggVisibility: aggregateByVisibility()
    })
})

// total num of fatal incident grouped by latitude and longitude


module.exports = subject



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
