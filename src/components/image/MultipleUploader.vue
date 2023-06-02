<template>
  <div class="sm:flex sm:flex-wrap grid grid-cols-3 -mx-2">
    <div v-for="(img, index) in images" :key="img.uuid" class="mx-2">
      <v-field :error="errors[`${field}.${index}`]">
        <Uploader
          :btn-class="btnClass"
          :image-class="imageClass"
          :text="text"
          :size="size"
          @input="selected($event, img.uuid)"
          @destroy="removeImage(index)"
          :disabled="disabled"
          :aspectRatio="aspectRatio"
        />
      </v-field>
    </div>
  </div>
</template>

<script>
import Uploader from "./UploaderWithImage";
import { v4 as uuidv4 } from "uuid";
import { findIndex, map, filter } from "lodash";
export default {
  components: {
    Uploader,
  },
  props: {
    disabled: Boolean,
    btnClass: String,
    imageClass: String,
    text: String,
    size: {
      type: String,
      default: 'sm:h-28 sm:w-28 w-full h-full aspect-1'
    },
    max: {
      type: Number,
      default: 5
    },
    aspectRatio: Number,
    field: {
      type: String,
      default: "photos",
    },
  },
  data() {
    return {
      images: [],
      isfull: false,
    };
  },
  methods: {
    selected(file, uuid) {
      const index = findIndex(this.images, { uuid });
      const count = this.images.length;

      this.images[index]["file"] = file;

      if (!file) return;

      // 添加圖片
      if (count < this.max && file && count == index + 1)
        return this.addImage();

      this.isfull = true;
      // this.images.push(file)
    },
    addImage() {
      this.images.push({
        uuid: uuidv4(),
        file: "",
      });
    },
    removeImage(index) {
      this.images.splice(index, 1);
      if (this.isfull) {
        this.addImage();
        this.isfull = false;
      }
    },
  },
  computed: {
    formdata() {
      const data = filter(this.images, (i) => {
        if (i.file) return true;
      });
      return map(data, (i) => {
        return i.file;
      });
    },
  },
  mounted() {
    this.addImage();
  },
};
</script>

<style lang="scss" scoped>
</style>