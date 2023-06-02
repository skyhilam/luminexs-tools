<template>
  <div class="fixed inset-0 flex">
    <transition
      enter-active-class="transition ease-in-out duration-300 transform"
      leave-active-class="transition ease-in-out duration-300 transform"
      enter-class="-translate-x-full"
      leave-to-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-class="translate-x-0"
    >
      <div class="relative mr-16 flex w-full max-w-xs flex-1" v-if="show">
        <transition
          enter-active-class="ease-in-out duration-300"
          leave-active-class="ease-in-out duration-300"
          enter-class="opacity-0"
          leave-to-class="opacity-0"
          enter-to-class="opacity-100"
          leave-class="opacity-100"
        >
          <!-- Close button -->
          <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button type="button" class="-m-2.5 p-2.5" @click="cancel">
              <span class="sr-only">Close sidebar</span>
              <XIcon class="h-6 w-6 text-white" />
            </button>
          </div>
        </transition>

        <!-- Sidebar component -->
        <div class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4" :class="color">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { XIcon } from "@vue-hero-icons/outline";
export default {
  components: {
    XIcon,
  },
  props: {
    color: String,
  },
  methods: {
    cancel() {
      this.close();
    },
    close() {
      this.$parent.close();
    },
  },
  computed: {
    show() {
      return this.$parent.show;
    },
  },
};
</script>
