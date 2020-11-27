<template>
  <div>
    <h2
        class="font-medium text-gray-900 tracking-widest text-sm"
        v-html="parsed.streetAddress || 'Unknown Address'"
    ></h2>
    <div class="leading-relaxed">
      <ul>
        <li v-html="`${parsed.city}, ${parsed.state}`"></li>
        <li
            class="text-sm"
            v-html="parsed.country"
        ></li>
        <li
            class="text-sm"
            v-html="parsed.postalCode"
        ></li>
        <li
            class="text-sm font-mono italic"
            v-html="`lat: ${parsed.latitude}, lng: ${parsed.longitude}`"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddressLabel',

  props: {
    address: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    parsed() {
      return {
        streetAddress: this.address.streetAddress || '',
        latitude: this.address.latitude || '',
        longitude: this.address.longitude || '',
        postalCode: this.address.postalCode || '',
        city: this.address.city || '',
        state: this.address.state || '',
        country: this.address.country || '',
      };
    },
  },
};
</script>
