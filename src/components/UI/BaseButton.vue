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
const props = defineProps(['type', 'to', 'outline', 'disabled', 'submit', 'size']);

const btnType = computed(() => {
  const classes = [];
  const type = props.outline === '' ? 'btn-outline-' : 'btn-';
  classes.push(props.type !== '' ? type + props.type : type + 'info');
  if (props.size === 'lg') classes.push('btn-lg');
  if (props.size === 'sm') classes.push('btn-sm');
  return classes;
});
const btnSend = computed(() => {
  if (!props.to && props.submit === '') {
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
