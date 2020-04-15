const fs = require('fs')
const csv = require('csvtojson')
const path = require('path')

console.log(path.resolve(__dirname + '/uscities.csv'))
csv().fromFile(path.resolve(__dirname + '/uscities.csv')).then(source => console.log(source))