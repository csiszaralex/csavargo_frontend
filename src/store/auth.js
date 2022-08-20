/* eslint-disable no-unused-vars */
import axios from 'axios';
import { JWK, JWS, util, JWE } from 'node-jose';
import router from '@/router';
import { setItem } from '@/utility/localStorage';
import { JWT_HOSSZABBIT_ELOTTE_SEC } from '@/config/config';

export default {
  state() {
    return {
      user: null,
      token: null,
    };
  },
  getters: {
    isLoggedIn(state) {
      return !!state.user;
    },
    getId(state, getters) {
      if (!getters.isLoggedIn) {
        return null;
      }
      return state.user.id;
    },
    getCsoport(state, getters) {
      if (!getters.isLoggedIn) {
        return null;
      }
      return state.user.csoport;
    },
    getOsztaly(state, getters) {
      if (!getters.isLoggedIn) {
        return null;
      }
      return state.user.osztaly;
    },
    isAdmin(state, getters) {
      if (!getters.isLoggedIn) {
        return false;
      }
      return state.user.osztaly === 'admin';
    },
  },
  mutations: {
    changeAuth(state, payload) {
      state.user = payload.user;
      state.token = payload.token;
    },
  },
  actions: {
    async changeAuth(ctx, { token }) {
      if (!token) {
        ctx.dispatch('logout');
        return;
      }
      try {
        //HACK Nincs Verify, csak payloadot szedi ki
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
        );
        const payload = JSON.parse(jsonPayload);
        setTimeout(() => {
          ctx.dispatch('renew');
        }, new Date(payload.exp * 1000) - new Date() - 1000 * JWT_HOSSZABBIT_ELOTTE_SEC);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setItem('token', token);
        ctx.commit('changeAuth', { user: payload, token });
      } catch (e) {
        ctx.dispatch('logout');
      }
    },
    async renew(ctx) {
      axios
        .get('/csoport/renew')
        .then(({ data }) => {
          ctx.dispatch('changeAuth', { token: data.accessToken });
        })
        .catch(() => {
          ctx.dispatch('logout');
        });
    },
    async logout(ctx) {
      ctx.commit('changeAuth', { user: null, token: null });
      localStorage.clear();
      axios.defaults.headers.common['Authorization'] = null;
      router.replace('/');
    },
  },
};
