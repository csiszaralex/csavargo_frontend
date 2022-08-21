<template>
  <div>
    <div class="inputBox">
      <input
        type="text"
        required="required"
        :value="value"
        @keyup="e => (value = e.target.value)"
        @input="e => (value = e.target.value)"
        :autofocus="autofocus" />
      <span>Kód</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, required: true },
  autofocus: { type: Boolean, default: false },
});
const emits = defineEmits(['update:modelValue']);

const value = ref(props.modelValue ? props.modelValue : '');
watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (val !== oldVal) {
      value.value = val;
    }
  },
);
watch(value, val => {
  emits('update:modelValue', val);
});
const autofocus = computed(() => {
  if (!('userAgentData' in navigator)) return false;
  return props.autofocus && !navigator.userAgentData.mobile;
});
</script>

<style lang="scss" scoped>
$szin1: darken($primary, 10%);
$okay: $primary;
$size: 3rem;
// TODO Bill nem jön fel autofocuon telon
.inputBox {
  position: relative;
  width: 85vw;
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid $szin1;
    background: $bg;
    border-radius: 5px;
    outline: none;
    color: $dark;
    font-size: $size;
    transition: 0.5s;
    &:valid ~ span,
    &:focus ~ span {
      color: $bg;
      transform: translateX(0.3 * $size) translateY(-0.3 * $size);
      font-size: 0.45 * $size;
      padding: 0 10px;
      background: $okay;
      letter-spacing: 0.2em;
      border-radius: 2px;
    }
    &:valid,
    &:focus {
      border-color: $okay;
    }
  }
  span {
    position: absolute;
    left: 0;
    padding: 10px;
    pointer-events: none;
    font-size: $size;
    color: $szin1;
    // text-transform: uppercase;
    transition: 0.5s;
  }
}
</style>
