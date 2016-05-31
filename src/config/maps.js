export default {
  types: [
    { code: 'usa', displayName: 'usa' },
    { code: 'world', displayName: 'world' },
    { code: 'us-counties', displayName: 'us counties' },
  ],
  configs: {
    'us-counties': {
      mapUi: {
        projection: 'albersUsa',
        scaleDenominator: 1,
      },
    },
    usa: {
      mapUi: {
        projection: 'albersUsa',
        scaleDenominator: 1,
      },
    },
    world: {
      mapUi: {
        projection: 'equirectangular',
        scaleDenominator: 2 * Math.PI,
      },
    },
  },
}
