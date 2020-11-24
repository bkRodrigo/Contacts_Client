// Set up Google libraries state
const dependencies = {
  google: {
    places: {
      loaded: false,
      ready: () => { dependencies.google.places.loaded = true; },
    },
  },
};

export default dependencies;
