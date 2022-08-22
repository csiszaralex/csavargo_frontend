<template>
  <div>
    <div class="qr">
      <base-button type="warning" outline @click="toggleQr">QR kód olvasása</base-button>
    </div>
    <div class="stat">
      <h1 class="fw-bold">Előzmények</h1>
      <base-button
        type="danger"
        size="lg"
        :outline="!isCsoport"
        :disabled="isCsoport"
        @click="toggleStat">
        Csoport
      </base-button>
      <base-button
        type="danger"
        size="lg"
        :outline="isCsoport"
        :disabled="!isCsoport"
        @click="toggleStat">
        Osztály
      </base-button>

      <base-table :data="stat" striped>
        <tr>
          <td :colspan="isCsoport ? 3 : 4" class="fw-bold">Összesen: {{ szum }}</td>
        </tr>
      </base-table>
    </div>
    <base-dialog
      :show="QrOpened && !error.body"
      @close="toggleQr"
      @save="saveQr"
      type="primary"
      title="QR kód olvasó"
      closeType="warning"
      closeText="Mégse"
      saveType="success"
      saveText="Küldés"
      reverseFoot>
      <!-- <qr-base></qr-base> -->
      <base-input v-model="qr">QR kód</base-input>
    </base-dialog>
    <base-dialog :show="!!error.body" @close="error.body = ''" type="warning" title="Nem talált!">
      <strong>{{ error.body }}</strong>
    </base-dialog>
  </div>
</template>

<script setup>
/*eslint-disable */
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
import QrBase from '@/components/home/qr/QrBase.vue';

const store = useStore();
const router = useRouter();

const QrOpened = ref(false);
const qr = ref('');
const error = reactive({ body: '', type: '' });
const szum = ref(0);
const stat = ref([]);
getStat();

function toggleQr() {
  QrOpened.value = !QrOpened.value;
  qr.value = '';
}
function saveQr() {
  axios
    .post('/qr/available', { code: qr.value })
    .then(({ data }) => {
      if (!data.available) {
        error.body =
          'Ezt a QR kódot már túl sokan találták meg, de ne csüggedj, még sok lehetőség van a közeltekben!';
        error.type = 'warning';
        qr.value = '';
        return;
      }
      store.dispatch('changeTask', { taskId: data.id, code: qr.value });
      router.push('/task');
    })
    .catch(err => {
      error.type = 'danger';
      error.body = err.response.data.message;
    });
}

const isCsoport = ref(true);
function toggleStat() {
  isCsoport.value ? getOsztStat() : getStat();
  isCsoport.value = !isCsoport.value;
}
function getStat() {
  axios.get('/csoport').then(({ data }) => {
    stat.value = [
      ...data.map(i => {
        return { ...i, Mikor: moment(i.Mikor).subtract(2, 'hours').format('HH:mm') };
      }),
    ];
    szum.value = data.reduce((prev, cur) => prev + cur['Érték'], 0);
  });
  //TODO hiba
}
function getOsztStat() {
  axios.get('/csoport/osztaly').then(({ data }) => {
    stat.value = [
      ...data.map(i => {
        return { ...i, Mikor: moment(i.Mikor).subtract(2, 'hours').format('HH:mm') };
      }),
    ];
    szum.value = data.reduce((prev, cur) => prev + cur['Érték'], 0);
  });
}
</script>

<style lang="scss" scoped>
.qr {
  text-align: center;
  button {
    font-size: 3.5rem;
    font-weight: 700;
    border-width: 0.3rem;
    margin: 25px;
  }
}
.stat {
  text-align: center;
  button {
    width: 40vw;
    &:nth-child(2) {
      border-radius: 1rem 0px 0px 1rem;
    }
    &:nth-child(3) {
      border-radius: 0px 1rem 1rem 0px;
    }
  }
}
</style>
