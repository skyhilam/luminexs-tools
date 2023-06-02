<template>
  <div :class="defaultClass">
    <!-- Infinite  Scroll -->
    <slot name="head" />

    <template v-if="!processing">
      <div v-for="record in records" :key="record.id">
        <slot :record="record" />
      </div>

      <div v-if="!records.length" class="px-2 md:py-5 py-4">
        <p class="text-center text-gray-500 text-sm">沒有資料...</p>
      </div>
    </template>
    <div v-if="processing || moring" class="px-2 md:py-5 py-4">
      <p><Loading class="w-14 mx-auto text-primary" /></p>
    </div>

  </div>
</template>

<script>
import Loading from "../icons/Loading.vue";
export default {
  components: {
    Loading,
  },
  props: {
    // 資料
    records: {
      type: Array,
      required: true,
    },


    defaultClass: {
      type: String,
      default: "divide-y",
    },

    // 處理獲取資料
    processing: {
      type: Boolean,
      default: () => false,
    },

    // 處理獲取更多資料
    moring: {
      type: Boolean,
      default: () => false,
    },

    // 可以無限滾動
    morable: {
      type: Boolean,
      default: () => false,
    },
  },

  data() {
    return {
      selectors: ["#__body", "#__layout > div"],
    };
  },

  methods: {
    loadMore(el) {
      const { scrollTop, clientHeight, scrollHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 100) this.$emit("loadMore");
    },
    listenOnScroll(selectors) {
      const el = document.querySelector(selectors);

      if (el)
        el.addEventListener("scroll", () =>
          this.loadMore(document.querySelector(selectors))
        );
    },
    removeListen(selectors) {
      const el = document.querySelector(selectors);
      if (el)
        el.removeEventListener("scroll", () =>
          this.loadMore(document.querySelector(selectors))
        );
    },
  },
  mounted() {
    if (this.morable)
      this.selectors.forEach((selector) => {
        this.listenOnScroll(selector);
      });
  },
  beforeDestroy() {
    if (this.morable)
      this.selectors.forEach((selector) => {
        this.removeListen(selector);
      });
  },
};
</script>

<style lang="scss" scoped></style>
