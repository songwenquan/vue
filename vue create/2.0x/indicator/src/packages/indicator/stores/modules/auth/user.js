/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:用户信息store 获取 存储配置
 */
import Vue from 'vue';
import router from "@/packages/indicator/routers";
const vm = new Vue();

const intialState = {
  userInfo: {}
};

export default {
  state: {
    userInfo: intialState.userInfo
  },
  getters: {},
  actions: {
    async ACT_GetUserInfo({ commit }) {
      try {
        const response = await vm.$scmp_api.auth.getUserInfo();
        if (response.status === 200 && response.data.flag) {
          const data = response.data;
          const user = data.data;
          commit('MUT_SetUser', user);
          return { flag: true, user: user }
        } else {
          return { flag: false, errCode: response.data.errCode, msg: response.data.errMsg }
        }
      } catch {
        return { flag: false, msg: '连接网络超时' }
      }
    },

    ACT_Logout({ commit }) {
      commit('MUT_LogoutUser');
    },
    ACT_InitUserInfo({ commit }) {
      commit('MUT_InitUserInfo');
    },
  },
  mutations: {
    MUT_InitUserInfo(state) {
      state.userInfo = {};
    },
    MUT_SetUser(state, userInfo) {
      state.userInfo = {
        ...state.userInfo,
        ...userInfo
      };
    },
    async MUT_LogoutUser(state) {
      const response = await vm.$scmp_api.auth.logout();
      if (response.status === 200 && response.data.flag) {
        state.userInfo = {};
        router.push({
          path: "/login",
        });
      } else {
        if (response.data.errCode === '401') {
          state.userInfo = {};
          router.push({
            path: "/login",
          });
        } else if (response.data.errCode === '403') {
          console.log('403')
        }
      }
    }
  }
};
