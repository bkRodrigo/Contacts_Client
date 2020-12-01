<template>
  <div class="flex justify-between">
    <div class="w-1/2">
      <label class="leading-7 text-xs text-gray-600 mt-2">
        Year
      </label>
      <debounced-input id="dp-year" placeholder="1991" :new-value="year"></debounced-input>
    </div>
    <div v-show="yearValid" class="w-1/2 flex pl-1">
      <div class="w-1/2">
        <label class="leading-7 text-xs text-gray-600 mt-2">
          Month
        </label>
        <debounced-input id="dp-month" placeholder="8" :new-value="month"></debounced-input>
      </div>
      <div v-show="monthValid" class="w-1/2 pl-1">
        <label class="leading-7 text-xs text-gray-600 mt-2">
          Day
        </label>
        <debounced-input id="dp-day" placeholder="31" :new-value="day"></debounced-input>
      </div>
    </div>
  </div>
</template>
<script>
import DebouncedInput from './DebouncedInput.vue';

export default {
  name: 'DatePicker',

  components: {
    DebouncedInput,
  },

  data: () => ({
    year: '',
    month: '',
    day: '',
  }),

  computed: {
    yearValid() {
      let valid = true;

      if (typeof this.year !== 'number') {
        valid = false;
      } else if (this.year < new Date().getFullYear() - 100
          || this.year > new Date().getFullYear() - 5
      ) {
        valid = false;
      }

      return valid;
    },
    monthValid() {
      if (!this.yearValid) {
        return false;
      }
      if (typeof this.month !== 'number') {
        return false;
      }

      return this.month >= 0 && this.month < 12;
    },
    dayValid() {
      if (!this.monthValid) {
        return false;
      }
      if (typeof this.day !== 'number') {
        return false;
      }

      const maxDay = new Date(this.year, this.month, 0).getDate();

      return this.day > 0 && this.day <= maxDay;
    },
  },

  created() {
    this.$on('debounced-input-updated', this.inputUpdated);
    this.$on('debounced-input-blur', this.inputBlured);
  },

  methods: {
    inputUpdated(data) {
      if (data.id === 'dp-year') {
        this.yearUpdated(data.value);
      }
      if (data.id === 'dp-month') {
        this.monthUpdated(data.value);
      }
      if (data.id === 'dp-day') {
        this.dayUpdated(data.value);
      }
    },

    inputBlured(data) {
      if (data.id === 'dp-year') {
        this.yearBlured();
      }
      if (data.id === 'dp-month') {
        this.monthBlured();
      }
      if (data.id === 'dp-day') {
        this.dayBlured();
      }
      this.emitUpdateEvent();
    },

    emitUpdateEvent() {
      this.$parent.$emit('date-picker-updated', {
        day: this.day,
        month: this.month,
        year: this.year,
        valid: this.dayValid,
      });
    },

    yearUpdated(value) {
      this.year = this.checkNumericValue(value);
    },
    yearBlured() {
      if (!this.yearValid) {
        this.year = '';
        this.month = '';
        this.day = '';
      }
    },

    monthUpdated(value) {
      this.month = this.checkNumericValue(value);
    },
    monthBlured() {
      if (!this.monthValid) {
        this.month = '';
        this.day = '';
      }
    },

    dayUpdated(value) {
      this.day = this.checkNumericValue(value);
    },
    dayBlured() {
      if (!this.dayValid) {
        this.day = '';
      }
    },

    checkNumericValue(value) {
      if (typeof value === 'string' && value.length === 0) {
        return '';
      }
      return parseInt(value, 10);
    },
  },
};
</script>
