<template>
  <button type="button" @click="share">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    sharedata: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async share() {
      if (this.inapp) {
        try {
          await window.flutter_inappwebview.callHandler(
            "share",
            this.sharedata
          );

          return;
        } catch (e) {}
      }

      // 如果不支援 navigator.share or desktop mode
      if (!navigator.canShare) {
        // copy url to clipboard
        await navigator.clipboard(this.sharedata.url);
        this.$loader.success(`已複製連結，貼上至你的朋友的聊天室`);
        return;
      }

      

      navigator.share(this.sharedata);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>