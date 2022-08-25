<template>
  <div class="d-flex flex-column align-items-center justify-content-around">
    <div class="form">
      <base-input v-model="inp" large autofocus>Belépési kód</base-input>
      <base-button type="danger" size="lg" outline @click="login">Belépés</base-button>
    </div>
    <div class="ball">
      <div class="pokeball">
        <div class="pokeball__button"></div>
      </div>
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
.ball {
  z-index: -1;
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Poké Styles */
  .pokeball {
    position: relative;
    width: 100px;
    height: 100px;
    background: #fff;
    border: 5px solid #000;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: inset -10px 10px 0 10px #ccc;
    animation: fall 0.25s ease-in-out, shake 1.25s cubic-bezier(0.36, 0.07, 0.19, 0.97) 3;
  }
  .pokeball::before,
  .pokeball::after {
    content: '';
    position: absolute;
  }
  .pokeball::before {
    background: red;
    width: 100%;
    height: 50%;
  }
  .pokeball::after {
    top: calc(50% - 5px);
    width: 100%;
    height: 10px;
    background: #000;
  }
  .pokeball__button {
    position: absolute;
    top: calc(50% - 15px);
    left: calc(50% - 15px);
    width: 30px;
    height: 30px;
    background: #7f8c8d;
    border: 5px solid #fff;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 0 0 10px black;
    animation: blink 0.5s alternate 7;
  }
  /* Animation */
  @keyframes blink {
    from {
      background: #eee;
    }
    to {
      background: #e74c3c;
    }
  }
  @keyframes shake {
    0% {
      transform: translate(0, 0) rotate(0);
    }
    20% {
      transform: translate(-10px, 0) rotate(-20deg);
    }
    30% {
      transform: translate(10px, 0) rotate(20deg);
    }
    50% {
      transform: translate(-10px, 0) rotate(-10deg);
    }
    60% {
      transform: translate(10px, 0) rotate(10deg);
    }
    100% {
      transform: translate(0, 0) rotate(0);
    }
  }
  @keyframes fall {
    0% {
      top: -200px;
    }
    60% {
      top: 0;
    }
    80% {
      top: -20px;
    }
    100% {
      top: 0;
    }
  }
}
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
