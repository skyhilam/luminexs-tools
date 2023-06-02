<template>
  <button type="button" class="flex items-center" @click="copy">
    <span class="flex-grow">{{ text }}</span>
    <span class="flex-shrink">
      <ClipboardIcon v-if="!copied" class="w-4 h-4 ml-2" />
      <ClipboardCheckIcon v-if="copied" class="w-4 h-4 ml-2" />
    </span>
  </button>
</template>

<script>
import { ClipboardIcon, ClipboardCheckIcon } from "@vue-hero-icons/outline";
export default {
  components: {
    ClipboardIcon,
    ClipboardCheckIcon,
  },
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      copied: false,
    };
  },
  methods: {
    async copy() {
      if (this.copied) return;

      await navigator.clipboard.writeText(this.text);
      this.$emit('copied');
      this.success();
    },

    success() {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped></style>
