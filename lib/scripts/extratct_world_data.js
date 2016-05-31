const fs = require('fs')
const worldTopo = require('../../src/data/topo/us-counties.js')

const data = worldTopo.objects['us-counties'].geometries.reduce((object, item) => {
  object[item.properties.id] = {
    name: item.properties ? item.properties.name : 'elo',
    code: item.properties ? item.properties.id : 'elo',
    value: '',
  }

  return object
}, {})

const countryCodes = worldTopo.objects['us-counties'].geometries.map((item) => item.id + "").sort()

fs.writeFile(__dirname + '/outputs/world-empty-data.json', JSON.stringify(countryCodes, null, '\t'), (err) => {
  if (err) return console.log(err);
  console.log('succesfully saved to world-empty-data.json');
});
