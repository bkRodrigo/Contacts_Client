<template>
  <section class="text-gray-700 body-font relative">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-12">
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
          Search your address
        </h1>
        <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
          Search for an address by typing in the input below.
        </p>
      </div>
      <div class="lg:w-1/2 md:w-2/3 mx-auto">
        <div class="flex flex-wrap -m-2 justify-center">
          <div class="p-2 w-3/4">
            <div class="relative">
              <label for="address" class="leading-7 text-sm text-gray-600">
                Search
              </label>
              <input
                  ref="autocomplete"
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Type address here"
                  onfocus="value = ''"
                  class="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data: () => ({
    autocomplete: null,

  }),

  computed: {
    googleLoaded() {
      return this.$root.dependencies.google.places.loaded;
    }
  },

  watch: {
    googleLoaded(loaded) {
      if (loaded && !this.autocomplete) {
        this.setupGoogleAutocomplete();
      }
    },
  },

  methods: {
    setupGoogleAutocomplete() {
      this.autocomplete = new window.google.maps.places.Autocomplete(
          (this.$refs.autocomplete),
          {types: ['geocode']}
      );
      this.addGooglePlacesListener();
    },

    addGooglePlacesListener() {
      this.autocomplete.addListener('place_changed', () => this.placeChanged());
    },

    placeChanged() {
      let place = this.autocomplete.getPlace();
      let ac = place.address_components;
      let lat = place.geometry.location.lat();
      let lon = place.geometry.location.lng();
      let city = ac[0]["short_name"];
      debugger;

      console.log(`The user picked ${city} with the coordinates ${lat}, ${lon}`);
    }
  },
}
</script>
