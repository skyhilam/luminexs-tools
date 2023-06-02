<template>
  <div class="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <transition
      enter-active-class="ease-out duration-300"
      leave-active-class="ease-out duration-300"
      enter-class="opacity-0"
      leave-to-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      @afterLeave="$emit('close')"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        v-if="show"
        @click="outsideClick"
      ></div>
    </transition>

    <slot :show="show"/>
  </div>
</template>

<script>
export default {
  props: {
    outsideClickable: {
      type: Boolean,
    },
  },
  data() {
    return {
      show: false,
    };
  },

  methods: {
    close() {
      this.show = false;
    },
    outsideClick() {
      if (!this.outsideClickable) return;
      this.close();
    },
  },

  mounted() {
    this.show = true;
  },
};
</script>

<style lang="scss" scoped></style>
