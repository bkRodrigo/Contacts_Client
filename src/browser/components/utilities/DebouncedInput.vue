<template>
  <input
      @keyup.37="leftKey"
      @keyup.38="upKey"
      @keyup.39="rightKey"
      @keyup.27="escapeKey"
      @keyup.40="downKey"
      @keyup.enter="enterKey"
      @blur="bluredOut"
      type="text"
      v-model="input"
      :id="inputId"
      :name="id"
      ref="debouncedInput"
      :placeholder="placeholder"
      class="w-full bg-gray-100 rounded border border-gray-300
             focus:border-indigo-500 text-base outline-none text-gray-700
             py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
  >
</template>

<script>
export default {
  name: 'DebouncedInput',

  props: {
    id: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    debounceTime: {
      type: Number,
      default: 300,
    },
    newValue: {
      type: [String, Number],
      default: '',
    },
  },

  data: () => ({
    inputId: '',
    input: '',
    prevValue: '',
    debounce: {
      target: 0,
      waiting: false,
    },
  }),

  watch: {
    input() {
      this.setChangeEvent();
    },
    id() {
      this.setId();
    },
    newValue(value) {
      this.setNewValue(value);
    },
  },

  mounted() {
    this.setId();
  },

  methods: {
    focus() {
      this.$refs.debouncedInput.focus();
    },

    setNewValue(value) {
      this.input = value;
    },

    setChangeEvent() {
      this.debounce.target = Date.now() + this.debounceTime;
      if (this.debounce.waiting) {
        return;
      }
      this.$parent.$emit('debounced-input-waiting', {
        id: this.inputId,
      });
      this.debounce.waiting = true;
      this.changePromise().then(() => {
        this.debounce.waiting = false;
        if (this.prevValue !== this.input) {
          this.$parent.$emit('debounced-input-updated', {
            id: this.inputId,
            value: this.input,
            prevValue: this.prevValue,
          });
        }
        this.prevValue = this.input;
      });
    },

    changePromise() {
      return new Promise((confirmChange) => {
        const loop = setInterval(
          () => {
            const time = Date.now();

            if (time < this.debounce.target) {
              return;
            }
            confirmChange();
            clearInterval(loop);
          },
          this.debounceTime * 0.8,
        );
      });
    },

    escapeKey(event) {
      if (document.activeElement === this.$refs.debouncedInput) {
        event.stopPropagation();
      }
      this.$parent.$emit('debounced-input-keypress-escape');
    },
    leftKey() {
      this.$parent.$emit('debounced-input-keypress-left');
    },
    upKey() {
      this.$parent.$emit('debounced-input-keypress-up');
    },
    rightKey() {
      this.$parent.$emit('debounced-input-keypress-right');
    },
    downKey() {
      this.$parent.$emit('debounced-input-keypress-down');
    },
    enterKey() {
      this.$parent.$emit('debounced-input-keypress-enter');
    },
    bluredOut() {
      setTimeout(() => {
        this.$parent.$emit('debounced-input-blur', { id: this.inputId });
      }, 300);
    },

    setId() {
      if (!this.id) {
        this.inputId = this.generateId(10);
      } else {
        this.inputId = this.id;
      }
    },

    generateId(len) {
      const multiple = parseInt(`1${[...Array(len).keys()].map(() => '0').join('')}`, 10),
        options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

      return Math.floor(Math.random() * multiple).toString().split('')
        .reduce((id, i) => `${id}${options[i]}`, '');
    },
  },
};
</script>
