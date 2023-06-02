<template>
  <div class="relative overflow-hidden z-0" :class="size">
    <img class="w-full h-full object-contain z-10" :data-src="src" v-lazy-load/>
    <!-- <div class="absolute inset-0 w-full h-full z-0">
      <img :src="src" class="w-full h-full object-cover" />
      <div class=" backdrop-blur-lg absolute inset-0"></div>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      require: true,
    },
    size: {
      type: String,
      default: "aspect-w-16 aspect-h-9",
    },
  },
};
</script>

<style lang="scss" scoped>
</style>