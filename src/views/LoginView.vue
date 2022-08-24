<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <div class="form">
      <base-input v-model="inp" large autofocus>Belépési kód</base-input>
      <base-button type="danger" size="lg" outline @click="login">Belépés</base-button>
    </div>
    <base-dialog :show="!!error" @close="error = ''"> {{ error }} </base-dialog>
  </div>
</template>

<script setup>
//TODO animált háttér
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const store = useStore();
const router = useRouter();
const route = useRoute();

const inp = ref('');
watch(inp, (val, oldVal) => {
  if (val !== oldVal.toUpperCase()) {
    inp.value = val.toUpperCase();
    if (inp.value.length === 6) {
      setTimeout(() => {
        login();
      }, 500);
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
      store.dispatch('changeAuth', { token: res.data.accessToken });
      router.replace(route.query.redirect ? `${route.query.redirect}` : '/');
    })
    .catch(err => {
      error.value = err.response.data.message;
    });
  inp.value = '';
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
