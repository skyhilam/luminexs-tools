<template>
  <div class="text-sm flex justify-between items-center" >
    <label :for="id">{{ label }} </label>
    <span v-if="sublabel">{{ sublabel }}</span>
    <TooltipVue v-if="tip" :tip="tip" />
  </div>
</template>

<script>
import TooltipVue from "./Tooltip.vue";
export default {
  components: {
    TooltipVue,
  },
  props: {
    id: [Number, String],
    label: String,
    sublabel: String,
    tip: String,
  },
};
</script>

<style lang="scss" scoped>
</style>