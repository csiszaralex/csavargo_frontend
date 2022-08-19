<template>
  <button :type="btnSend" class="btn" :class="[btnType]" :disabled="props.disabled">
    <router-link v-if="btnLink" :to="btnTo" class="text-reset text-decoration-none">
      <slot />
    </router-link>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
  type: {
    type: String,
    default: 'primary',
  },
  to: {
    type: String,
    default: '',
  },
  outline: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  submit: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: '',
  },
});
const btnType = computed(() => {
  const classes = [];
  const type = props.outline ? 'btn-outline-' : 'btn-';
  classes.push(type + props.type);
  if (props.size === 'lg') classes.push('btn-lg');
  if (props.size === 'sm') classes.push('btn-sm');
  return classes;
});
const btnSend = computed(() => {
  if (!props.to && props.submit) {
    return 'submit';
  }
  return 'button';
});
const btnLink = computed(() => {
  return !(!props.to || props.to === '');
});
const btnTo = computed(() => {
  return props.to ? props.to : route.fullPath;
});
</script>

<style></style>
