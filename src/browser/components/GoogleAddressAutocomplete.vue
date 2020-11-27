<template>
  <section class="text-gray-700 body-font relative">
    <div class="container px-5 mx-auto">
      <div class="flex flex-col text-center w-full mb-12">
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
          Search your address
        </h1>
        <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
          Search for an address by typing in the input below.
        </p>
      </div>
      <div class="w-full">
        <div class="flex flex-wrap -m-2 justify-center">
          <div class="p-2 w-3/4">
            <!--Addresss search-->
            <div class="relative">
              <label for="address" class="leading-7 text-sm text-gray-600">
                Search
              </label>
              <input
                  ref="autocompleteInput"
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Type address here"
                  v-model="inputValue"
                  v-on:focus="focusAutocompleteInput"
                  v-on:click="focusAutocompleteInput"
                  class="w-full bg-gray-100 rounded border border-gray-300
                   focus:border-indigo-500 text-base outline-none text-gray-700
                    py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              >
            </div>
            <!--Address search result-->
            <div
                v-show="saveEnabled"
                class="px-6"
            >
              <address-label :address="address"></address-label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GoogleAddressAutocomplete',
}
</script>
