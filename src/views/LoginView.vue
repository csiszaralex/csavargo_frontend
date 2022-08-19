<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <div class="form">
      <base-input v-model="inp" autofocus>Belépési kód</base-input>
      <base-button type="danger" size="lg" outline>Belépés</base-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const inp = ref('');
watch(inp, (val, oldVal) => {
  if (val !== oldVal.toUpperCase()) {
    inp.value = val.toUpperCase();
  }
});
</script>

<style lang="scss" scoped>
.form {
  text-align: center;
  button {
    font-size: 3.5rem;
    font-weight: 700;
    border-width: 0.3rem;
    margin: 25px;
  }
}
</style>
