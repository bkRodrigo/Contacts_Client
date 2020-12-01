<template>
  <div class="flex flex-col">
    <div v-show="photoId !== null" class="md:p-2 p-1 w-1/3">
      <img
          alt="thumbnail"
          class="w-full object-cover h-full object-center block"
          :src="photoUri"
      >
    </div>
    <div>
      <input class="hidden" ref="fileInput" type="file" @change="onFileChanged">
      <button
          id="add-photo" name="add-photo"
          class="btn btn-primary"
          @click="triggerFileInput"
      >Add Photo</button>
      <label
          v-show="this.fileName !== ''" v-html="fileName" class="font-mono py-2"
      ></label>
    </div>
  </div>
</template>

<script>
import ApiClient from '../../services/ApiClient';

export default {
  name: 'FileUploader',

  data: () => ({
    selectedFile: null,
    fileName: '',
    photoUri: '',
    photoId: null,
  }),

  watch: {
    photoId() {
      this.emitUpdateEvent();
    },
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    onFileChanged() {
      this.selectedFile = this.$refs.fileInput.files[0];
      this.fileName = this.selectedFile.name;
      this.upload();
    },

    emitUpdateEvent() {
      this.$parent.$emit('file-uploader-updated', {
        photoId: !this.photoId ? null : this.photoId,
      });
    },

    upload() {
      if (this.fileName.length <= 0 || this.selectedFile === null) {
        this.resetUploader();
        return;
      }

      const formData = new FormData();

      formData.append('photo', this.selectedFile);

      ApiClient.postMedia(
        '/api/photo', formData,
      ).then((res) => {
        if (!res || !res.data || res.data.error) {
          this.resetUploader();
          return;
        }

        const photo = res.data.data.photo;

        this.photoUri = photo.name;
        this.photoId = photo.id;
      }).catch(() => {
        this.resetUploader();
      });
    },

    resetUploader() {
      this.selectedFile = null;
      this.fileName = '';
      this.photoUri = '';
      this.photoId = null;
    },
  },
};
</script>
