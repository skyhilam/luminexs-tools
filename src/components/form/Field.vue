<template>
  <div >
    <slot></slot>
    <span class="text-xs text-red-600 italic" v-if="error">{{ error[0] }}</span>
  </div>
</template>


<script>
export default {
  props: {
    error: [Object, Array, String],
  },
  watch: {
    error(val) {
      const field = $(this.$el).find("input, select, textarea");
      if (val) {
        field.addClass("border-red-600");
      } else {
        field.removeClass("border-red-600");
      }
    },
  },
};
</script>
