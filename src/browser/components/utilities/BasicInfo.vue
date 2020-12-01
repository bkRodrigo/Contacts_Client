<template>
  <div>
    <div class="flex justify-between">
      <div class="pr-1">
        <label class="leading-7 text-xs text-gray-600 mt-2">
          First Name<span class="pl-1 text-red-500">(required)</span>
        </label>
        <debounced-input
            id="bi-firstname"
            placeholder="John"
            :new-value="firstname"
        ></debounced-input>
      </div>
      <div class="pl-1">
        <label class="leading-7 text-xs text-gray-600 mt-2">
          Last Name<span class="pl-1 text-red-500">(required)</span>
        </label>
        <debounced-input
            id="bi-lastname"
            placeholder="Doe"
            :new-value="lastname"
        ></debounced-input>
      </div>
    </div>
    <label class="leading-7 text-xs text-gray-600 mt-2">
      email
    </label>
    <debounced-input
        id="bi-email"
        placeholder="your-email@gmail.com"
        :new-value="email"
    ></debounced-input>
  </div>
</template>

<script>
import DebouncedInput from './DebouncedInput.vue';

export default {
  name: 'BasicInfo',

  components: {
    DebouncedInput,
  },

  data: () => ({
    email: '',
    firstname: '',
    lastname: '',
  }),

  computed: {
    emailValid() {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return re.test(String(this.email).toLowerCase());
    },
    firstnameValid() {
      return this.firstname.length > 0;
    },
    lastnameValid() {
      return this.lastname.length > 0;
    },
  },

  created() {
    this.$on('debounced-input-updated', this.inputUpdated);
    this.$on('debounced-input-blur', this.inputBlured);
  },

  methods: {
    inputUpdated(data) {
      if (data.id === 'bi-email') {
        this.emailUpdated(data.value);
      }
      if (data.id === 'bi-firstname') {
        this.firstnameUpdated(data.value);
      }
      if (data.id === 'bi-lastname') {
        this.lastnameUpdated(data.value);
      }
    },

    inputBlured(data) {
      if (data.id === 'bi-email') {
        this.emailBlured();
      }
      if (data.id === 'bi-firstname') {
        this.firstnameBlured();
      }
      if (data.id === 'bi-lastname') {
        this.lastnameBlured();
      }
    },

    emitUpdateEvent() {
      this.$parent.$emit('basic-info-updated', {
        firstName: {
          valid: this.firstnameValid,
          value: this.firstname,
        },
        lastName: {
          valid: this.lastnameValid,
          value: this.lastname,
        },
        email: {
          valid: this.emailValid,
          value: this.email,
        },
      });
    },

    emailUpdated(value) {
      this.email = value;
    },
    emailBlured() {
      if (!this.emailValid) {
        this.email = '';
      }
      this.emitUpdateEvent();
    },

    firstnameUpdated(value) {
      this.firstname = value;
    },
    firstnameBlured() {
      if (!this.firstnameValid) {
        this.firstname = '';
      }
      this.emitUpdateEvent();
    },

    lastnameUpdated(value) {
      this.lastname = value;
    },
    lastnameBlured() {
      if (!this.lastnameValid) {
        this.lastname = '';
      }
      this.emitUpdateEvent();
    },
  },
};
</script>
