import { createRouter, createWebHistory } from 'vue-router';
import { PAGE_NAME } from '@/config/config';
import store from '@/store';
import HomeView from '@/views/HomeView.vue';
import TaskView from '@/views/TaskView.vue';
import AdminView from '@/views/AdminView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Játék', auth: 1 } },
  { path: '/task', name: 'task', component: TaskView, meta: { title: 'Feladat', auth: 1 } },
  { path: '/admin', name: 'admin', component: AdminView, meta: { title: 'Admin', auth: 2 } },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '@/views/LoginView.vue'),
    meta: { title: 'Belépés', auth: 0 },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title + ' | ' + PAGE_NAME : PAGE_NAME;
  if ('meta' in to && 'auth' in to.meta) {
    const loggedIn = store.getters.isLoggedIn;
    const isAdmin = store.getters.isAdmin;
    const auth = loggedIn ? (isAdmin ? 2 : 1) : 0;

    if (auth === 0 && to.meta.auth > 0) {
      //: Nincs login, pedig login kell
      next(`/login?redirect=${to.path}`);
    } else if (auth !== 0 && (to.meta.auth > auth || to.meta.auth === 0)) {
      //: Van login, de kevés
      //: VAGY Van login, de tilos
      next('/');
    } else next();
  } else next();
});

//TODO 404

export default router;
