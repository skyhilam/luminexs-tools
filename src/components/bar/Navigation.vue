<template>
  <nav class="flex space-x-6 flex-nowrap min-w-max" aria-label="Tabs">
    <nuxt-link
      v-for="(nav, index) in navs"
      :key="index"
      :to="nav.to"
      class="text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
      :class="isActive(nav)"
      >{{ nav.text }}</nuxt-link
    >
  </nav>
</template>

<script>
/**
 * navs = [ {to, text, exact} ]
 * 
 * **/
import { isEqual } from "lodash";
export default {
  props: {
    navs: {
      type: Array,
      required: true,
    },
  },
  methods: {
    isActive(nav) {
      const default_class = "border-transparent";

      if (nav.exact) {
        if (
          !isEqual(
            {
              name: this.$route.name,
              params: this.$route.params,
            },
            nav.to
          )
        )
          return default_class;
      }

      if (!this.$route.name.includes(nav.to.name)) return default_class;

      return 'border-primary';
    },
  },
};
</script>

<style lang="scss" scoped></style>
