<template>
  <div class="test">
    <div class="question">{{ question }}</div>
    <form @submit.prevent="kuld">
      <base-input v-model="answer" large>Válasz</base-input>
      <base-button outline class="kuld" @click="kuld">&nbsp;&nbsp;Küldés&nbsp;&nbsp;</base-button>
    </form>
    <div class="attempts">
      <div v-for="i in 3" :key="i" class="attempt" :class="i <= meg ? 'has' : ''"></div>
    </div>
    <base-button outline type="danger" class="felad" @click="felad">Feladom</base-button>
    <base-dialog :show="!!error.body" @close="tryClose" :title="error.header" :type="error.type">
      <strong>{{ error.body }}</strong>
    </base-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

const store = useStore();
const router = useRouter();

const taskId = computed(() => store.getters.getTask);

const question = ref('');
const meg = ref(1);
const answer = ref('');
const error = reactive({ body: '', type: '', header: '' });

function tryClose() {
  error.body = '';
  if (meg.value === 0) router.replace('/');
}
function kuld() {
  if (answer.value.length === 0) return;
  axios
    .post(`feladat/try/${taskId.value}`, { answer: answer.value })
    .then(({ data }) => {
      if ('type' in data) {
        error.type = 'success';
        error.header = 'Siker';
        error.body = `Sikerült megtalálni a megoldást, és még ${meg.value} próbbálkozás maradt is!`;
        meg.value = 0;
      } else if ('voltmar' in data) {
        error.type = 'primary';
        error.header = 'Ez volt már!';
        error.body = `Ezt már próbáltátok, és még mindig nem jó, de nyugi, legalább a próbálkozások száma nem változott, még mindig ${meg.value}!`;
      } else {
        meg.value = data.meg;
        if (data.meg === 0)
          throw { response: { data: { message: 'Sajnos ez volt az  utolsó próbálkozás!' } } };
        error.type = 'warning';
        error.header = 'Ez nem talált!';
        error.body = `Ez most nem jött össze, de ne csüggedj, még van ${data.meg} próbálkozásotok!`;
      }
    })
    .catch(err => {
      error.type = 'danger';
      error.header = 'Elfogyott a próbálkozás!';
      error.body = err.response.data.message;
    });
}
function felad() {
  store.dispatch('removeTasks');
  router.push('/');
}

onBeforeMount(() => {
  if (!taskId.value) {
    router.replace('/');
    return;
  }
  axios
    .get(`/feladat/get/${taskId.value}`)
    .then(({ data }) => {
      question.value = data.feladat;
      meg.value = data.meg;
    })
    .catch(err => {
      console.log(err);
      //TODO hibakezelés
    });
});
</script>

<style lang="scss" scoped>
.test {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .question {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
  }
  button {
    font-size: 3.5rem;
    font-weight: 700;
    border-width: 0.3rem;
    margin: 25px;
    &.felad {
      margin-top: 5rem;
      font-size: 2rem;
    }
  }
  .attempts {
    display: flex;
    flex-flow: row-reverse;
    .attempt {
      width: 4rem;
      height: 4rem;
      $deg: -90deg;
      // background: linear-gradient($deg, lighten(#bbb, 10%) 0%, darken(#bbb, 10%) 100%);
      background: #bbb;
      border: 1px solid darken(#bbb, 30%);
      &.has {
        &:nth-child(1) {
          background: linear-gradient($deg, lighten($danger, 10%) 0%, darken($danger, 10%) 100%);
          border: 0;
        }
        &:nth-child(2) {
          background: linear-gradient($deg, lighten($warning, 10%) 0%, darken($warning, 10%) 100%);
          border: 0;
        }
        &:nth-child(3) {
          background: linear-gradient($deg, lighten($success, 10%) 0%, darken($success, 10%) 100%);
          border: 0;
        }
      }
    }
  }
}
</style>
