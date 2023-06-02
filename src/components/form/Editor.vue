<template>
  <div class="rounded-md">
    <textarea class="hidden" />
  </div>
</template>

<script>
/**
 * first add link and script to nuxt.config.js
 *
 * //cdn.jsdelivr.net/simplemde/latest/simplemde.min.css
 * //cdn.jsdelivr.net/simplemde/latest/simplemde.min.js
 *
 * https://github.com/sparksuite/simplemde-markdown-editor#toolbar-icons
 *
 * **/
import SimpleMDE from "simplemde";
export default {
  props: {
    placeholder: String,
    value: String,
    disabled: Boolean
  },
  data() {
    return {
      mde: null,
      focusClass: ["ring-2", "ring-blue-600", "outline-2", "outline-transparent"],
    };
  },
  methods: {
    init() {
      this.mde = new SimpleMDE({
        element: this.$el.querySelector("textarea"),
        lineWrapping: false,
        parsingConfig: {
          allowAtxHeaderWithoutSpace: true,
          strikethrough: false,
          underscoresBreakWords: true,
        },
        placeholder: this.placeholder,
        initialValue: this.value,
        insertTexts: {
          horizontalRule: ["", "\n\n-----\n\n"],
          image: ["![](http://", ")"],
          link: ["[", "](http://)"],
          table: [
            "",
            "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n",
          ],
        },
        showIcons: ["table"],
        hideIcons: ["side-by-side", "fullscreen", 'preview'],
        status: false,
        tabSize: 4
      });

      if (this.disabled) {
        this.mde.codemirror.options.readOnly = true;
        // disabled toolpanel
        
      }

      this.mde.codemirror.on("change", () => {
        // save value and html
        const value = this.mde.value()
        this.$emit("input", value);
        this.$emit("change", value);
        // value to markdown
        this.$emit('html', this.mde.markdown(value))
      });
      this.mde.codemirror.on("focus", () => {
        this.$emit("focus");

        // add focus class
        this.$el.querySelector(".CodeMirror").classList.add(...this.focusClass);
      });
      this.mde.codemirror.on("blur", () => {
        this.$emit("blur");
        // remove focus class
        this.$el.querySelector(".CodeMirror").classList.remove(...this.focusClass);
      });
    },
  },
  watch: {
    disabled(disable) {
      this.mde.codemirror.options.readOnly = disable;
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // this.mde.toTextArea();
    // this.mde = null;
  },
};
</script>

<style lang="css">
/* .CodeMirror-wrap {
  @apply rounded-md;
} */
/* 
.CodeMirror-focused {
  @apply ring-2 ring-blue-600 outline-2 outline-transparent;
} */
</style>
