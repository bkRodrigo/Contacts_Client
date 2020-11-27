<template>
  <div>
    <!--Toggle Button-->
    <button
        v-html="toggleText"
        @click="toggleModal()"
        class="btn btn-primary"
    ></button>

    <!--Modal-->
    <div
        :class="{ 'opacity-0': !open, 'pointer-events-none': !open }"
        class="fixed w-full h-full top-0 left-0 flex items-center justify-center"
    >
      <div
          @click="toggleModal()"
          class="absolute w-full h-full bg-white opacity-95"></div>

      <div class="fixed bg-gray-200 lg:w-1/2 md:w-2/3 mx-auto h-full z-50 overflow-y-auto bg-white">

        <div
            @click="toggleModal()"
            class="absolute top-0 right-0 cursor-pointer flex flex-col
             items-center mt-4 mr-4 text-black text-sm z-50"
        >
          <svg
              class="fill-current text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="18" height="18" viewBox="0 0 18 18"
          >
            <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47
                 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
            />
          </svg>
          (Esc)
        </div>

        <!-- Add margin if you want to see grey behind the modal-->
        <div class="container mx-auto h-auto text-left p-4">

          <!--Title-->
          <div class="flex justify-between items-center pb-2">
            <p class="text-2xl font-bold" v-html="modalTitle"></p>
          </div>

          <!--Body-->
          <slot></slot>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',

  props: {
    toggleText: {
      type: String,
      default: 'Open Modal',
    },
    modalTitle: {
      type: String,
      default: 'Modal Title',
    },
  },

  data: () => ({
    open: false,
  }),

  created() {
    const vm = this;

    document.addEventListener('keydown', (event) => {
      vm.keyPress(event);
    });

    this.$on('close-modal', this.closeModalEvent);
  },

  methods: {
    keyPress(event) {
      if (!this.open) {
        return;
      }

      const evt = event || window.event;

      let isEscape = false;

      if ('key' in evt) {
        isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
      } else {
        isEscape = evt.keyCode === 27;
      }
      if (isEscape) {
        this.toggleModal();
      }
    },

    closeModalEvent(eventData) {
      if (eventData && eventData.emit && eventData.emit.name) {
        this.$parent.$emit(eventData.emit.name, { data: eventData.emit.data || {} });
      }
      if (this.open) {
        this.toggleModal();
      }
    },

    toggleModal() {
      const body = document.querySelector('body');

      this.open = !this.open;
      if (this.open) {
        body.classList.toggle('modal-active');
        this.$parent.$emit('modal-open');
      } else {
        this.$parent.$emit('modal-close');
      }
    },
  },
};
</script>
