<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-none justify-between items-center">
      <h1 class="flex-none font-bold text-xl table-fixed">{{ title }}管理</h1>
      <button class="btn" @click="createNew">新增{{ title }}</button>
    </div>
    <div class="flex-grow w-full p-4 bg-white relative mt-4 rounded-lg">
      <vTable :records="records" :processing="fetching" :cols="cols">
        <template #thead>
          <slot name="head" />
        </template>

        <template v-slot:default="{ record }">
          <slot :record="record" :edit="edit" :destroy="destroy" />
        </template>
      </vTable>

      <deleteDialog
        v-if="dialogFlag"
        :info="confirmInfo"
        :deleteId="deleteId"
        @getDeleteInfo="getDeleteInfo"
      />
    </div>

    <pagination :meta="meta" @pageChange="fetch" class="mt-4" />
  </div>
</template>

<script>
import deleteDialog from "@/components/dialog/deleteDialog.vue";

export default {
  components: { deleteDialog },
  props: {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    cols: {
      type: Number,
      default: 8,
    },
    confirmInfo: {
      type: String,
      default: "是否確定要刪除？",
    },
    name: {
      type: String,
      required: true,
    },

    subname: {
      type: String,
      default: "id",
    },

    params: {
      type: [String, Array],
      required: false,
      default: "id",
    },

    add: {
      type: Function,
      default() {
        this.$router.push({
          name: `${this.name}-${this.subname}`,
          params: this.getParams({
            [this.subname]: "new",
          }),
        });
      },
    },
  },
  data() {
    return {
      records: [],
      meta: {},
      fetching: false,
      deleting: false,
      dialogFlag: false,
      deleteId: "",
    };
  },
  methods: {
    async fetch(page) {
      if (this.fetching) return;
      try {
        this.fetching = true;
        let { data } = await this.$axios.get(this.url, {
          params: {
            page: page,
          },
        });
        this.records = data.data;
        this.meta = data.meta;
        this.fetching = false;
      } catch (e) {
        console.error(e);
        this.$loader.error("獲取資料出錯了");
      }
    },


    getParams(_params = {}) {
      let params = {};
      if (Array.isArray(this.params)) {
        this.params.forEach((param) => {
          params[param] = this.$route.params[param];
        });
      } else {
        params[this.params] = this.$route.params[this.params];
      }
      Object.assign(params, _params);
      return params;
    },

    createNew() {
      this.add();
    },

    edit(item) {
      this.$router.push({
        name: `${this.name}-${this.subname}`,
        params: {
          [this.subname]: item.id,
        },
      });
    },

    destroy(item) {
      this.dialogFlag = true;
      this.deleteId = item.id;
    },

    async getDeleteInfo(value) {
      if (this.deleting) return;
      try {
        this.deleting = true;
        if (value.status === "affirm") {
          await this.$axios.delete(`${this.url}/${value.deleteId}`);
          this.$loader.success("刪除" + this.title + "成功");
          this.fetch(this.meta.current_page);
        }
      } catch (e) {
        console.error(e);
        this.$loader.error("刪除" + this.title + "失敗");
      } finally {
        this.dialogFlag = false;
        this.deleting = false;
      }
    },
  },
  mounted() {
    this.fetch(1);
  },
};
</script>

<style lang="scss" scoped></style>
