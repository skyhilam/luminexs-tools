<template>
  <div>
    <button type="button" @click="show = true">
      <InformationCircleIcon class="w-4 h-4" />
    </button>
    <DialogVue @close="show = false" :outside-clickable="true" v-if="show">
      <PopupViewVue :show="show">
        <div v-text="tip" class="whitespace-pre-wrap text-center"></div>
      </PopupViewVue>
    </DialogVue>
  </div>
</template>

<script>
import PopupViewVue from "../modal/PopupView.vue";
import DialogVue from "../modal/Dialog.vue";
import { InformationCircleIcon } from "@vue-hero-icons/outline";
export default {
  components: {
    InformationCircleIcon,
    PopupViewVue,
    DialogVue,
  },
  props: {
    tip: {
      type: String,
    },
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>