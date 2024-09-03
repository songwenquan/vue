/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:iframe配置
 */
import Vue from 'vue';
const vm = new Vue();

export const intialState = {
  isCoverIframe: 'cancelCover',
  // frame 跳转元数据
  frameRouterLocation: {}
};

export default {
  state: {
    isCoverIframe: intialState.isCoverIframe,
    frameRouterLocation: intialState.frameRouterLocation
  },
  getters: {
    GTT_FramePathGetter: state => state.frameRouterLocation.path,
    GTT_FrameRouterParamsGetter: state => state.frameRouterLocation.params
  },
  actions: {
    ACT_SetCoverFrame({ commit }, payload) {
      commit('MUT_SetIsCoverIframe', payload);
    },
    ACT_SetFrameRouter({ commit }, payload) {
      commit('MUT_SetFrameRouterLoaction', payload);

      if (payload) {
        vm.$scmp_router.push(payload);
      }
    },
    ACT_ReplaceFrameRouter({ commit }, payload) {
      commit('MUT_ReplaceFrameRouterLocation', payload);

      if (payload) {
        vm.$scmp_router.replace(payload);
      }
    }
  },
  mutations: {
    MUT_SetIsCoverIframe(state, payload) {
      state.isCoverIframe = payload;
    },
    MUT_SetFrameRouterLoaction(state, payload) {
      state.frameRouterLocation = {
        ...state.frameRouterLocation,
        ...payload
      };
    },
    MUT_ReplaceFrameRouterLocation(state, payload) {
      state.frameRouterLocation = {
        ...state.frameRouterLocation,
        ...payload
      };
    }
  }
};
