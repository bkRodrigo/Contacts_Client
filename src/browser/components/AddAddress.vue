<template>
  <section class="text-gray-700 body-font relative">
    <div class="container px-5 mx-auto">
      <div class="flex flex-col text-center w-full mb-12">
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
          Search your address
        </h1>
        <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
          Search for an address by typing in the input below.
        </p>
      </div>
      <div class="w-full">
        <div class="flex flex-wrap -m-2 justify-center">
          <div class="p-2 w-3/4">
            <div class="relative">
              <label for="address" class="leading-7 text-sm text-gray-600">
                Search
              </label>
              <input
                  ref="autocompleteInput"
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Type address here"
                  v-model="inputValue"
                  v-on:focus="focusAutocompleteInput"
                  v-on:click="focusAutocompleteInput"
                  class="w-full bg-gray-100 rounded border border-gray-300
                   focus:border-indigo-500 text-base outline-none text-gray-700
                    py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              >
            </div>
            <div
                v-show="inputValue.length > 0 && address.streetAddress.length > 0"
                class="px-6"
            >
              <h2
                  class="font-medium text-gray-900 tracking-widest text-sm"
                  v-html="address.streetAddress || 'Unknown Address'"
              ></h2>
              <div class="leading-relaxed">
                <ul>
                  <li v-html="
                    `${address.city}, ${address.state}`
                  "></li>
                  <li
                      class="text-sm"
                      v-html="address.country"
                  ></li>
                  <li
                      class="text-sm"
                      v-html="address.postalCode"
                  ></li>
                  <li
                      class="text-sm font-mono italic"
                      v-html="`lat: ${address.latitude}, lng: ${address.longitude}`"
                  ></li>
                </ul>
              </div>
            </div>
            <div class="relative">
              <label for="address" class="leading-7 text-sm text-gray-600">
                Address Description (optional)
              </label>
              <input
                  type="text"
                  id="address-description"
                  name="address"
                  placeholder="Additional information related to the address"
                  v-model="inputDescription"
                  class="w-full bg-gray-100 rounded border border-gray-300
                   focus:border-indigo-500 text-base outline-none text-gray-700
                    py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AddAddress',

  props: {
    startForm: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    autocomplete: null,
    inputValue: '',
    inputDescription: '',
    address: {
      streetAddress: '',
      description: '',
      latitude: '',
      longitude: '',
      postalCode: '',
      city: '',
      state: '',
      country: '',
    },
  }),

  computed: {
    googleLoaded() {
      return this.$root.dependencies.google.places.loaded;
    },
  },

  watch: {
    googleLoaded(loaded) {
      if (loaded && !this.autocomplete) {
        this.setupGoogleAutocomplete();
      }
    },
    startForm(value) {
      if (value) {
        this.inputDescription = '';
        this.$refs.autocompleteInput.focus();
      }
    },
  },

  methods: {
    setupGoogleAutocomplete() {
      this.autocomplete = new window.google.maps.places.Autocomplete(
        (this.$refs.autocompleteInput),
        { types: ['geocode'] },
      );
      this.autocomplete.setFields([
        'formatted_address',
        'address_components',
        'geometry',
      ]);
      this.addGooglePlacesListener();
    },

    addGooglePlacesListener() {
      this.autocomplete.addListener('place_changed', () => this.placeChanged());
    },

    placeChanged() {
      const place = this.autocomplete.getPlace(),
        lat = place.geometry.location.lat(),
        lon = place.geometry.location.lng(),
        streetAddr = place.formatted_address,
        desiredComponentItems = [
          'postal_code',
          'locality',
          'administrative_area_level_1',
          'country',
        ],
        addressComponents = place.address_components.reduce(
          (components, component) => {
            const componentItems = component.types;

            if (!componentItems) {
              return components;
            }
            for (let i = 0; i < componentItems.length; i++) {
              const item = componentItems[i].toLowerCase();

              if (desiredComponentItems.indexOf(item) !== -1) {
                const value = component.long_name
                  ? component.long_name : component.short_name;

                if (value) {
                  // eslint-disable-next-line no-param-reassign
                  components[item] = value;
                  i = componentItems.length;
                }
              }
            }
            return components;
          },
          {},
        );

      this.address.streetAddress = streetAddr ? streetAddr.split(',')[0] : 'Unknown Address';
      this.address.latitude = lat;
      this.address.longitude = lon;
      this.address.postalCode = addressComponents.postal_code || 'Unknown Postal Code';
      this.address.city = addressComponents.locality || 'Unknown City';
      this.address.state = addressComponents.administrative_area_level_1 || 'Unknown Area';
      this.address.country = addressComponents.country || 'Unknown Country';
    },

    focusAutocompleteInput() {
      this.inputValue = '';
      this.address.streetAddress = '';
      this.address.latitude = '';
      this.address.longitude = '';
      this.address.postalCode = '';
      this.address.city = '';
      this.address.state = '';
      this.address.country = '';
    },
  },
};
</script>
