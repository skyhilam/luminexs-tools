<template>
  <div
    :class="size"
    class="border-2 border-dashed border-gray-300 rounded-md overflow-hidden relative"
  >
    <div class="w-full h-full" v-show="!hidden && !preview">
      <button
        class="flex justify-center w-full h-full items-center"
        type="button"
        @click="open"
      >
        <PlaceholderVue class="space-y-1 text-center" />
      </button>
      <input
        type="file"
        :accept="accept"
        @change="selected"
        :disabled="disabled"
        class="hidden"
      />
    </div>

    <!-- 圖片預覽 -->
    <template v-if="preview">
      <div :class="imageClass" class="select-none">
        <img
          :src="preview"
          class="absolute left-0 top-0 w-full h-full m-auto object-contain"
        />
        <button
          type="button"
          class="absolute top-0 right-0 p-1 z-10 bg-white rounded-bl-md"
          @click="destroy"
          title="刪除"
          v-if="!disabled && destroyable"
        >
          <XIcon class="h-5 w-5 text-red-500" />
        </button>

        <button
          type="button"
          class="absolute bottom-0 right-0 p-1 z-10 bg-white rounded-tl-md"
          @click="sort"
          title="置頂"
          v-if="!disabled && sortable"
        >
          <SortAscendingIcon class="h-5 w-5 text-red-500" />
        </button>

        <button
          type="button"
          class="absolute inset-0 z-0"
          v-if="clickable"
          @click="open"
        ></button>
      </div>
    </template>

    <vCropper
      :aspectRatio="aspectRatio"
      v-if="file && cropperable"
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
import { XIcon, SortAscendingIcon } from "@vue-hero-icons/outline";
import PlaceholderVue from "./ImgPlaceholder.vue";

export default {
  components: {
    vCropper,
    XIcon,
    SortAscendingIcon,
    PlaceholderVue,
  },
  props: {
    accept: {
      type: String,
      default: "image/png, image/jpg, image/jpeg, image/webp",
    },
    size: {
      type: String,
      default: "sm:w-28 sm:h-28 w-14 h-14 aspect-1 relative",
    },
    aspectRatio: {
      type: [Number, String],
      default: 1 / 1,
    },
    disabled: {
      type: Boolean,
    },
    hidden: Boolean,
    sortable: Boolean,

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
    url: {
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
      default: () => 1080 * 2,
    },

    cropperable: {
      type: Boolean,
      default: () => true,
    },

    order: Number,
  },
  data() {
    return {
      file: null,
      preview: this.src || this.url,
      delay: false,
      uploader: null,
    };
  },
  methods: {
    // 打開檔案選擇器
    async open() {
      if (this.inapp) {
        const bytes = await window.flutter_inappwebview.callHandler("filepicker", {});
        if (!bytes) return;
        this.file = new File(
          [new Blob([new Uint8Array(bytes)], { type: "image/jpeg" })],
          "newimage.jpeg"
        );
        return;
      }
      // 避免連點，造成兩次選擇檔案。
      if (this.delay) return;
      this.delay = true;

      this.uploader.click();
      document.activeElement.blur()

      // 500ms後才能再次點擊
      setTimeout(() => {
        this.delay = false;
      }, 500);
    },
    
    // 選擇檔案
    selected(e) {
      const file = first(e.target.files);
      if (!file) return;
      this.file = file;
      if (!this.cropperable) this.submit(file);
    },

    // 清除檔案、預覽及資料
    clear() {
      this.uploader.value = "";
      this.$emit("input", null);
      this.$emit("change", null);
      this.file = null;
    },

    // 銷毀
    destroy() {
      this.preview = null;
      this.clear();
      this.$emit("destroy");
    },

    // 取消
    cancel() {
      if (this.preview) this.file = null;
      else this.clear();
    },

    // 提交
    submit(file) {
      if (this.disabled) return;
      this.$emit("input", file);
      this.$emit("change", file);
      this.preview = URL.createObjectURL(file);
      this.cancel();
    },
    
    // 置頂
    sort() {
      this.$emit("sort");
    },
  },
  mounted() {
    this.uploader = this.$el.querySelector("input[type=file]");
  },
};
</script>

<style lang="scss" scoped></style>
