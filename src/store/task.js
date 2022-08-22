/* eslint-disable no-unused-vars */
import axios from 'axios';
import { JWK, JWS, util, JWE } from 'node-jose';
import router from '@/router';
import { setItem } from '@/utility/localStorage';
import { JWT_HOSSZABBIT_ELOTTE_SEC } from '@/config/config';

export default {
  state() {
    return {
      taskId: null,
      code: null,
    };
  },
  getters: {
    getTask(state) {
      if (!state.taskId) {
        return null;
      }
      return state.taskId;
    },
    getCode(state) {
      if (!state.code) {
        return null;
      }
      return state.code;
    },
  },
  mutations: {
    changeTask(state, payload) {
      state.taskId = payload.taskId;
      state.code = payload.code;
    },
  },
  actions: {
    changeTask(ctx, { taskId, code }) {
      ctx.commit('changeTask', { taskId, code });
    },
  },
};
