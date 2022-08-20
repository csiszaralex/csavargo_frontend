<template>
  <div>
    <nav class="d-none">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">LOGIN</router-link>
    </nav>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid d-flex align-items-center flex-row justify-content-around">
        <a class="navbar-brand csavargo" href="#">Csavargó</a>
        <button
          v-if="admin"
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminButton">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div v-if="admin" class="collapse navbar-collapse" id="adminButton">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Features</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Pricing</a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                Dropdown link
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>
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
const store = useStore();
const admin = computed(() => {
  return store.getters.isAdmin;
});
const auth = computed(() => {
  return store.getters.isLoggedIn;
});
function logout() {
  store.dispatch('logout');
}
</script>

<style></style>
