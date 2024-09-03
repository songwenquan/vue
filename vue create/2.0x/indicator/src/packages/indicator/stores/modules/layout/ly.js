const lyMap = {
  // th: 头部高度、fh: 尾部高度、sow:侧边栏展开宽度、scw: sideNav collapsed width
  TLR: { th: 60, fh: 40, sow: 200, scw: 40 },
  // 折叠 54px 下，默认图标居中
  LR: { th: 50, fh: 40, sow: 200, scw: 54 },
  TCB: { th: 60, fh: 40, sow: 0, scw: 0 }
};

export const intialState = {
  layout: 'TCB', // TCB 左侧列表布局   TCB-TOP 顶部菜单列表布局 FULL 自定义布局
  sidebar: {
    opened: false,
    withoutAnimation: false
  },
  device: 'desktop',
  fixedHeader: false,
  sidebarLogo: true
};

export default {
  state: {
    layout: intialState.layout,
    sidebar: {
      opened: intialState.sidebar.opened,
      withoutAnimation: intialState.sidebar.withoutAnimation
    },
    device: intialState.device,
    showSettings: intialState.showSettings,
    fixedHeader: intialState.fixedHeader,
    sidebarLogo: intialState.sidebarLogo
  },
  getters: {
    isSidebarOpend: state => state.sidebar.opened,
    layout: state => state.layout,
    th: (state, getters) => lyMap[getters.layout].th,
    fh: (state, getters) => lyMap[getters.layout].fh,
    sw: (state, getters) => (getters.isSidebarOpend ? lyMap[getters.layout].sow : lyMap[getters.layout].scw)
  },
  mutations: {
    MUT_ToggleSideBar: state => {
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    MUT_CloseSideBar: (state, withoutAnimation) => {
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    MUT_ToggleDevice: (state, device) => {
      state.device = device;
    },
    MUT_SetLayout: (state, val) => {
      state.layout = val
    }
  },
  actions: {
    ACT_ToggleSideBar({ commit }) {
      commit('MUT_ToggleSideBar');
    },
    ACT_CloseSideBar({ commit }, { withoutAnimation }) {
      commit('MUT_CloseSideBar', withoutAnimation);
    },
    ACT_ToggleDevice({ commit }, device) {
      commit('MUT_ToggleDevice', device);
    }
  }
};
