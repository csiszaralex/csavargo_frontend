<template>
  <div>
    <div class="stat">
      <h1 class="fw-bold">Admin</h1>
      <div class="buttons">
        <base-button
          v-for="option in options"
          :key="option"
          type="success"
          :outline="selectedOption !== option"
          :disabled="selectedOption === option"
          @click="selectOption(option)">
          {{ option }}
        </base-button>
      </div>

      <base-table
        :data="stat"
        :ignore="ignore"
        :acceptable="['Jóváhagy', 'FogyóQR'].includes(selectedOption) ? 'id' : ''"
        @accept="acceptCb"
        :declineable="selectedOption === 'Jóváhagy' ? 'id' : ''"
        @decline="declineTask"
        :showable="['Jóváhagy'].includes(selectedOption) ? 'id' : ''"
        @show="showTask"
        striped>
      </base-table>
    </div>
    <base-dialog :show="!!img" @close="img = ''" title="Kép" upper>
      <div class="kep">
        <img :src="img" />
      </div>
    </base-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import moment from 'moment';

//: Options
const options = ['CsopStat', 'OsztStat', 'Legutóbb', 'Jóváhagy', 'FogyóQR', 'Egyéb'];
const selectedOption = ref(options[0]);
function selectOption(option) {
  selectedOption.value = option;
  switch (option) {
    case 'CsopStat':
      csopStat();
      break;
    case 'OsztStat':
      OsztStat();
      break;
    case 'Legutóbb':
      getLegutobbi();
      break;
    case 'Jóváhagy':
      getAcceptables();
      break;
    case 'FogyóQR':
      getRunouts();
      break;
    // case 'Egyéb':
    //   getEgyeb();
    //   break;
  }
}
csopStat();
//:Stat
const stat = ref([]);
const ignore = ref([]);
function csopStat() {
  axios
    .get('/csoport/stat')
    .then(({ data }) => {
      stat.value = [
        ...data.map(adat => {
          return {
            Csoport: `${adat.osztaly} / ${adat.csoport}`,
            Kód: adat.kod,
            Pontszám: adat.pont,
          };
        }),
      ];
      ignore.value = [];
    })
    .catch(err => {
      console.log(err);
      alert('Hiba történt!');
    });
}
function OsztStat() {
  axios
    .get('/csoport/stat/osztaly')
    .then(({ data }) => {
      stat.value = [
        ...data.map(adat => {
          return {
            Osztály: adat.osztaly,
            Pontszám: adat.pont,
          };
        }),
      ];
      ignore.value = [];
    })
    .catch(err => {
      console.log(err);
      alert('Hiba történt!');
    });
}
function getLegutobbi() {
  axios.get('feladat/positions').then(({ data }) => {
    stat.value = [
      ...data.map(adat => {
        return {
          Csoport: adat.csoport,
          Mikor: moment(adat.mikor).format('HH:mm'),
          Helyszín: adat.hely,
        };
      }),
    ];
    ignore.value = ['#'];
  });
}
function getAcceptables() {
  axios
    .get('/feladat/acceptable')
    .then(({ data }) => {
      stat.value = [
        ...data.map(adat => {
          return {
            Csoport: adat.csoport,
            Kérdés: adat.kerdes.includes('://') ? 'Kép' : adat.kerdes,
            Válasz: adat.tipus === 'text' ? adat.proba : '-',
            Helyes: adat.megoldas,
            Mikor: moment(adat.mikor).format('HH:mm'),
            csopId: adat.csopId,
            felId: adat.felId,
            id: adat.id,
            tipus: adat.tipus,
          };
        }),
      ];
      ignore.value = ['csopId', 'felId', 'id', '#', 'tipus'];
    })
    .catch(err => {
      console.log(err);
      alert('Hiba történt!');
    });
}
function getRunouts() {
  axios
    .get('qr/runout')
    .then(({ data }) => {
      stat.value = [
        ...data.map(adat => {
          return {
            Hely: adat.hely,
            Érték: adat.ertek,
            Maradt: adat.maradt,
            Használható: adat.hasznalhato,
            id: adat.id,
          };
        }),
      ];
      ignore.value = ['#', 'id'];
    })
    .catch(err => {
      console.log(err);
      alert('Hiba történt!');
    });
}
//:Választás
function acceptCb(id) {
  if (selectedOption.value === 'Jóváhagy') acceptTask(id);
  else increaseQR(id);
}
//:Feladat
function acceptTask(id) {
  axios
    .get(`/feladat/accept/${id}`)
    .then(() => {
      getAcceptables();
    })
    .catch(err => {
      console.log(err);
      alert('Hiba történt!');
    });
}
function declineTask(id) {
  axios
    .get(`/feladat/decline/${id}`)
    .then(() => {
      getAcceptables();
    })
    .catch(err => {
      console.log(err);
      alert('Hiba történt!');
    });
}
function showTask(id) {
  const feladat = stat.value.filter(fel => fel.id === id)[0];
  if (feladat.tipus === 'text') return;
  axios.get(`feladat/getpicture/${id}`, { responseType: 'blob' }).then(data => {
    img.value = URL.createObjectURL(data.data);
  });
}
//: Feladat kép
const img = ref('');
//:QR növelés
function increaseQR(id) {
  axios
    .get(`qr/increase/${id}`)
    .then(() => {
      getRunouts();
    })
    .catch(err => {
      console.log(err);
      alert('Hiba történt!');
    });
}
</script>

<style lang="scss" scoped>
.stat {
  text-align: center;
  .buttons {
    margin-left: 5vw;
    margin-right: 5vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0;
    justify-content: space-between;
    grid-auto-flow: column;
    button {
      width: 30vw;
      border-radius: 0;
      &:nth-of-type(1) {
        border-radius: 1rem 0 0 0;
      }
      &:nth-of-type(2) {
        border-radius: 0 0 0 1rem;
      }
      &:nth-last-of-type(1) {
        border-radius: 0 0 1rem 0;
        // grid-column: 3;
        // grid-row: 1 / span 2;
      }
      &:nth-last-of-type(2) {
        border-radius: 0 1rem 0 0;
      }
    }
  }
}
.kep {
  img {
    max-width: 100%;
  }
}
</style>
