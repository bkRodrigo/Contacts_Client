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
            <!--Address search result-->
            <div
                v-show="saveEnabled"
                class="px-6"
            >
              <address-label :address="address"></address-label>
            </div>
            <!--Description-->
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
            <!--Add address-->
            <div class="relative pt-4 w-full">
              <label
                  class="w-full block text-center leading-7 text-sm text-gray-600"
              >
                Add the address to the contact
              </label>
              <div class="w-full flex justify-center">
                <button
                    id="addAddress"
                    @click="addAddress()"
                    :class="{
                      'btn-gray': !saveEnabled,
                      'cursor-not-allowed': !saveEnabled,
                      'btn-primary': saveEnabled,
                      'cursor-wait': saveButton.saving,
                    }"
                    class="block btn"
                >Add Address</button>
              </div>
              <message-label
                  :show="saveButton.notification.show"
                  :type="saveButton.notification.type"
                  v-html="saveButton.notification.text"
              ></message-label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ApiClient from '../services/ApiClient';
import MessageLabel from './MessageLabel.vue';
import AddressLabel from './AddressLabel.vue';

export default {
  name: 'AddAddress',

  components: {
    MessageLabel,
    AddressLabel,
  },

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
    saveButton: {
      saving: false,
      notification: {
        show: false,
        type: '',
        text: '',
      },
    },
    address: {
      streetAddress: '',
      latitude: '',
      longitude: '',
      postalCode: '',
      city: '',
      state: '',
      country: '',
    },
  }),

  computed: {
    saveEnabled() {
      return this.inputValue.length > 0 && this.address.streetAddress.length > 0;
    },
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
    saveEnabled(value) {
      if (value) {
        this.saveButton.notification.type = '';
        this.saveButton.notification.text = '';
        this.saveButton.notification.show = false;
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

      this.inputValue = streetAddr || this.inputValue;
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

    addAddress() {
      const vm = this;

      if (!this.saveEnabled) {
        this.saveButton.notification.type = 'warning';
        this.saveButton.notification.text = 'You have not specified an address yet';
        this.saveButton.notification.show = true;
        return;
      }
      if (this.saveButton.saving) {
        this.saveButton.notification.type = 'default';
        this.saveButton.notification.text = 'The address is saving, please wait';
        this.saveButton.notification.show = true;
        return;
      }
      this.saveButton.saving = true;
      ApiClient.post(
        '/api/address',
        {
          street_address: this.address.streetAddress,
          description: this.inputDescription,
          latitude: this.address.latitude,
          longitude: this.address.longitude,
          postal_code: this.address.postalCode,
          city: this.address.city,
          state: this.address.state,
          country: this.address.country,
        },
      ).then((res) => {
        if (res.data.error) {
          vm.$refs.autocompleteInput.focus();
          vm.focusAutocompleteInput();
          return;
        }

        this.$parent.$emit('close-modal', {
          emit: {
            name: 'address-created',
            data: res.data.data.address,
          },
        });
      }).catch(() => {
        vm.$refs.autocompleteInput.focus();
        vm.focusAutocompleteInput();
      });
    },
  },
};
</script>
