import { createRouter, createWebHistory } from 'vue-router';
import { PAGE_NAME } from '@/config/config';
import store from '@/store';
import HomeView from '@/views/HomeView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Játék', auth: true } },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '@/views/LoginView.vue'),
    meta: { title: 'Belépés', auth: false },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title + ' | ' + PAGE_NAME : PAGE_NAME;
  if (typeof to.meta.auth === 'boolean') {
    const loggedIn = store.getters.isLoggedIn;
    if (!loggedIn && to.meta.auth) {
      router.replace(`/login?redirect=${to.path}`);
    } else if (loggedIn && !to.meta.auth) {
      next('/');
    }
  }
  next();
});

//TODO login + title
//TODO 404

export default router;
