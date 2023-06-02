<template>
  <div class="w-full overflow-x-scroll scrollbar-hide">
    <table class="min-w-max w-full text-sm">
      <thead>
        <slot name="thead" />
      </thead>
      <tbody class="divide-y">
        <template v-if="!processing">
          <template v-for="record in records">
            <slot :record="record" />
          </template>

          <tr v-if="!records.length">
            <td :colspan="cols" class="px-2 py-5 text-center">沒有資料...</td>
          </tr>
        </template>

        <tr v-if="processing">
          <td :colspan="cols" class="px-2 py-5 text-center">
            <loading class="h-14 mx-auto text-primary"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Loading from "../icons/Loading.vue";
export default {
  components: {
    Loading,
  },
  props: {
    records: {
      type: Array,
      require: true,
    },
    processing: Boolean,
    cols: {
      type: Number,
      default: 99,
    },
  },
};
</script>

