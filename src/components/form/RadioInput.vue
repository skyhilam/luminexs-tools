<template>
  <div class="flex items-center flex-nowrap space-x-4 w-full mb-4">
    <label
      class="text-sm flex-grow cursor-pointer"
      @click="() => $refs['switchButton'].toggle()"
    >
      <slot />
    </label>

    <SwitchButton
      class="flex-none"
      ref="switchButton"
      :checked="checked"
      @change="update"
      :disabled="disabled"
    />
  </div>
</template>

<script>
import SwitchButton from "./SwitchButton.vue";
export default {
  components: {
    SwitchButton,
  },
  props: {
    value: {
      validator() {
        return true;
      },
    },
    checked: {
      type: Boolean,
      required: true,
    },
    disabled: Boolean,
  },
  methods: {
    update(el) {
      const data = {
        value: this.value,
        checked: el
      }
      this.$emit("input", data);
      this.$emit("change", data);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>