<template>
  <div
    class="whitespace-pre-wrap tracking-wide text-sm"
    v-html="html"
    ref="msg"
  />
</template>

<script>
import {each} from 'lodash'
export default {
  props: {
    text: {
      type: String,
    },
  },
  computed: {
    html() {
      return this.toLink(this.text);
    },
  },
  mounted() {
    each(this.$refs.msg.children, child => {
      child.onclick = e => {
        e.preventDefault();
        this._goSocial(e.target.href);
      }
    })
  },
};
</script>

<style lang="scss" scoped>
</style>