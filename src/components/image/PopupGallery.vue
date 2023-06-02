<template>
  <popup-view :show="show">
    <button
      type="button"
      class="
        btn
        absolute
        top-1
        right-1
        z-10
        p-1
        rounded-full
        bg-floral-primary
        text-floral-text
      "
      @click="$parent.close()"
    >
      <XIcon />
    </button>
    <SwiperVue :images="images" :autoplay="false" />
  </popup-view>
</template>

<script>
import { XIcon } from "@vue-hero-icons/outline";
import PopupView from "../modal/PopupView.vue";
import SwiperVue from "./Swiper.vue";

export default {
  components: { PopupView, SwiperVue, XIcon },
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  computed: {
    show() {
      return this.$parent.show;
    },
  },
};
</script>

<style lang="css" scoped>
</style>