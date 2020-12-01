<template>
  <div class="text-gray-700 body-font relative">
    <div class="flex flex-col text-center w-full mb-12">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
        Search your address
      </h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
        Search for an address by typing in the input below.
      </p>
    </div>
    <div class="w-full">
      <!--Addresss search-->
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoogleAddressAutocomplete',

  data: () => ({
    inputValue: '',
  }),

  props: {
    startForm: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    googleLoaded() {
      return this.$root.dependencies.google.places.loaded;
    },
  },

  watch: {
    startForm(value) {
      if (value) {
        this.$refs.autocompleteInput.focus();
        this.$parent.$emit('google-search-focused');
      }
    },
    googleLoaded(loaded) {
      if (loaded && !this.autocomplete) {
        this.setupGoogleAutocomplete();
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

    focusAutocompleteInput() {
      this.inputValue = '';
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

      this.inputValue = streetAddr || this.inputValue;

      const result = {
        streetAddress: streetAddr ? streetAddr.split(',')[0] : 'Unknown Address',
        latitude: lat,
        longitude: lon,
        postalCode: addressComponents.postal_code || 'Unknown Postal Code',
        city: addressComponents.locality || 'Unknown City',
        state: addressComponents.administrative_area_level_1 || 'Unknown Area',
        country: addressComponents.country || 'Unknown Country',
      };

      this.$parent.$emit('google-search-result', result);
    },
  },
};
</script>
