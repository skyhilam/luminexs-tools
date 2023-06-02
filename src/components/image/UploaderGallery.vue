<template>
  <div>
    <div class="flex flex-wrap gap-x-4">
      <v-field v-for="(img, index) in gallery" :key="img.uuid">
        <UploaderWithImageVue
          size="h-28 w-28 aspect-1"
          :src="img.url"
          :order="index"
          @input="handleImage(img, $event)"
          @sort="sortImage(img)"
          :aspectRatio="aspectRatio"
          :clickable="true"
          :sortable="true"
          :disabled="disabled"
        />
      </v-field>
    </div>
  </div>
</template>

<script>
import vField from "../form/Field.vue";
import UploaderWithImageVue from "./UploaderWithImage.vue";

export default {
  components: {
    vField,
    UploaderWithImageVue,
  },
  props: {
    type: {
      type: String,
      default: "update",
    },
    // 當type 為 update 時，必須傳入 images
    images: {
      type: Array,
      default: () => [],
    },
    url: {
      type: String,
      // required: true,
    },
    max: {
      type: Number,
      default: 5,
    },
    aspectRatio: {
      type: [Number, String],
      default: 1 / 1,
    },
    disabled: Boolean,
  },

  data() {
    return {
      // 圖片的唯一值
      uuid: 0,

      // 新增圖片的索引
      createIndex: 1,

      // 格式化圖片
      gallery: [],
    };
  },

  methods: {
    // 初始化圖片
    initGallery() {
      return this.images.map((img) => ({
        id: img.id,
        url: img.url,
        file: null,
        uuid: this.uuid++,
      }));
    },

    // 處理請求
    async handleRequest(action, formdata) {
      try {
        this.$loader.load();
        const { data } = await this.$axios.post(
          this.url,
          objectToFormData({ action, ...formdata })
        );
        this.$loader.success();
        this.$emit("update");
        return data;
      } catch (e) {
        console.error(e);
        this.$loader.error();
      }
    },

    // 更改圖片順序
    async sortImage(img) {
      const images = this.gallery.filter((i) => i.id && i.id != img.id);

      this.gallery = [img, ...images];
      if (this.type === "create") {
        this.add();
        this.update();
        return;
      }

      await this.handleRequest("image.order", {
        order: this.gallery.map((i) => i.id),
      });
      this.add();
    },

    /**
     * 處理圖片
     *
     * @param {Object} img 圖片物件
     * @param {File|undefined} file 圖片檔案
     * @return {void}
     * **/
    async handleImage(img, file) {
      // 如果是新增圖片
      if (this.type === "create") {
        // 如果file 是 undefined，則刪除圖片
        if (!file) {
          this.delete(img);
        }

        // 如果file 存在，則新增圖片
        if (file) {
          img.id = this.createIndex++;
          img.file = file;
        }
        this.update();
      } else {
        if (!file && !img.id) return;

        // 如果是更新圖片
        const { data } = await this.handleRequest("image", {
          media: img.id,
          image: file,
        });

        // 如果file 是 undefined 和 存在img.url，則刪除圖片
        if (!file && img.url) {
          this.delete(img);
        }

        // 如果file 存在，則更新圖片
        if (file) {
          img.url = data.url;
          img.file = file;
          img.id = data.id;
        }
      }

      this.add();
    },

    update() {
      const images = this.gallery.filter((img) => img.id);
      this.$emit("input", images);
      this.$emit("change", images);
    },

    // 添加圖片欄位
    add() {
      // 如果圖片數量大於等於最大值，則不新增欄位
      if (this.gallery.length >= this.max) return;

      // 獲取最尾端的圖片
      const last_image = this.gallery[this.gallery.length - 1];

      // 如果最後一個圖片有索引，則新增欄位
      if (last_image && !last_image.id) return;

      this.gallery.push({ uuid: this.uuid++, id: null, url: "", file: null });
    },

    // 刪除圖片
    delete(img) {
      const index = this.gallery.findIndex((item) => item.uuid === img.uuid);
      this.gallery.splice(index, 1);
      this.add();
    },
  },

  mounted() {
    this.gallery = this.initGallery();
    this.add();
    this.update();
  },
};
</script>

<style lang="scss" scoped></style>
