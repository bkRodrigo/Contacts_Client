<template>
  <div>
    <div v-show="showAddContact">
      <AddContact />
    </div>
    <div v-show="!showAddContact">
      <div class="container px-5 py-8 mx-auto">
        <div class="py-4">
          <button
              @click="addContact()"
              class="btn btn-primary"
          >Add a Contact</button>
        </div>
        <contact-list></contact-list>
      </div>
    </div>
  </div>
</template>

<script>
import AddContact from '../../components/AddContact.vue';
import ContactList from '../../components/Contacts/ContactList.vue';

export default {
  name: 'ContactsApp',

  components: {
    AddContact,
    ContactList,
  },

  data: () => ({
    showAddContact: false,
  }),

  created() {
    this.$on('add-contact-added', this.addContactAdded);
    this.$on('close-add-closed', this.addContactClosed);
  },

  methods: {
    addContact() {
      this.showAddContact = true;
    },

    addContactAdded() {
      this.showAddContact = false;
    },

    addContactClosed() {
      this.showAddContact = false;
    },
  },
};
</script>
