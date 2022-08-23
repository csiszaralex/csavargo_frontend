<template>
  <div>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid d-flex align-items-center flex-row justify-content-around">
        <a class="navbar-brand csavargo" @click="home">Csavargó</a>
        <div v-if="admin">
          <base-button @click="adminPage" outline type="success">Admin</base-button>
        </div>
        <div v-if="auth">
          <base-button @click="logout">Kilépés</base-button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();
const admin = computed(() => {
  return store.getters.isAdmin;
});
const auth = computed(() => {
  return store.getters.isLoggedIn;
});
function logout() {
  store.dispatch('logout');
}
function adminPage() {
  router.push('/admin');
}
function home() {
  router.push(auth.value ? '/' : '/login');
}
</script>

<style></style>
