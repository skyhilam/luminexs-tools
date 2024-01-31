<template>
  <div :class="_class">
    <v-field :tag-class="fieldClass" :error="error ? error[id] : errors[id]">
      <div :class="containerClass">
        <template v-if="!isCheckbox && !isRadio">
          <vLabel
            v-if="label"
            :label="label"
            :id="id"
            :sublabel="sublabel"
            :tip="tip"
          />

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
            v-if="
              ['date', 'datetime', 'year', 'month', 'time', 'week'].includes(
                type
              )
            "
          >
            <div v-show="sreenWidth >= 640">
              <date-picker
                :valueType="valueType"
                :disabled-date="disabledDate"
                :type="type"
                :value="value"
                :range="range"
                @input="onType"
                :format="format"
                :minuteStep="minuteStep"
                :show-second="false"
                v-if="
                  [
                    'date',
                    'datetime',
                    'year',
                    'month',
                    'time',
                    'week',
                  ].includes(type)
                "
                :input-class="inputClass"
                class="w-full"
                :disabled="disabled"
              />
            </div>
            <div class="w-full relative" v-show="sreenWidth < 640">
              <template v-if="!range">
                <input
                  type="text"
                  class="w-full h-[42px] rounded"
                  :value="value"
                  @click="showPopup('show', true)"
                />
                <van-popup v-model="show" position="bottom" class="px-4">
                  <van-datetime-picker
                    title="選擇時間"
                    v-model="currentDate"
                    :type="dateType"
                    @confirm="confirmDate"
                    @cancel="showPopup('show', false)"
                  />
                </van-popup>
              </template>
              <template v-else>
                <div class="flex bg-white border border-[#6b7280] rounded">
                  <input
                    type="text"
                    class="flex-1 h-[42px] rounded border-0"
                    placeholder="開始時間"
                    :value="value ? value[0] : ''"
                    @click="showPopup('showStartDate', true)"
                  />
                  <div class="h-[42px] leading-[42px] mx-2">~</div>
                  <input
                    type="text"
                    class="flex-1 h-[42px] rounded border-0"
                    placeholder="結束時間"
                    :value="value ? value[1] : ''"
                    @click="showPopup('showEndDate', true)"
                  />
                </div>
                <van-popup
                  v-model="showStartDate"
                  position="bottom"
                  class="px-4"
                >
                  <van-datetime-picker
                    title="開始時間"
                    v-model="startDate"
                    :type="type"
                    @confirm="confirmRangeDate('showStartDate')"
                    @cancel="showPopup('showStartDate', false)"
                  />
                </van-popup>
                <van-popup v-model="showEndDate" position="bottom" class="px-4">
                  <van-datetime-picker
                    title="結束時間"
                    v-model="endDate"
                    :type="type"
                    @confirm="confirmRangeDate('showEndDate')"
                    @cancel="showPopup('showEndDate', false)"
                  />
                </van-popup>
              </template>
              <div
                v-show="value"
                @click="clearValue"
                class="close absolute w-4 h-4 right-2 top-1/2 -translate-y-1/2"
              ></div>
            </div>
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
              :gallery="gallery"
              @input="onType"
              @html="(html) => this.$emit('html', html)"
              :disabled="disabled"
            />
          </template>

          <template v-if="type == 'color'">
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 rounded-md flex-none border-2 shadow-sm"
                :class="[eyeDropperClass]"
                :style="`background-color: ${value}`"
                @click="eyeDropper"
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
          <vLabel
            v-if="label"
            :label="label"
            :id="id"
            :sublabel="sublabel"
            :tip="tip"
          />
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
          <div
            class="flex items-center w-full flex-nowrap"
            :class="[
              {
                'space-x-4': label,
              },
            ]"
          >
            <div class="flex items-center flex-grow" v-if="label">
              <label
                class="text-sm cursor-pointer"
                @click="() => $refs['switchButton'].toggle()"
                >{{ label }} <slot name="sublabel"
              /></label>
              <TooltipVue v-if="tip" :tip="tip" />
            </div>
            <SwitchButton
              :class="[{'flex-none': label}]"
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
import FiledAddress from "./FiledAddress.vue";
import Editor from "./Editor.vue";
import UploaderWithImage from "../image/UploaderWithImage";
import vLabel from "./Label";
import TooltipVue from "./Tooltip.vue";
import RadioInput from "./RadioInput.vue";
import {useEyeDropper} from "@vueuse/core";

import {each, findIndex} from "lodash";

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
    TooltipVue,
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
    gallery: {
      type: String,
      default: "default",
    },
    valueType: {
      type: String,
      default: "format",
    },
    format: {
      type: String,
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
  watch: {
    value(value) {
      if (
        value &&
        ["date", "datetime", "year", "month", "time", "week"].includes(
          this.type
        )
      ) {
        if (Object.prototype.toString.call(value).indexOf("Array") !== -1) {
          this.startDate = new Date(value[0]);
          this.endDate = new Date(value[1]);
        } else {
          if (this.type == "time") {
            this.currentDate = value;
          } else {
            this.currentDate = new Date(value);
          }
        }
      }
    },
  },
  data() {
    return {
      timer: null,
      sreenWidth: null,
      show: false,
      showStartDate: false,
      showEndDate: false,
      startDate: new Date(),
      endDate: new Date(),
      currentDate: this.type == "time" ? "" : new Date(),
    };
  },
  methods: {
    clearValue() {
      this.currentDate = this.type == "time" ? "" : new Date();
      this.startDate = this.type == "time" ? "" : new Date();
      this.endDate = this.type == "time" ? "" : new Date();
      this.onType("");
    },
    formatTime(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      let dateFormat;
      switch (this.type) {
        case "datetime":
          dateFormat = `${[year, month, day]
            .map(this.formatNumber)
            .join("-")} ${[hour, minute, second]
            .map(this.formatNumber)
            .join(":")}`;
          break;
        case "month":
          dateFormat = `${[year, month].map(this.formatNumber).join("-")}`;
          break;
        case "year":
          dateFormat = `${year}`;
          break;
        default:
          dateFormat = `${[year, month, day].map(this.formatNumber).join("-")}`;
      }
      return dateFormat;
    },
    formatNumber(number) {
      number = number.toString();
      return number[1] ? number : `0${number}`;
    },
    getWeekNumber(date) {
      let beginDate = new Date(date.getFullYear(), 0, 1);
      let endWeek = date.getDay();
      if (endWeek == 0) endWeek = 7;
      let beginWeek = beginDate.getDay();
      if (beginWeek == 0) beginWeek = 7;
      //计算两个日期的天数差
      let millisDiff = date.getTime() - beginDate.getTime();
      let dayDiff = Math.floor(
        (millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000
      );
      return Math.ceil(dayDiff / 7) + 1;
    },
    confirmRangeDate(index) {
      let start = this.formatTime(this.startDate);
      let end = this.formatTime(this.endDate);
      this.onType([start, end]);
      this.showPopup(index, false);
    },
    confirmDate() {
      let date;
      if (this.type == "time") {
        date = `${this.currentDate}:00`;
      } else if (this.type == "week") {
        date = `${this.getWeekNumber(this.currentDate)}`;
      } else {
        date = this.formatTime(this.currentDate);
      }
      this.onType(date);
      this.showPopup("show", false);
    },
    showPopup(index, value) {
      this[`${index}`] = value;
    },
    pageResize() {
      if (this.timer) return;
      this.timer = setTimeout(() => {
        this.sreenWidth = window.innerWidth;
        this.timer = null;
      }, 100);
    },
    eyeDropper() {
      const {isSupported, open} = useEyeDropper();

      if (isSupported.value) {
        open().then((color) => {
          this.update(color.sRGBHex.toUpperCase());
        });
      }
    },
    isBaseInputType() {
      return ["password", "number", "text", "search", "url"].includes(
        this.type
      );
    },
    onType(el) {
      let value = el;
      if (
        this.isBaseInputType() ||
        this.type == "select" ||
        this.type == "color"
      ) {
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
      this.$emit("input", "");
      this.$emit("destroy");
    },
    onSort() {
      this.$emit("sort");
    },
  },
  computed: {
    dateType() {
      if (this.type == "month" || this.type == "year") {
        return "year-month";
      }
      if (this.type == "week") {
        return "date";
      }
      return this.type;
    },
    isCheckbox() {
      return this.type == "checkbox";
    },
    isRadio() {
      return this.type == "radio";
    },
    eyeDropperClass() {
      const {isSupported} = useEyeDropper();
      return isSupported.value ? "cursor-pointer" : "";
    },
  },
  mounted() {
    window.addEventListener("resize", this.pageResize);
    this.sreenWidth = window.innerWidth;

    const el =
      this.$el.querySelector("input") ||
      this.$el.querySelector("select") ||
      this.$el.querySelector("textarea");

    if (el)
      each(this.$attrs, (value, attr) => {
        el.setAttribute(attr, value);
      });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.pageResize);
  },
};
</script>

<style lang="css" scoped>
.mx-datepicker {
  @apply relative inline-block w-full;
}

.close {
  cursor: pointer;
  font-size: 0px;
}
.close::before,
.close::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: 8px;
  bottom: 0;
  margin: auto;
  width: 1px;
  height: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: rotate(-45deg);
}
.close::before {
  transform: rotate(45deg);
}
</style>
