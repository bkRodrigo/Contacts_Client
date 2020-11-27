<template>
  <div>
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-12">
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
          Add a Contact
        </h1>
        <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
          Fill this form out in order to add a new contact.
        </p>
      </div>
      <div class="lg:w-1/2 md:w-2/3 mx-auto">
        <div v-show="address.added" class="py-4">
          <address-label :address="address.value"></address-label>
        </div>
        <modal
            modal-title="Add Address"
            :toggle-text="addAddressButtonText"
        >
          <add-address :start-form="focusAddress"></add-address>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from './Modal.vue';
import AddAddress from './AddAddress.vue';
import AddressLabel from './AddressLabel.vue';

export default {
  name: 'AddContact',

  components: {
    Modal,
    AddAddress,
    AddressLabel,
  },

  data: () => ({
    focusAddress: false,
    address: {
      added: false,
      id: '',
      value: {
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        latitude: '',
        longitude: '',
      },
    },
  }),

  computed: {
    addAddressButtonText() {
      return this.address.added ? 'Change Address' : 'Add Address';
    },
  },

  created() {
    this.$on('modal-open', this.modalOpen);
    this.$on('modal-close', this.modalClose);
    this.$on('address-created', this.addressCreated);
  },

  methods: {
    modalOpen() {
      this.focusAddress = true;
    },
    modalClose() {
      this.focusAddress = false;
    },
    addressCreated(address) {
      this.address.id = address.data.id;
      this.address.added = true;
      this.address.value.streetAddress = address.data.street_address || '';
      this.address.value.city = address.data.city_id ? address.data.city.name : '';
      this.address.value.state = address.data.state_id ? address.data.state.name : '';
      this.address.value.country = address.data.country_id
        ? address.data.country.name : '';
      this.address.value.postalCode = address.data.postalcode_id
        ? address.data.postal_code.code : '';
      this.address.value.latitude = address.data.latitude || '';
      this.address.value.longitude = address.data.longitude || '';
    },
  },
};
</script>
