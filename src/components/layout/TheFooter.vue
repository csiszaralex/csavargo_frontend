<template>
  <div class="footer bg-secondary text-light" @click="hiba">
    <div>A program jelenleg <strong>teszt</strong> fázisban fut!</div>
    <div>Bármilyen rendellenességet, vagy hibát észlelve <strong>jelentsd!</strong></div>
    <base-dialog
      :show="hibaShow"
      @close="hiba"
      title="HIba jelentése"
      closeText="Mégse"
      type="warning"
      saveText="Küldés"
      @save="send"
      reverseFoot>
      <base-input class="m-3" v-model="leiras">Hiba leírása</base-input>
      <base-input class="m-3" v-model="eloidezes">Előidézés</base-input>
      Ha nem egyszeri eset
    </base-dialog>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const leiras = ref('');
const eloidezes = ref('');
const link = ref(route.fullPath);
/**
 * link
 * Mi történt
 * Egyszeri, vagy többször jelentkező hiba
 *
 */
const hibaShow = ref(false);
function hiba() {
  hibaShow.value = !hibaShow.value;
}
function send() {
  if (!leiras.value) return;

  axios
    .post('hiba', {
      leiras: leiras.value,
      eloidezes: eloidezes.value,
      link: link.value,
    })
    .then(() => {
      leiras.value = '';
      eloidezes.value = '';
      hiba();
    });
}
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
}
</style>
