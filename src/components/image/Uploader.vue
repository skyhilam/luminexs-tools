<template>
  <div>
    <button
      type="button"
      :class="btnClass"
      @click="open"
      v-show="!hidden && !preview"
    >
      {{ text }}
    </button>

    <input
      type="file"
      accept="image/png, image/jpg, image/jpeg, image/webp"
      @change="selected"
      :disabled="disabled"
      class="hidden"
    />
    <div v-if="preview" class="md:max-w-sm mb-6 relative" :class="imageClass">
      <div class="aspect-1 bg-e8"></div>
      <img
        :src="preview"
        class="absolute left-0 top-0 w-full h-full m-auto object-contain"
      />
      <button
        type="button"
        class="absolute top-0 right-0 m-1 z-20"
        @click="destroy"
        v-if="!disabled && destroyable"
      >
        <XIcon class="h-6 w-6 text-red-500" />
      </button>

      <button
        type="button"
        class="absolute inset-0 z-10"
        v-if="clickable"
        @click="open"
      ></button>
    </div>

    <vCropper
      :aspectRatio="aspectRatio"
      v-if="file"
      :file="file"
      @cancel="cancel"
      @submit="submit"
      :maxSize="maxSize"
    />
  </div>
</template>

<script>
import { first } from "lodash";
import vCropper from "./ImageCropper.vue";
import { XIcon } from "@vue-hero-icons/outline";

export default {
  components: {
    vCropper,
    XIcon,
  },
  props: {
    aspectRatio: {
      type: Number,
      default: 1 / 1,
    },
    disabled: {
      type: Boolean,
    },
    hidden: Boolean,

    text: {
      type: String,
      default: "圖片",
    },
    btnClass: {
      type: String,
      default: "small btn",
    },
    src: {
      type: String,
      default: null,
    },
    imageClass: String,

    clickable: {
      type: Boolean,
      default: () => false,
    },

    destroyable: {
      type: Boolean,
      default: () => true,
    },

    maxSize: {
      type: Number,
      default: () => 1080,
    },
  },
  data() {
    return {
      file: null,
      preview: this.src,
      delay: false,
      uploader: null,
    };
  },
  methods: {
    async open() {
      if (this.inapp) {
        const bytes = await window.flutter_inappwebview.callHandler(
          "filepicker",
          {}
        );
        if (!bytes) return;
        this.file = new File(
          [new Blob([new Uint8Array(bytes)], { type: "image/jpeg" })],
          "newimage.jpeg"
        );
        return;
      }
      if (this.delay) return;
      this.delay = true;
      this.uploader.click();
      setTimeout(() => {
        this.delay = false;
      }, 500);
    },

    selected(e) {
      const file = first(e.target.files);
      if (!file) return;
      this.file = file;
    },
    clear() {
      this.uploader.value = "";
      this.$emit("input", null);
      this.file = null;
    },
    destroy() {
      this.preview = null;
      this.clear();
      this.$emit("destroy");
    },
    cancel() {
      if (this.preview) this.file = null;
      else this.clear();
    },
    submit(file) {
      if (this.disabled) return;
      this.$emit("input", file);
      this.$emit("change", file);
      this.preview = URL.createObjectURL(file);
      this.cancel();
    },
  },
  mounted() {
    this.uploader = this.$el.querySelector("input[type=file]");
  },
};
</script>

<style lang="scss" scoped>
</style>