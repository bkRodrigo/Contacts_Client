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
        <modal
            modal-title="Add Address"
            toggle-text="Set the contact's address"
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

export default {
  name: 'AddContact',

  components: {
    Modal,
    AddAddress,
  },

  data: () => ({
    focusAddress: false,
  }),

  created() {
    this.$on('modal-open', this.modalOpen);
    this.$on('modal-close', this.modalClose);
  },

  methods: {
    modalOpen() {
      this.focusAddress = true;
    },
    modalClose() {
      this.focusAddress = false;
    },
  },
};
</script>
