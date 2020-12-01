<template>
  <div class="relative">
    <div class="absolute pl-4 pb-2 right-0">
      <button
          @click="prevPage()"
          class="btn btn-primary"
      >Prev</button>
      <button
          @click="nextPage()"
          class="btn btn-primary"
      >Next</button>
    </div>
    <div class="w-full flex justify-between items-end">
      <div class="p-2">
        <label for="search-city" class="leading-7 text-sm text-gray-600 mt-2">
          Search by City
        </label>
        <autofill-input
            id="search-city"
            search-endpoint="/contact/?search={}[city]&include=address"
            results-key="address.city.name"
            placeholder="City to search"
            :new-value="search.city"
        ></autofill-input>
      </div>
      <div class="p-2">
        <label for="search-state" class="leading-7 text-sm text-gray-600 mt-2">
          Search by State
        </label>
        <autofill-input
            id="search-state"
            search-endpoint="/contact/?search={}[state]&include=address"
            results-key="address.state.name"
            placeholder="State to search"
            :new-value="search.state"
        ></autofill-input>
      </div>
      <div class="p-2">
        <label for="search-email" class="leading-7 text-sm text-gray-600 mt-2">
          Search by e-mail
        </label>
        <autofill-input
            id="search-email"
            search-endpoint="/contact/?search={}[email]"
            results-key="email"
            placeholder="Email to search"
            :new-value="search.email"
        ></autofill-input>
      </div>
      <div class="p-2">
        <label for="search-phone" class="leading-7 text-sm text-gray-600 mt-2">
          Search by phone number
        </label>
        <autofill-input
            id="search-phone"
            search-endpoint="/phone/?search={}"
            results-key="number"
            placeholder="Type a number"
            :new-value="search.phone"
        ></autofill-input>
      </div>
      <div class="pb-2">
        Viewing page <span v-html="currPage"></span> of <span v-html="getLastPage"></span>
      </div>
    </div>
    <table class="border-collapse w-full">
      <thead>
      <tr>
        <th
            class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border
             border-gray-300 hidden lg:table-cell"
        >
          img
        </th>
        <th
            class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border
             border-gray-300 hidden lg:table-cell"
        >
          First Name
        </th>
        <th
            class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border
             border-gray-300 hidden lg:table-cell"
        >
          Last Name
        </th>
        <th
            class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border
             border-gray-300 hidden lg:table-cell"
        >
          contact
        </th>
        <th class="p-3 font-bold uppercase bg-gray-200 text-gray-600 border
         border-gray-300 hidden lg:table-cell"
        >
          Actions
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="contact in contacts" :key="contact.id"
          class="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row
           lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
      >
        <td
            class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b
             block lg:table-cell relative lg:static"
        >
          <span
              class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs
               font-bold uppercase"
          >img</span>
          <div class="w-full flex justify-center">
            <div class="w-20">
              <img
                  alt="thumbnail"
                  class="w-full object-cover h-full object-center block"
                  :src="getImage(contact)"
              >
            </div>
          </div>
        </td>
        <td
            class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b
             block lg:table-cell relative lg:static"
        >
          <span
              class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs
               font-bold uppercase"
          >First Name</span>
          <span v-html="contact.first_name"></span>
        </td>
        <td
            class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b
             block lg:table-cell relative lg:static"
        >
          <span
              class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs
               font-bold uppercase"
          >Last Name</span>
          <span v-html="contact.last_name"></span>
        </td>
        <td
            class="w-full lg:w-auto p-3 text-gray-800 border border-b
             text-left block lg:table-cell relative lg:static"
        >
          <span
              class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs
               font-bold uppercase"
          >Contact</span>
          <span v-html="getContactData(contact)"></span>
        </td>
        <td
            class="w-full lg:w-auto p-3 text-gray-800 text-center border border-b
             text-center block lg:table-cell relative lg:static"
        >
          <span
              class="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs
               font-bold uppercase"
          >Actions</span>
          <button
              @click="removeContact(contact)"
              class="btn btn-red"
          >Remove</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiClient from '../../services/ApiClient';
import AutofillInput from '../utilities/AutofillInput.vue';

export default {
  name: 'ContactList',

  components: {
    AutofillInput,
  },

  data: () => ({
    meta: {},
    contacts: [],
    currPage: 1,
    search: {
      email: '',
      phone: '',
      state: '',
      city: '',
    },
  }),

  computed: {
    getLastPage() {
      let maxPage = 0;
      if (this.meta) {
        maxPage = this.meta.last_page;
      }
      return maxPage;
    },
    getFirstPage() {
      return 1;
    },

    getPage() {
      let page = this.currPage;

      if (page < this.getFirstPage) {
        page = this.getFirstPage;
      }
      if (page > this.getLastPage) {
        page = this.getLastPage;
      }

      return page;
    },
  },

  mounted() {
    this.getContacts();
  },

  created() {
    this.$on('autofill-value', this.newSearch);
  },

  methods: {
    getContacts() {
      let endpoint = `/api/contact?page=${this.getPage}&include=photo,phones`;

      if (this.search.email) {
        endpoint = `${endpoint}&search=${this.search.email}[email]`;
      }
      if (this.search.phone) {
        endpoint = `${endpoint}&search=${this.search.phone}[phones]`;
      }
      if (this.search.city) {
        endpoint = `${endpoint}&search=${this.search.city}[city]`;
      }
      if (this.search.state) {
        endpoint = `${endpoint}&search=${this.search.state}[state]`;
      }

      ApiClient.get(endpoint)
        .then((res) => {
          this.meta = res.data.data.meta;
          this.contacts = res.data.data.data;
        })
        .catch(() => {
          this.failedResponse();
        });
    },

    failedResponse() {
      this.contacts = [];
    },

    newSearch(data) {
      if (data.id === 'search-city') {
        this.citySearch(data.value);
      }
      if (data.id === 'search-state') {
        this.stateSearch(data.value);
      }
      if (data.id === 'search-email') {
        this.emailSearch(data.value);
      }
      if (data.id === 'search-phone') {
        this.phoneSearch(data.value);
      }
    },

    citySearch(value) {
      this.currPage = this.getFirstPage;
      this.search.email = '';
      this.search.phone = '';
      this.search.city = value;
      this.search.state = '';
      this.getContacts();
    },
    stateSearch(value) {
      this.currPage = this.getFirstPage;
      this.search.email = '';
      this.search.phone = '';
      this.search.city = '';
      this.search.state = value;
      this.getContacts();
    },
    emailSearch(value) {
      this.currPage = this.getFirstPage;
      this.search.email = value;
      this.search.phone = '';
      this.search.city = '';
      this.search.state = '';
      this.getContacts();
    },
    phoneSearch(value) {
      this.currPage = this.getFirstPage;
      this.search.phone = value;
      this.search.email = '';
      this.search.city = '';
      this.search.state = '';
      this.getContacts();
    },

    removeContact(contact) {
      if (!contact.id) {
        return;
      }

      const endpoint = `/api/contact/${contact.id}`;

      ApiClient.delete(endpoint).then((res) => {
        if (!res.data.error) {
          this.getContacts();
        }
      }).catch((err) => console.log(err));
    },

    getImage(contact) {
      if (contact.photo) {
        return contact.photo.name || '';
      }
      return '';
    },
    getContactData(contact) {
      let content = '';

      if (contact.email) {
        content += `<strong>Email</strong>: ${contact.email}<br>`;
      }
      if (contact.phones && contact.phones.length > 0) {
        content += `<strong>Phone${contact.phones.length > 1 ? 's' : ''}</strong>: `;
        content += contact.phones.reduce((phonesString, phone) => {
          if (!phone.number) {
            return phonesString;
          }
          let finalString = phonesString;

          finalString += finalString.length > 0 ? ', ' : '';
          finalString += phone.number;
          if (phone.location && phone.location.name && phone.location.name.length > 0) {
            finalString = `${finalString} (${phone.location.name})`;
          }

          return finalString;
        }, '');
      }

      return content;
    },

    prevPage() {
      this.currPage--;
      this.validateCurrPage();
      this.getContacts();
    },
    nextPage() {
      this.currPage++;
      this.validateCurrPage();
      this.getContacts();
    },
    validateCurrPage() {
      if (this.currPage < this.getFirstPage) {
        this.currPage = this.getLastPage;
      }
      if (this.currPage > this.getLastPage) {
        this.currPage = this.getFirstPage;
      }
    },
  },
};
</script>
