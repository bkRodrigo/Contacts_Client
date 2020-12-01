<template>
  <div class="flex flex-col">
    <!--Number-->
    <div class="py-2 flex">
      <label v-show="!editing" v-html="numberToString" class="font-mono py-2"></label>
      <debounced-input
          v-show="editing"
          :id="id"
          :placeholder="'+54 1 5555-5555'"
          :new-value="number"
      ></debounced-input>
      <button
          id="add-phone"
          @click="addEditClicked"
          v-html="editing ? 'Save' : 'Update'"
          :class="{
          'btn-primary': actionsEnabled,
          'btn-gray': !actionsEnabled,
          'cursor-not-allowed': !actionsEnabled,
        }"
          class="block btn ml-2"
      ></button>
      <button
          v-show="editing"
          id="cancel-add-phone"
          @click="cancelAddClicked"
          class="block btn btn-primary ml-2"
      >Cancel</button>
    </div>
    <!--Location-->
    <div v-show="editing" class="py-2">
      <label :for="`${id}-location`" class="leading-7 text-sm text-gray-600 mt-2">
        Specify the location for this phone
      </label>
      <autofill-input
          :id="`${id}-location`"
          search-endpoint="/location/?search={}"
          placeholder="Home / Work phone"
      ></autofill-input>
    </div>
  </div>
</template>

<script>
import DebouncedInput from '../utilities/DebouncedInput.vue';
import AutofillInput from '../utilities/AutofillInput.vue';

export default {
  name: 'AddPhoneForm',

  props: {
    id: {
      type: String,
      defaul: '',
    },
  },

  components: {
    DebouncedInput,
    AutofillInput,
  },

  data: () => ({
    editing: true,
    prevNumber: '',
    number: '',
    originalNumber: '',
    location: '',
    tentativeLocation: '',
  }),

  computed: {
    actionsEnabled() {
      return !this.editing || (
        (this.editing && this.number.length > 0)
        && (
          this.number !== this.prevNumber
          || this.tentativeLocation !== this.location
        ));
    },
    numberToString() {
      const location = this.location.length === 0 ? '' : ` (${this.location})`;

      return `${this.number}${location}`;
    },
  },

  mounted() {
    this.focusInput();
  },

  created() {
    this.$on('debounced-input-updated', this.inputUpdated);
    this.$on('autofill-value', this.locationUpdated);
  },

  methods: {
    focusInput() {
      if (this.editing) {
        for (let i = 0; i < this.$children.length; i++) {
          const child = this.$children[i];

          if (child.id && child.id === this.id) {
            child.focus();
            i = this.$children.length;
          }
        }
      }
    },

    inputUpdated(data) {
      if (data.id !== this.id) {
        return;
      }
      this.prevNumber = this.number;
      this.number = data.value;
    },

    locationUpdated(data) {
      const locationId = `${this.id}-location`;

      if (data.id !== locationId) {
        return;
      }
      this.tentativeLocation = data.value;
    },

    addEditClicked() {
      if (!this.actionsEnabled) {
        return;
      }

      let emitEvent = 'add-phone-form-updating';

      if (this.editing) {
        this.originalNumber = this.number;
        emitEvent = 'add-phone-form-save';
        this.location = this.tentativeLocation;
      } else {
        this.number = this.originalNumber;
      }
      this.prevNumber = this.number;
      this.editing = !this.editing;
      this.$parent.$emit(emitEvent, {
        id: this.id, number: this.number, location: this.location,
      });
      setTimeout(() => {
        this.focusInput();
      }, 200);
    },

    cancelAddClicked() {
      this.editing = false;
      this.number = this.originalNumber;
      this.$parent.$emit('add-phone-form-cancel', { id: this.id });
    },
  },
};
</script>
