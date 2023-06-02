<template>
  <div class="fixed inset-0 z-10 overflow-y-auto" @click="$emit('outsideClick')">
    <div class="flex min-h-full items-center justify-center p-0 text-center">
      <transition
        enter-active-class="ease-out duration-300"
        leave-active-class="ease-out duration-200"
        enter-class="opacity-0 translate-y-4 translate-y-0 scale-95"
        leave-to-class="opacity-0 translate-y-4 translate-y-0 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-class="opacity-100 translate-y-0 scale-100"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all"
          @click="$event.stopPropagation()"
          :class="contentClass"
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
  props: {
    contentClass: {
      type: String,
      default: "my-8 w-full max-w-screen-sm p-6",
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

<style lang="scss" scoped></style>
