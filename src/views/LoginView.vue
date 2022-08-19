<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <div class="form">
      <base-input v-model="inp" autofocus>Belépési kód</base-input>
      <base-button type="danger" size="lg" outline @click="login">Belépés</base-button>
    </div>
    <base-dialog :show="!!error" @close="error = ''"> {{ error }} </base-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const inp = ref('');
watch(inp, (val, oldVal) => {
  if (val !== oldVal.toUpperCase()) {
    inp.value = val.toUpperCase();
    if (inp.value.length === 6) {
      login();
    }
  }
});

const error = ref('');
function login() {
  axios
    .post('csoport/signin', {
      code: inp.value,
    })
    .then(res => {
      console.log(res);
      inp.value = '';
    })
    .catch(err => {
      error.value = err.response.data.message;
      inp.value = '';
    });
}
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
