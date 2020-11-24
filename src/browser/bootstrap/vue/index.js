import Vue from 'vue';

import ContactsApp from './ContactsApp.vue';

Vue.component(
  'contacts-app',
  ContactsApp,
);

window.vue = new Vue({
  el: '#contacts-client',
});
