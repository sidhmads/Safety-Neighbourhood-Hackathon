
const harzardousAreaData = require('../services/harzardous-area')
const collisionData = require('../services/fatal-collision')
const geolib = require('geolib')

let harzards
let collisions
let areas = []

harzardousAreaData.subscribe(data=>{
  harzards = data
  if (harzards && collisions) {
    areas =  combineData(harzards, collisions.aggLatLon)
  }
})

collisionData.subscribe(x=>{
  collisions = x
  if (harzards && collisions) {
      areas =  combineData(harzards, collisions.aggLatLon)
  }

})

const combineData = (harzards, collisions) => {
  return harzards.map(area=>{

    area.collisions = 0

    collisions.forEach( collision => {
      const isInside = geolib.isPointInside(
        { latitude: collision.latitude, longitude: collision.longitude},
        [
          {latitude: area.latitude_ne, longitude: area.longitude_ne},
          {latitude: area.latitude_sw, longitude: area.longitude_sw},
          {latitude: area.latitude, longitude: area.longitude}
        ])
        if (isInside){
            area.collisions += collision.accidentCount
        }
    })

    return area

  })
}




const getDangerLevel = async (latitude, longitude) => {

  let area = { level: 0 }

  for (var i =0; i < areas.length; i++ ){
    let isPointInside = geolib.isPointInside({
      latitude,
      longitude
    },
    [
      {latitude: areas[i].latitude_ne, longitude: areas[i].longitude_ne},
      {latitude: areas[i].latitude_sw, longitude: areas[i].longitude_sw},
      {latitude: areas[i].latitude, longitude: areas[i].longitude}
    ])

    if (isPointInside){
      area.level = areas[i].collisions
      break
    }
  }
  return area
}

module.exports = getDangerLevel
