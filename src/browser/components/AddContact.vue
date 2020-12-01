<template>
  <div>
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-col text-center w-full mb-12">
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
          Add a Contact
        </h1>
        <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
          Fill this form out in order to add a new contact.
        </p>
      </div>
      <div class="flex flex-col lg:w-1/2 md:w-2/3 mx-auto">
        <!--Basic info-->
        <basic-info></basic-info>
        <!--Birthday-->
        <label class="leading-7 text-sm text-gray-600 mt-2">
          Birth day<span class="pl-1 text-xs">(optional)</span>
        </label>
        <date-picker></date-picker>
        <!--Photo-->
        <label for="add-photo" class="leading-7 text-sm text-gray-600 mt-2">
          Add contact photo<span class="pl-1 text-xs">(optional)</span>
        </label>
        <file-uploader></file-uploader>
        <!--Phone-->
        <label class="leading-7 text-sm text-gray-600 mt-2">
          Phone(s)<span class="pl-1 text-xs">(optional)</span>
        </label>
        <add-phone></add-phone>
        <!--Address-->
        <label for="add-address" class="leading-7 text-sm text-gray-600 mt-2">
          Address<span class="pl-1 text-xs">(optional)</span>
        </label>
        <div v-show="address.added" class="pt-1 pb-4">
          <address-label :address="address.value"></address-label>
        </div>
        <div>
          <modal
              modal-title="Add Address"
              :toggle-text="addAddressButtonText"
          >
            <add-address :start-form="focusAddress"></add-address>
          </modal>
        </div>
        <!--Company-->
        <label for="contact-company" class="leading-7 text-sm text-gray-600 mt-2">
          Company<span class="pl-1 text-xs">(optional)</span>
        </label>
        <autofill-input
            id="contact-company"
            search-endpoint="/company/?search={}"
            placeholder="Company name"
        ></autofill-input>
        <!--Save-->
        <div class="flex justify-end">
          <button
              @click="cancelAddContact()"
              class="btn btn-primary mt-5"
          >Cancel</button>
          <button
              @click="saveContact()"
              :class="{
                'btn-primary': saveEnabled,
                'btn-gray': !saveEnabled,
              }"
              class="btn mt-5 ml-3"
          >Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiClient from '../services/ApiClient';
import Modal from './Modal.vue';
import AddAddress from './address/AddAddress.vue';
import AddressLabel from './address/AddressLabel.vue';
import AutofillInput from './utilities/AutofillInput.vue';
import AddPhone from './phone/AddPhone.vue';
import FileUploader from './utilities/FileUploader.vue';
import DatePicker from './utilities/DatePicker.vue';
import BasicInfo from './utilities/BasicInfo.vue';

export default {
  name: 'AddContact',

  components: {
    Modal,
    AddAddress,
    AddressLabel,
    AutofillInput,
    AddPhone,
    FileUploader,
    DatePicker,
    BasicInfo,
  },

  data: () => ({
    focusAddress: false,
    basicInfo: {
      isValid: false,
      firstName: '',
      lastName: '',
      email: '',
    },
    birthday: {
      valid: false,
      str: '',
      day: '',
      month: '',
      year: '',
    },
    photo: {
      id: null,
    },
    phones: [],
    address: {
      added: false,
      id: '',
      value: {
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        latitude: '',
        longitude: '',
      },
    },
    company: {
      name: '',
    },
  }),

  computed: {
    saveEnabled() {
      return this.basicInfo.isValid;
    },

    addAddressButtonText() {
      return this.address.added ? 'Change Address' : 'Add Address';
    },
  },

  created() {
    this.$on('modal-open', this.modalOpen);
    this.$on('modal-close', this.modalClose);
    this.$on('address-created', this.addressCreated);
    this.$on('basic-info-updated', this.basicInfoUpdated);
    this.$on('date-picker-updated', this.datePickerUpdated);
    this.$on('file-uploader-updated', this.fileUploaderUpdated);
    this.$on('add-phone-updated', this.addPhoneUpdated);
    this.$on('autofill-value', this.companyUpdated);
  },

  methods: {
    saveContact() {
      if (!this.saveEnabled) {
        return;
      }
      const payload = {};

      // Add Basic info to payload
      payload.first_name = this.basicInfo.firstName;
      payload.last_name = this.basicInfo.lastName;
      payload.email = this.basicInfo.email;
      // Add Birthday to payload
      if (this.birthday.valid) {
        payload.birthday = this.birthday.str;
      }
      // Add photo to payload
      if (this.photo.id) {
        payload.photo_id = this.photo.id;
      }
      // Add Phones to payload
      if (this.phones.length > 0) {
        payload.phones = [];
      }
      this.phones.forEach((phone) => {
        payload.phones.push({
          number: phone.number,
          location: phone.location || '',
        });
      });
      // Add Address to payload
      if (this.address.added) {
        payload.address_id = this.address.id;
      }
      // Add Company to payload
      if (this.company.name) {
        payload.company = this.company.name;
      }

      ApiClient.post('/api/contact', payload).then((res) => {
        console.log(res);
        this.contactAdded();
      }).catch(() => {
        this.cancelAddContact();
      });
    },

    contactAdded() {
      this.$parent.$emit('add-contact-added');
    },
    cancelAddContact() {
      this.$parent.$emit('close-add-closed');
    },

    modalOpen() {
      this.focusAddress = true;
    },
    modalClose() {
      this.focusAddress = false;
    },
    addressCreated(address) {
      this.address.id = address.data.id;
      this.address.added = true;
      this.address.value.streetAddress = address.data.street_address || '';
      this.address.value.city = address.data.city_id ? address.data.city.name : '';
      this.address.value.state = address.data.state_id ? address.data.state.name : '';
      this.address.value.country = address.data.country_id
        ? address.data.country.name : '';
      this.address.value.postalCode = address.data.postalcode_id
        ? address.data.postal_code.code : '';
      this.address.value.latitude = address.data.latitude || '';
      this.address.value.longitude = address.data.longitude || '';
    },

    basicInfoUpdated(data) {
      this.basicInfo.firstName = data.firstName.value;
      this.basicInfo.lastName = data.lastName.value;
      this.basicInfo.email = data.email.value;
      this.basicInfo.isValid = data.firstName.valid && data.lastName.valid;
    },
    datePickerUpdated(data) {
      this.birthday.valid = data.valid;
      if (data.valid) {
        this.birthday.day = data.day;
        this.birthday.month = data.month;
        this.birthday.year = data.year;
        this.birthday.str = data.year;
        this.birthday.str += `-${data.month < 10 ? '0' : ''}${data.month}`;
        this.birthday.str += `-${data.day < 10 ? '0' : ''}${data.day}`;
      } else {
        this.birthday.day = '';
        this.birthday.month = '';
        this.birthday.year = '';
        this.birthday.str = '';
      }
    },
    fileUploaderUpdated(data) {
      this.photo.id = data.photoId;
    },
    addPhoneUpdated(data) {
      this.phones = data.phones;
    },
    companyUpdated(data) {
      if (data.id !== 'contact-company') {
        return;
      }
      this.company.name = data.value || '';
    },
  },
};
</script>
