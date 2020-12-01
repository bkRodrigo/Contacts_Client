<template>
  <div class="relative w-full">
    <debounced-input
        :id="autofillId" :placeholder="placeholder" :new-value="selectedValue"
    ></debounced-input>
    <div
        v-show="showResults"
        class="absolute z-40 w-full rounded-md py-2 mt-1 bg-white ring-1 ring-gray-300"
    >
      <ul class="bg-white">
        <li
            v-for="result in search.results" :key="result.id"
            @mouseover="highlight(result.id)"
            @mouseleave="unHighlight(result.id)"
            @click="optionClicked(result.id)"
            :class="{ 'bg-gray-300': result.highlight }"
            class="p-2 cursor-pointer"
        >
          {{ result.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ApiClient from '../../services/ApiClient';
import DebouncedInput from './DebouncedInput.vue';

export default {
  name: 'autofillInput',

  props: {
    id: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    searchEndpoint: {
      type: String,
      default: '',
    },
    resultsKey: {
      type: String,
      default: 'name',
    },
    newValue: {
      type: [String, Number],
      default: '',
    },
  },

  components: {
    DebouncedInput,
  },

  data: () => ({
    autofillId: '',
    highlighted: -1,
    selectedValue: '',
    skipWaiting: false,
    search: {
      results: [],
      waiting: false,
    },
  }),

  computed: {
    searchEnabled() {
      return this.searchEndpoint.length > 0;
    },
    showResults() {
      return this.search.waiting || this.search.results.length > 0;
    },
  },

  watch: {
    newValue(value) {
      this.setNewValue(value);
    },
  },

  created() {
    this.$on('debounced-input-updated', this.inputUpdated);
    this.$on('debounced-input-waiting', this.inputIsWaiting);
    this.$on('debounced-input-keypress-up', this.moveUp);
    this.$on('debounced-input-keypress-down', this.moveDown);
    this.$on('debounced-input-keypress-escape', this.escapeHit);
    this.$on('debounced-input-keypress-enter', this.enterHit);
    this.$on('debounced-input-blur', this.inputBlured);
  },

  mounted() {
    this.setId();
  },

  methods: {
    updateSelectedValue(value) {
      this.selectedValue = value;
      this.$parent.$emit('autofill-value', {
        id: this.autofillId,
        value: this.selectedValue,
      });
    },

    setNewValue(value) {
      this.selectedValue = value;
    },

    inputUpdated(data) {
      if (data.id !== this.autofillId || !this.searchEnabled) {
        return;
      }
      if (data.value === this.selectedValue) {
        this.search.waiting = false;
        return;
      }
      this.updateSelectedValue(data.value);

      const vm = this,
        url = this.createSearchUri(data.value || '');

      ApiClient.get(url)
        .then((res) => {
          this.resetResultsAndState();
          if (!res.data || res.data.error) {
            return;
          }

          const results = res.data.data;

          if (results.meta.total === 0) {
            return;
          }

          let itemCnt = 0;

          vm.search.results = results.data.reduce((items, item) => {
            if (itemCnt > 5) {
              return items;
            }

            const key = vm.resultsKey || 'name';

            items.push({
              id: itemCnt,
              text: item[key],
              highlight: false,
            });
            itemCnt++;

            return items;
          }, []);
          vm.search.waiting = false;
        })
        .catch(() => {
          vm.search.waiting = false;
        });
    },

    resetResultsAndState() {
      this.search.results = [];
      this.highlighted = -1;
      this.search.waiting = false;
    },

    optionClicked(index) {
      this.highlight(index);
      this.enterHit();
    },

    unHighlight(index) {
      for (let i = 0; i < this.search.results.length; i++) {
        const currItem = this.search.results[i];

        if (currItem.id === index) {
          currItem.highlight = false;
        }
      }
    },
    highlight(index) {
      this.highlighted = index;
      for (let i = 0; i < this.search.results.length; i++) {
        const currItem = this.search.results[i];

        currItem.highlight = currItem.id === index;
      }
    },

    moveUp() {
      this.highlighted--;
      if (this.highlighted < 0) {
        this.highlighted = this.search.results.length - 1;
      }
      this.highlight(this.highlighted);
    },

    moveDown() {
      this.highlighted++;
      if (this.highlighted >= this.search.results.length) {
        this.highlighted = 0;
      }
      this.highlight(this.highlighted);
    },

    escapeHit() {
      this.resetResultsAndState();
    },

    enterHit() {
      if (this.highlighted > -1 && this.highlighted < this.search.results.length) {
        this.skipWaiting = true;
        this.updateSelectedValue(this.search.results[this.highlighted].text);
      }
      this.resetResultsAndState();
    },

    inputBlured() {
      this.resetResultsAndState();
    },

    inputIsWaiting(data) {
      if (data.id !== this.autofillId || !this.searchEnabled) {
        return;
      }
      if (this.skipWaiting) {
        this.skipWaiting = false;
        return;
      }
      this.search.waiting = true;
    },

    createSearchUri(searchString) {
      return `/api${this.searchEndpoint.replace('{}', searchString)}`;
    },

    setId() {
      if (!this.id) {
        this.autofillId = this.generateId(10);
      } else {
        this.autofillId = this.id;
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
