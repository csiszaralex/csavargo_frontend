<template>
  <button :class="props.type">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps(['type']);
</script>

<style></style>
