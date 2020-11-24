import Vue from 'vue';

import dependencies from '../dependencies/index';

import ContactsApp from './ContactsApp.vue';

Vue.component(
  'contacts-app',
  ContactsApp,
);

window.vue = new Vue({
  el: '#contacts-client',

  data: {
    dependencies,
  },
});
