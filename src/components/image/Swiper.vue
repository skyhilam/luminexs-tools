<template>
  <div class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(banner, index) in banners" :key="index">
        <div :class="getClass()">
          <slot v-bind:record="banner" v-if="image" />
          <template v-if="!image">
            <button type="button" @click="onClick(banner.url)" v-if="banner.img && banner.url" class="w-full block">
              <img v-lazy-load :data-src="banner.img" :class="imageClass" />
            </button>
            <img v-else v-lazy-load :data-src="getSrc(banner)" :class="imageClass" />
          </template>
        </div>
      </div>
    </div>
    <div class="swiper-pagination" v-if="pagination"></div>
  </div>
</template>

<script>
// { rel: 'stylesheet', href: 'https://unpkg.com/swiper@7/swiper-bundle.min.css' },
// { type: 'text/javascript', src: '//unpkg.com/swiper@7/swiper-bundle.min.js' },
export default {
  props: {
    banners: {
      type: Array,
    },
    image: Boolean,
    autoplay: {
      type: Boolean,
      default: true,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    swiperClass: {
      type: String,
      default: "rounded-lg w-full overflow-hidden",
    },
    imageClass: {
      type: String,
      default: "w-full h-full object-contain",
    },
    size: {
      type: String,
      default: "aspect-w-13 aspect-h-5",
    },
    onClick: {
      type: Function,
      default(data) {
        this._goSocial(data);
      },
    },
  },
  methods: {
    getSrc(data) {
      return typeof data == "string" ? data : data.img;
    },
    getClass() {
      return `${this.swiperClass} ${this.size}`;
    }
  },
  mounted() {
    new Swiper(this.$el, {
      autoplay: this.autoplay,
      loop: this.loop,
      pagination: {
        el: ".swiper-pagination",
        bulletActiveClass:
          "swiper-pagination-bullet-active bg-primary border-primary border bg-white",
      },
    });
  },
};
</script>

<style lang="scss" scoped></style>
