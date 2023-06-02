<template>
  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <transition
        enter-active-class="ease-out duration-300"
        leave-active-class="ease-out duration-200"
        enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-class="opacity-100 translate-y-0 sm:scale-100"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-sm sm:p-6"
          v-if="show"
        >
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    show() {
      return this.$parent.show;
    },
  },
};
</script>

<style lang="scss" scoped></style>
