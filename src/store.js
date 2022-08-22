import { createStore } from 'vuex';
import Auth from '@/store/auth';
import Task from '@/store/task';

export default createStore({
  modules: {
    Auth,
    Task,
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});

/**
 *. return this.$store.getters['numbers/getOtherCounter'];
 *? getters: state, getters, rootState, rootGetters
 *? mutations: state, payload
 *? actions: context, payload
 */
