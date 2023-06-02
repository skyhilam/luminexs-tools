<template>
  <div
    :class="containClass"
    aria-labelledby="slide-over-title"
    role="dialog"
    aria-modal="true"
  >
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

    <component :is="view" :contentClass="contentClass" :color="color" @outsideClick="outsideClick">
      <slot />
    </component>
  </div>
</template>

<script>
import Popup from "./views/Popup.vue";
import SideUp from "./views/SideUp.vue";
import SideLeft from "./views/SideLeft.vue";
import SideRight from "./views/SideRight.vue";
export default {
  components: {
    Popup,
    SideUp,
    SideLeft,
    SideRight,
  },
  props: {
    contentClass: String,
    color: String,

    outsideClickable: {
      type: Boolean,
    },

    view: {
      type: String,
      default: "Popup", // Popup, SideUp, SideRight
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

  computed: {
    containClass() {
      if (["Popup", "popup", 'side-left', 'SideLeft'].includes(this.view))
        return "relative z-50 pointer-events-auto";

      return "absolute inset-0 flex flex-col-reverse z-50 pointer-events-auto";
    },
  },

  mounted() {
    this.show = true;
  },
};
</script>

<style lang="scss" scoped></style>
