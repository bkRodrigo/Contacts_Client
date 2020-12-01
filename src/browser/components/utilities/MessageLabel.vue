<template>
  <label
      v-show="show"
      :class="{
        'text-gray-600': defaultColor,
        'text-yellow-500': warningColor,
        'text-red-500': errorColor,
      }"
      class="w-full block text-xs text-center leading-7"
  >
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: 'MessageLabel',

  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'default',
    },
  },

  computed: {
    defaultColor() {
      return this.type ? this.type === 'default' : true;
    },
    warningColor() {
      return this.type === 'warning';
    },
    errorColor() {
      return this.type === 'error';
    },
  },
};
</script>
