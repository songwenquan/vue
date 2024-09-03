/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:菜单store 获取 存储配置
 */
import { searchTree, searchTreeL, handleAuthMenu } from '@utils/arithmetic';
import { url } from '@utils/regexp';

import Vue from 'vue';
const vm = new Vue();

export const intialState = {
  menu: [],
  menuActiveIndex: '',
  levelList: [],
  matched: {}
};

export default {
  state: {
    menu: intialState.menu,
    menuActiveIndex: intialState.menuActiveIndex,
    levelList: intialState.levelList,
    matched: intialState.matched
  },
  getters: {
    // 菜单中第一个无子节点的 item
    // TODO: 应查找第一个 url 为非外链的子节点；而任意一个子节点；
    GTT_MenuFirstLeaf: state => {
      if (state.menu && state.menu !== 0) {
        const menuArr = state.menu.map(item => handleAuthMenu(item, '/'));
        const result = searchTreeL({ items: menuArr }, 'items');
        return result;
      }
    }
  },
  actions: {
    async ACT_GetMenu({ commit }) {
      try {
        const devResponse = {
          flag: true,
          data: {
            items: [],
          },
        };
        let nMenu = []
        const response = await vm.$scmp_api.auth.getMenuData();
        if (!response.data.flag) {
          return { flag: false, errCode: response.data.errCode, msg: response.data.errMsg }
        }
        nMenu = response.data && response.data.data;
        const menu = process.env.NODE_ENV === 'production' ? nMenu : devResponse.data.items.concat(nMenu);
        menu.map(item => {
          item.icon = item.icon && item.icon !== "" ? require("@indicator/assets/img/nav/" + item.icon) : "";
          item.iconActive = item.iconActive && item.iconActive !== "" ? require("@indicator/assets/img/nav/" + item.iconActive) : "";
        })
        commit('MUT_SetMenu', menu);
        return { flag: true, menu: menu }
      } catch (error) {
        return { flag: false, msg: '连接网络超时' }
      }
    },
    ACT_SetMenuActiveIndex({ state, commit }, idx = '') {
      const menuArr = state.menu;
      commit('MUT_SetMenuActiveIndex', idx);
      if (menuArr.length !== 0) {
        const activeItems = searchTree({ id: '', items: menuArr }, 'id', idx);
        commit('MUT_SetMenuActiveIndex', idx);
        if (activeItems && activeItems.url) {
          if (activeItems.url.includes('http')) {
            // 如果是外部链接直接打开
            window.open(activeItems.url);
          } else {
            vm.$scmp_router.push(activeItems.url);
          }
        }
      }
    },
    // 选择的是 menu item 对应的path
    ACT_SelectMenuItem(root, path = '') {
      (path && url.test(path) && window.open(path)) || (path && vm.$scmp_router.push(path));
    },
    // 选中菜单 链路节点存储
    ACT_SetlevelList({ state, commit }, levelList) {
      commit('MUT_SetlevelList', levelList);
    },
    // 选中菜单 url name存储
    ACT_SetMatched({ state, commit }, matched) {
      commit('MUT_SetMatched', matched);
    }
  },
  mutations: {
    MUT_SetMenu(state, menu) {
      state.menu = menu;
    },
    MUT_SetMenuActiveIndex(state, payload) {
      state.menuActiveIndex = payload;
    },
    MUT_SetlevelList(state, levelList) {
      state.levelList = levelList
    },
    MUT_SetMatched(state, matched) {
      state.matched = matched
    }
  }
};
