<template>
  <textarea
    @keydown="keydown"
    @input="typing"
    :value="value"
    @focus="onFocus"
  />
</template>

<script>
export default {
  props: ["value"],
  methods: {
    typing(e) {
      this.$emit("input", e.target.value);
    },
    keydown(e) {
      const keyCode = e.keyCode || e.which;

      if (keyCode === 9) {
        e.preventDefault();

        const TAB_SIZE = 2;
        e.target.value += "　".replace(TAB_SIZE);
        // The one-liner that does the magic
        // document.execCommand("insertText", false, " ".repeat(TAB_SIZE));
      }
    },
    focus() {
      this.$el.focus();
    
      // 重新計算textarea的高度
      autosize.update(this.$el);
    },
    resize() {
      autosize(this.$el);
    },
    onFocus(e) {
      this.resize();
    },
  },
  mounted() {
    setTimeout(() => {
      this.resize();
    }, 100)
  },
};
</script>
