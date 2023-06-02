<template>
  <div class="reader">
    <div v-html="html" />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      html: "",
    };
  },
  
  methods: {
    toHTML() {
      return SimpleMDE.prototype.markdown(this.text??'');
    }
  },

  watch: {
    text() {
      this.html = this.toHTML();
    }
  },

  mounted () {
    this.html = this.toHTML();
  },
};
</script>

<style lang="css" scoped></style>
