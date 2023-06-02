<template>
  <div class="w-full max-w-screen-sm mx-auto">
    <div v-if="id && fetching" class="py-10">
      <Loading class="w-20 text-primary mx-auto" />
    </div>
    <form @submit.prevent="submit" v-else>
      <h1 class="font-bold text-xl mb-4 text-center">{{ pageTitle }}</h1>

      <slot :form="form" :submitting="submitting" :id="id" />

      <div class="w-full flex justify-center space-x-4 mt-2">
        <button type="submit" class="btn">提交</button>
        <button type="button" class="btn" @click="goBack">返回</button>
      </div>
    </form>
  </div>
</template>

<script>
import Loading from "../icons/Loading.vue";
export default {
  components: {
    Loading,
  },
  props: {
    // 以下為必填參數
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    // 以下為可選參數
    initform: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },

    params: {
      type: [String, Array],
      required: false,
      default: "id",
    },

    id: {
      type: [String, Number],
      required: false,
      default() {
        const params = this.$route.params;
        const id = params[this.params];
        return id == "new" ? "" : id;
      },
    },

    store: {
      type: Function,
      required: false,
      default(formdata) {
        return this.$axios.post(this.url, formdata);
      },
    },
    update: {
      type: Function,
      required: false,
      default(formdata) {
        return this.$axios.patch(`${this.url}/${this.id}`, formdata);
      },
    },
    formatData: {
      type: Function,
      required: false,
      default(data) {
        this.form = data.data;
      },
    },
  },
  data() {
    return {
      form: this.initform,
      submitting: false,
      fetching: false,
    };
  },
  methods: {
    async submit() {
      if (this.submitting) return;
      try {
        this.submitting = true;
        if (!this.id) await this.store(this.form);
        else await this.update(this.form);
        this.$loader.success(this.title + "成功");
        this.goBack();
      } catch (e) {
        console.log(e);
        this.$loader.error(this.title + "失敗");
      } finally {
        this.submitting = false;
      }
    },

    async fetch() {
      if (this.fetching) return;
      try {
        this.fetching = true;
        const { data } = await this.$axios.get(`${this.url}/${this.id}`);
        this.formatData(data);
        this.fetching = false;
      } catch (e) {
        console.log(e);
        this.$loader.error("獲取數據失敗");
        this.goBack();
      }
    },

    goBack() {
      this.$router.back();
    },
  },
  computed: {
    pageTitle() {
      return this.id ? "更新" + this.title : "新增" + this.title;
    },
  },

  mounted() {
    if (this.id) this.fetch();
  },
};
</script>

<style lang="scss" scoped></style>
