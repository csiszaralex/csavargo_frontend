<template>
  <div class="test">
    <div v-if="question.includes('://')"><img :src="question" class="kep" /></div>
    <div v-else class="question">{{ question }}</div>
    <form @submit.prevent="kuld">
      <base-input v-if="type === 'text'" v-model="answer" large>Válasz</base-input>
      <div v-else class="file">
        <base-file @hasFile="hasFile" :file="file.file"></base-file>
      </div>
      <base-button outline class="kuld" @click="kuld">&nbsp;&nbsp;Küldés&nbsp;&nbsp;</base-button>
    </form>
    <div class="attempts">
      <div
        v-for="i in type === 'text' ? 3 : 1"
        :key="i"
        class="attempt"
        :class="i <= meg ? 'has' : ''"></div>
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
const meg = ref(3);
const answer = ref('');
const file = reactive({ file: '' });
const type = ref('text');
const error = reactive({ body: '', type: '', header: '' });

function tryClose() {
  error.body = '';
  if (meg.value === 0) router.replace('/');
}
function kuld() {
  if (type.value === 'text') {
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
      .catch(err => maxTry(err));
  } else {
    const maxSize = 1024 * 1024 * 15;
    if (!file.file) return;
    if (file.file.size > maxSize) {
      fileBig();
      return;
    }
    const formData = new FormData();
    formData.append('file', file.file);
    axios
      .post(`feladat/upload/${taskId.value}`, formData)
      .then(() => {
        error.header = 'Sikeres feltöltés';
        error.type = 'success';
        error.body = 'A feltöltés sikeres, rövidesen elbírálásra is kerül a feladat!';
        file.file = '';
        meg.value--;
      })
      .catch(err => {
        if (err.response.status === 413) {
          fileBig();
          return;
        }
        maxTry(err);
      });
  }
}
function fileBig() {
  error.header = 'Hibás fájlméret!';
  error.type = 'danger';
  error.body = 'A feltöltött fájl mérete túl nagy, maximum 15MB lehet.';
  file.file = '';
}
function maxTry(err) {
  error.type = 'danger';
  error.header = 'Elfogyott a próbálkozás!';
  error.body = err.response.data.message;
}
function felad() {
  store.dispatch('removeTasks');
  router.push('/');
}

function hasFile(fi) {
  file.file = fi.file;
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
      type.value = data.type;
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
  .kep {
    width: 100%;
    height: auto;
  }
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
