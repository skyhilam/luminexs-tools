<template>
  <transition
    enter-active-class="transition ease-in-out duration-300 transform"
    leave-active-class="transition ease-in-out duration-300 transform"
    enter-class="translate-y-full"
    leave-to-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-class="translate-y-0"
  >
    <div class="z-10 max-app-h" v-if="show">
      <div
        class="mx-auto relative max-h-full min-h-fit overflow-y-scroll scrollbar-hide"
        :class="contentClass"
      >
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    contentClass: {
      type: String,
      default: "max-w-screen-sm bg-white rounded-t-lg",
    },
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
