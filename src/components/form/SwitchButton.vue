<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <!-- On: "bg-indigo-600", Off: "bg-gray-200" -->
  <div
    aria-pressed="false"
    class="
      relative
      inline-flex
      flex-shrink-0
      h-6
      w-11
      border-2 border-transparent
      rounded-full
      cursor-pointer
      transition-colors
      ease-in-out
      duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    "
    :class="getClass()"
    @click="toggle"
  >
    <span class="sr-only">Use setting</span>
    <!-- On: "translate-x-5", Off: "translate-x-0" -->
    <span
      aria-hidden="true"
      class="
        pointer-events-none
        inline-block
        h-5
        w-5
        rounded-full
        bg-white
        shadow
        transform
        ring-0
        transition
        ease-in-out
        duration-200
      "
      :class="isCheck()? 'translate-x-5': 'translate-x-0'"
    ></span>
  </div>
</template>

<script>
export default {
  props: {
    checked: Boolean,
    value: Boolean,
    disabled: Boolean,
    activeClass: {
      type: String,
      default: "bg-primary",
    },
    inactiveClass: {
      type: String,
      default: "bg-gray-200",
    },
  },
  
  methods: {
    toggle() {
      if (this.disabled) return;
      this.$emit("change", !this.checked);
      this.$emit("input", !this.checked);
    },
    isCheck() {
      return this.checked;
    },
    getClass() {
      let myclass = this.isCheck() ? this.activeClass : this.inactiveClass;

      if (this.disabled) {
        myclass += " opacity-50 cursor-not-allowed";
      }

      return myclass;
    },
  },
  
  
};
</script>

<style lang="scss" scoped>
</style>