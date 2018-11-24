const fs = require('fs')
const alasql = require('alasql')
const { getOverallData } = require('./namara')
const Rx = require('rxjs')

const subject = new Rx.BehaviorSubject(null)

getOverallData().then(d => {
  cleansedDataset = JSON.parse(d.hazard).map(data => {
    return {
      latitude_sw: data.latitude_sw.toPrecision(6),
      longitude_sw: data.latitude_sw.toPrecision(6),
      latitude_ne: data.latitude_ne.toPrecision(6),
      longitude_ne: data.longitude_ne.toPrecision(6),
      latitude: data.latitude.toPrecision(6),
      longitude: data.longitude.toPrecision(6),
      severityscore: data.severityscore
    }
  })
  subject.next(cleansedDataset)
}

)


module.exports = subject
