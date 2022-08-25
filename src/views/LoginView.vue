<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <div class="form">
      <base-input v-model="inp" large autofocus>Belépési kód</base-input>
      <base-button type="danger" size="lg" outline @click="login">Belépés</base-button>
    </div>
    <base-dialog :show="!!error" @close="error = ''"> {{ error }} </base-dialog>
    <base-dialog
      :show="!!showIntro"
      @close="closeIntro"
      type="success"
      title="A játékról"
      closeText="Tovább"
      upper>
      <div class="leiras">
        <div>
          <strong>A játék lényege:</strong> A feladatotok, hogy a kapott térképen megjelölt helyeken
          megtaláljátok az elrejtett kódokat, majd azokat beírva teljesítsétek a kapott feladatokat.
        </div>
        <div>
          <strong>A kódok: </strong> Minden feladatot csak egy előre meghatározott számú csapat
          oldhat meg, valamint egy-egy feladatot az osztálynak csak az egyik fele oldhat meg.
        </div>
        <div>
          <strong>Feladatok típusai: </strong> A feladatok típusa többféle lehet, azonban
          legtöbbször egy képet kell feltölteni, vagy szöveges választ adni.
        </div>
        <div>
          <strong>Pontgyűjtés: </strong> Minden megoldott feladat pontot ér. A pontokat a feladat
          nehézsge és az adott kód eldugottsága alapján állapítjuk meg. <br />
          Emellett extra pont kapható a kreatívabb, viccesebb megoldásokért.
        </div>
      </div>
    </base-dialog>
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
const showIntro = ref(false);
function login() {
  axios
    .post('csoport/signin', {
      code: inp.value,
    })
    .then(res => {
      store.dispatch('changeAuth', { token: res.data.accessToken });
      showIntro.value = true;
    })
    .catch(err => {
      error.value = err.response.data.message;
    });
  inp.value = '';
}
function closeIntro() {
  showIntro.value = false;
  console.log('szupi');
  tovabb();
}
function tovabb() {
  router.replace(route.query.redirect ? `${route.query.redirect}` : '/');
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
.leiras {
  div {
    margin-top: 1rem;
    strong {
      margin-right: 0.5rem;
    }
  }
}
</style>
