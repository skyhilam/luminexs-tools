<template>
  <div class="fixed inset-0 z-30" @keydown="keydown" contenteditable="true">
    <div class="absolute bg-black opacity-60 inset-0 z-10"></div>
    <div class="relative max-w-screen-sm m-auto h-full z-20">
      <div class="flex flex-col h-full bg-white divide-y">
        <div class="flex-grow max-app-h w-full overflow-hidden relative">
          <img :src="src" alt="" class="block max-w-full" />
          <button type="button" class="absolute bottom-8 left-8 z-50" @click="contain">
            <ExpandIcon class="h-8" />
          </button>
        </div>
        <div class="flex-none w-full h-14 flex-shrink bg-white mb-safe">
          <div class="flex divide-x flex-row h-full">
            <button class="flex-auto" type="button" @click="submit">確定</button>
            <div></div>
            <button class="flex-auto" type="button" @click="cancel">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExpandIcon from "../icons/ExpandIcon.vue";
import Cropperjs from "cropperjs";
import "cropperjs/dist/cropper.css";
export default {
  components: {
    ExpandIcon,
  },
  props: ["file", "aspectRatio", "maxSize"],

  data() {
    return {
      cropper: null,
      containsize: false,
    };
  },
  methods: {
    init() {
      // document.body.classList.add('on-fixed');
      const image = this.$el.querySelector("img");

      // 獲取圖片實際大小
      const img = new Image();
      img.src = image.src;
      img.onload = () => {
        const ratio = this.getRatio(img.width, img.height);
        this.initCropper(image, ratio);
      };

      
    },

    initCropper(image, ratio) {
      this.cropper = new Cropperjs(image, {
        aspectRatio: ratio,
        autoCropArea: 1,
        viewMode: 1,
        dragMode: "move",
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        ready: () => {
          this.cropper.setCropBoxData({
            left: 0,
            top: 0,
            width: this.cropper.getContainerData().width,
            height: this.cropper.getContainerData().height,
          });
        },
      });
    },

    submit() {
      this.cropper
        .getCroppedCanvas({
          maxWidth: this.maxSize,
          maxHeight: this.maxSize,
          fillColor: "#fff",
          // imageSmoothingEnabled: true,
          // imageSmoothingQuality: "high",
        })
        .toBlob(
          (blob) => {
            this.$emit(
              "submit",
              new File([blob], this.file.name.replace(/(png|webp|jpg)/, "jpeg"))
            );
          },
          "image/jpeg",
          1
        );
    },
    cancel() {
      this.cropper.destroy();
      this.$emit("cancel");
    },
    contain() {
      this.containsize = !this.containsize;
      if (this.containsize) {
        this.replaceImageToContain();
      } else {
        this.reset();
      }
    },
    // 展開全圖片
    replaceImageToContain() {
      const cropper = this.cropper;
      const imageData = cropper.getImageData();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const cropboxData = cropper.getCropBoxData();
      const { aspectRatio, naturalWidth, naturalHeight } = imageData;
      // const size = this.maxSize ?? 1080;
      const r = this.getRatio(naturalWidth, naturalHeight); // 匯出的比例
      //r = w/h
      var x = 0,
        y = 0,
        w = naturalWidth, // 原圖寬
        h = naturalHeight, // 原圖高
        cw = Math.max(w, h), 
        ch = cw;

      // r > 1是長方形圖
      if (r > 1) {
        ch = this.getHeight(cw, r, true);
      }

      // r < 1是長條形圖
      if (r < 1) {
        cw = this.getWidth(ch, r, true);
      }

      // 當原圖是長方形圖
      if (aspectRatio > 1) {
        w = Math.min(w, cw);
        h = this.getHeight(w, aspectRatio);

        // 當縮小後還大過相框
        if (h > ch) {
          h = ch;
          w = this.getWidth(h, aspectRatio);
        }
      }
      // 當原圖是長條形圖
      if (aspectRatio < 1) {
        h = Math.min(h, ch);
        w = this.getWidth(h, aspectRatio);

        // 當縮小後還大過相框
        if (w > cw) {
          w = cw;
          h = this.getHeight(w, aspectRatio);
        }
      }

      // 當原圖是正方形圖
      if (aspectRatio == 1) {
        w = Math.min(w, cw, h, ch);
        h = w;
      }

      y = Math.floor((ch - h) / 2);
      x = Math.floor((cw - w) / 2);

      // 圖框大小
      canvas.width = cw;
      canvas.height = ch;

      // 填白
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, cw, ch);

      // 填圖片
      ctx.drawImage(cropper.clear().getCroppedCanvas(), x, y, w, h);

      cropper.replace(canvas.toDataURL());
      cropper.setCropBoxData(cropboxData);
    },
    reset() {
      this.cropper.destroy();
      this.init();
    },

    getHeight(w, r, ceil = false) {
      if (ceil) return Math.ceil(w / r);
      return Math.floor(w / r);
    },
    getWidth(h, r, ceil = false) {
      if (ceil) return Math.ceil(h * r);
      return Math.floor(h * r);
    },
    keydown(e) {
      const keyCode = e.keyCode || e.which;
      if (keyCode === 13) {
        this.submit();
      }

      if (keyCode === 27) {
        this.cancel();
      }
    },

    // 計算比例
    getRatio(width, height) {
      if (this.aspectRatio == 'auto') {
        return Math.floor(width / height);
      }
      return this.aspectRatio;
    },
  },
  computed: {
    src() {
      return URL.createObjectURL(this.file);
    },
    
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped></style>
