<template>
  <div class="h-full " :class="bgColor">
    <div class="h-full">
      <Modal
        class="xl:hidden"
        v-if="show"
        ref="modal"
        view="side-left"
        @close="close"
        :color="color"
      >
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex grow flex-col gap-y-5 overflow-y-auto px-2 pb-4" :class="color">
          <div class="flex h-16 shrink-0 items-center">
            <slot name="logo" />
          </div>
          <nav class="flex flex-1 flex-col">
            <slot name="nav" />
          </nav>
        </div>
      </Modal>

      <!-- Static sidebar for desktop -->
      <div class="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4" :class="color">
          <div class="flex h-16 shrink-0 items-center">
            <slot name="logo" />
          </div>
          <nav class="flex flex-1 flex-col">
            <slot name="nav" />
          </nav>
        </div>
      </div>

      <div class="xl:pl-72 h-full overflow-y-scroll scrollbar-hide flex flex-col">
        <div
          class="sticky top-0 z-20 flex-shrink flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 xl:px-8"
        >
          <button
            type="button"
            class="-m-2.5 p-2.5 text-gray-700 xl:hidden"
            @click="open"
          >
            <span class="sr-only">Open sidebar</span>
            <MenuIcon />
          </button>

          <!-- Separator -->
          <div class="h-6 w-px bg-gray-900/10 xl:hidden" aria-hidden="true"></div>

          <div class="flex flex-1 gap-x-4 self-stretch xl:gap-x-6">
            <slot name="header" />
            <template v-if="false">
              <form class="relative flex flex-1">
                <label for="search-field" class="sr-only">Search</label>
                <SearchIcon
                  class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                />
                <input
                  id="search-field"
                  class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </form>
              <div class="flex items-center gap-x-4 xl:gap-x-6">
                <button
                  type="button"
                  class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span class="sr-only">View notifications</span>
                  <BellIcon />
                </button>

                <!-- Separator -->
                <div
                  class="hidden xl:block xl:h-6 xl:w-px xl:bg-gray-900/10"
                  aria-hidden="true"
                ></div>

                <!-- Profile dropdown -->
                <div class="relative" v-if="false">
                  <button
                    type="button"
                    class="-m-1.5 flex items-center p-1.5"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    @click="toggleProfile"
                  >
                    <span class="sr-only">Open user menu</span>
                    <img
                      class="h-8 w-8 rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span class="hidden xl:flex xl:items-center">
                      <span
                        class="ml-4 text-sm font-semibold leading-6 text-gray-900"
                        aria-hidden="true"
                        >Tom Cook</span
                      >
                      <svg
                        class="ml-2 h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>

                  <transition
                    enter-active-class="transition ease-out duration-100"
                    leave-active-class="transition ease-out duration-100"
                    enter-class="transform opacity-0 scale-95"
                    leave-to-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-class="transform opacity-100 scale-100"
                  >
                    <div
                      class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabindex="-1"
                      v-if="show_profile"
                    >
                      <slot name="profile" />
                    </div>
                  </transition>
                </div>
              </div>
            </template>
          </div>
        </div>

        <main class="py-10 flex-grow">
          <div class="px-4 sm:px-6 xl:px-8 h-full">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from "../modal/Modal.vue";
import { MenuIcon, SearchIcon, BellIcon } from "@vue-hero-icons/outline";
export default {
  components: {
    Modal,
    MenuIcon,
    SearchIcon,
    BellIcon,
  },
  props: {
    color: {
      type: String,
      default: "bg-gray-800",
    },

    bgColor: {
      type: String,
      default: 'bg-gray-100'
    },

   
  },
  data() {
    return {
      show: false,
      show_profile: false,
    };
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    closeNav() {
      this.$refs.modal.close();
    },
    openProfile() {
      this.show_profile = true;
    },
    closeProfile() {
      this.show_profile = false;
    },
    toggleProfile() {
      this.show_profile = !this.show_profile;
    },
  },
};
</script>

<style lang="scss" scoped></style>
