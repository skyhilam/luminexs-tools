<template>
  <div :class="_class">
    <v-field :tag-class="fieldClass" :error="error ? error[id] : errors[id]">
      <div :class="containerClass">
        <template v-if="!isCheckbox && !isRadio">
          <vLabel v-if="label" :label="label" :id="id" :sublabel="sublabel" :tip="tip" />

          <slot name="label" />

          <template v-if="type == 'image'">
            <UploaderWithImage
              :size="size"
              :url="url"
              :src="src"
              @input="onType"
              :clickable="clickable"
              :destroyable="destroyable"
              @destroy="onDestroy"
              :disabled="disabled"
              :accept="accept"
              :aspectRatio="aspectRatio"
              ref="uploader"
              :sortable="sortable"
              :order="order"
              @sort="onSort"
            />
          </template>

          <template v-if="isBaseInputType()">
            <input
              :type="type"
              :id="id"
              :class="inputClass"
              :disabled="disabled"
              @input="onType"
              :value="value"
            />
          </template>

          <template v-if="type == 'address'">
            <FiledAddress
              :id="id"
              :class="inputClass"
              :disabled="disabled"
              @input="onType"
              :value="value"
            />
          </template>

          <template v-if="type == 'select'">
            <select
              :class="inputClass"
              :disabled="disabled"
              :id="id"
              :value="value"
              @change="onType"
            >
              <template v-if="options">
                <option
                  v-for="option in options"
                  :value="option.value"
                  :key="option.value"
                >
                  {{ option.text }}
                </option></template
              >
              <slot name="options" />
            </select>
          </template>

          <template
            v-if="['date', 'datetime', 'year', 'month', 'time', 'week'].includes(type)"
          >
            <date-picker
              :valueType="valueType"
              :disabled-date="disabledDate"
              :type="type"
              :value="value"
              :range="range"
              :format="format"
              :minuteStep="minuteStep"
              @input="onType"
              :show-second="false"
              v-if="['date', 'datetime', 'year', 'month', 'time', 'week'].includes(type)"
              :input-class="inputClass"
              class="w-full"
              :disabled="disabled"
            />
          </template>

          <template v-if="type == 'textarea'">
            <v-textarea
              :id="id"
              :value="value"
              @input="onType"
              :class="inputClass"
              :disabled="disabled"
            />
          </template>

          <template v-if="type == 'editor'">
            <editor
              :value="value"
              @input="onType"
              @html="(html) => this.$emit('html', html)"
              :disabled="disabled"
            />
          </template>

          <template v-if="type == 'color'">
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 rounded-md flex-none border-2 shadow-sm"
                :style="`background-color: ${value}`"
              ></div>
              <div class="flex-grow">
                <input
                  type="text"
                  :id="id"
                  :class="inputClass"
                  :disabled="disabled"
                  @input="onType"
                  :value="value"
                />
              </div>
            </div>
          </template>
        </template>

        <template v-if="isRadio">
          <vLabel v-if="label" :label="label" :id="id" :sublabel="sublabel" :tip="tip" />
          <div :class="radioClass">
            <div v-for="option in options" :key="option.id">
              <RadioInput
                :value="option.id"
                :checked="radioChecked(option.id)"
                @input="toggleRadio"
              >
                <slot :option="option" />
              </RadioInput>
            </div>
          </div>
        </template>

        <template v-if="isCheckbox">
          <div class="flex items-center flex-nowrap space-x-4 w-full">
            <label
              class="text-sm flex-grow cursor-pointer"
              @click="() => $refs['switchButton'].toggle()"
              v-if="label"
              >{{ label }} <slot name="sublabel"
            /></label>
            <SwitchButton
              class="flex-none"
              ref="switchButton"
              :activeClass="activeClass"
              :inactiveClass="inactiveClass"
              :checked="value"
              @change="onType"
              :disabled="disabled"
            />
          </div>
        </template>
      </div>
    </v-field>
    <slot name="bottom" />
  </div>
</template>

<script>
import vField from "./Field";
import vTextarea from "./Textarea2";
import SwitchButton from "./SwitchButton";
import FiledAddress from "./FiledAddress";
import Editor from './Editor'
import UploaderWithImage from "../image/UploaderWithImage";
import vLabel from "./Label";
import RadioInput from "./RadioInput";

import { each, findIndex } from "lodash";

export default {
  components: {
    vField,
    vTextarea,
    SwitchButton,
    FiledAddress,
    UploaderWithImage,
    vLabel,
    RadioInput,
    Editor,
  },
  props: {
    value: {
      validator() {
        return true;
      },
    },
    id: String,
    disabled: Boolean,
    clickable: Boolean,
    destroyable: Boolean,
    sortable: Boolean,
    range: Boolean,
    src: String,
    url: String,
    order: [Number, String],
    minuteStep: {
      type: Number,
      default: 1,
    },
    size: {
      type: String,
      default: "h-28 w-28",
    },
    type: {
      type: String,
      default: "text",
    },
    _class: {
      type: String,
      default: "mb-4",
    },
    inputClass: {
      type: String,
      default: "field",
    },
    valueType: {
      type: String,
      default: "format",
    },
    format: {
      type: String,
      default: "YYYY-MM-DD",
    },
    disabledDate: {
      type: Function,
    },
    fieldClass: {
      type: String,
      default: "mb-0",
    },
    label: String,
    sublabel: String,
    tip: String,
    radioClass: String,
    containerClass: {
      type: String,
    },
    options: Array,
    error: Object,
    //upload image attribute
    aspectRatio: {
      type: Number,
      default: 1 / 1,
    },
    accept: {
      type: String,
      default: "image/png, image/jpg, image/jpeg, image/webp",
    },
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
    isBaseInputType() {
      return ["password", "number", "text", "search", "url"].includes(this.type);
    },
    onType(el) {
      let value = el;
      if (this.isBaseInputType() || this.type == "select" || this.type == "color") {
        value = el.target.value;
      }

      this.update(value);
    },
    update(value) {
      this.$emit("input", value);
      this.$emit("change", value);
    },
    toggleRadio(data) {
      if (this.value instanceof Array) {
        if (data.checked) {
          if (!this.radioChecked(data.value)) this.value.push(data.value);
        } else {
          const index = findIndex(this.value, (d) => d == data.value);
          this.value.splice(index, 1);
        }

        this.update(this.value);
        return;
      }

      if (this.value != data.value) {
        this.update(data.value);
      }
    },
    radioChecked(value) {
      if (this.value instanceof Array) {
        return this.value.includes(value);
      }

      return this.value == value;
    },
    onDestroy() {
      this.value = "";
      this.$emit("destroy");
    },
    onSort() {
      this.$emit("sort");
    },
  },
  computed: {
    isCheckbox() {
      return this.type == "checkbox";
    },
    isRadio() {
      return this.type == "radio";
    },
  },
  mounted() {
    const el =
      this.$el.querySelector("input") ||
      this.$el.querySelector("select") ||
      this.$el.querySelector("textarea");

    if (el)
      each(this.$attrs, (value, attr) => {
        el.setAttribute(attr, value);
      });
  },
};
</script>

<style lang="css" scoped>
.mx-datepicker {
  @apply relative inline-block w-full;
}
</style>
