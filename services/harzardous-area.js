const fs = require('fs')
const hazardousDataset = require('./sample-dataset/hazardous-area.json')
const alasql = require('alasql')

const cleansedDataset = hazardousDataset.data.map(data => {
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

module.exports= cleansedDataset
