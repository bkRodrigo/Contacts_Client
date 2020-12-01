<template>
  <section class="text-gray-700 body-font relative">
    <div class="container px-5 w-3/4 mx-auto">
      <!--Address search-->
      <google-address-autocomplete
          :start-form="focusGoogleInput"
      ></google-address-autocomplete>
      <!--Address search result-->
      <div
          v-show="saveEnabled"
          class="px-6 py-4"
      >
        <address-label :address="address"></address-label>
      </div>
      <!--Description-->
      <div class="relative">
        <label for="address-description" class="leading-7 text-sm text-gray-600">
          Address Description (optional)
        </label>
        <input
            type="text"
            id="address-description"
            name="address-description"
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
              id="add-address"
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
  </section>
</template>

<script>
import ApiClient from '../../services/ApiClient';
import MessageLabel from '../utilities/MessageLabel.vue';
import AddressLabel from './AddressLabel.vue';
import GoogleAddressAutocomplete from '../dependencies/GoogleAddressAutocomplete.vue';

export default {
  name: 'AddAddress',

  components: {
    MessageLabel,
    AddressLabel,
    GoogleAddressAutocomplete,
  },

  props: {
    startForm: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    focusGoogleInput: false,
    inputDescription: '',
    saveButton: {
      saving: false,
      notification: {
        show: false,
        type: '',
        text: '',
      },
    },
    address: {},
  }),

  computed: {
    saveEnabled() {
      if (this.address.streetAddress) {
        return this.address.streetAddress.length > 0;
      }
      return false;
    },
  },

  watch: {
    startForm(value) {
      if (value) {
        this.inputDescription = '';
        this.focusGoogleInput = true;
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

  created() {
    this.$on('google-search-result', this.addressUpdated);
    this.$on('google-search-focused', this.addressFocused);
  },

  methods: {
    focusAutocompleteInput() {
      this.address = {};
    },

    addressUpdated(address) {
      this.address = address;
    },

    addressFocused() {
      this.focusGoogleInput = false;
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
        vm.saveButton.saving = false;
        if (res.data.error) {
          vm.focusGoogleInput = true;
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
        vm.saveButton.saving = false;
        vm.focusGoogleInput = true;
        vm.focusAutocompleteInput();
      });
    },
  },
};
</script>
