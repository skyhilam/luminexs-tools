<template>
  <transition
    enter-active-class="transform transition ease-in-out duration-300"
    leave-active-class="transform transition ease-in-out duration-300"
    enter-class="translate-x-full"
    leave-to-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-class="translate-x-0"
  >
    <div
      class="pointer-events-auto bg-white z-10 max-h-app h-full overflow-y-scroll scrollbar-hide w-full fixed inset-y-0 right-0"
      :class="contentClass"
      v-if="show"
    >
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    contentClass: {
      type: String,
      default: "max-w-screen-sm",
    },
  },
  methods: {
    cancel() {
      this.close()
    },
    close() {
      this.$parent.close();
    }
  },
  computed: {
    show() {
      return this.$parent.show;
    },
  },
};
</script>
