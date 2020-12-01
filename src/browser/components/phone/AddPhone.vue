<template>
  <div>
    <div v-for="phone in phones" :key="phone.id">
      <add-phone-form :id="phone.id"></add-phone-form>
    </div>
    <button
        id="add-phone"
        @click="addAPhone"
        :class="{
          'btn-primary': addEnabled,
          'btn-gray': !addEnabled,
          'cursor-not-allowed': !addEnabled,
        }"
        class="block btn btn-primary"
    >+</button>
  </div>
</template>

<script>
import AddPhoneForm from './AddPhoneForm.vue';

export default {
  name: 'AddPhone',

  components: {
    AddPhoneForm,
  },

  data: () => ({
    idSeed: 0,
    phones: [],
    addEnabled: true,
  }),

  created() {
    this.$on('add-phone-form-cancel', this.cancelAddAPhone);
    this.$on('add-phone-form-save', this.updatePhone);
    this.$on('add-phone-form-updating', this.checkToEnableAddButton);
  },

  methods: {
    addAPhone() {
      if (!this.addEnabled) {
        return;
      }
      this.phones.push({
        id: `phone-${this.idSeed}`,
        number: '',
        location: '',
      });
      this.idSeed++;
      this.addEnabled = false;
    },

    updatePhone(data) {
      for (let i = 0; i < this.phones.length; i++) {
        const phone = this.phones[i];

        if (phone.id === data.id) {
          phone.number = data.number;
          phone.location = data.location;
          i = this.phones.length;
        }
      }
      this.checkToEnableAddButton();
    },

    cancelAddAPhone(data) {
      const cancelId = data.id;

      this.phones = this.phones.reduce((phones, phone) => {
        if (phone.id === cancelId && phone.number.length === 0) {
          return phones;
        }
        phones.push(phone);

        return phones;
      }, []);
      this.checkToEnableAddButton();
    },

    checkToEnableAddButton() {
      let enabled = true;

      this.$children.forEach((child) => {
        if (child.editing) {
          enabled = false;
        }
      });
      this.addEnabled = enabled;
      if (this.addEnabled) {
        this.emitUpdateEvent();
      }
    },

    emitUpdateEvent() {
      this.$parent.$emit('add-phone-updated', {
        phones: this.phones,
      });
    },
  },
};
</script>
