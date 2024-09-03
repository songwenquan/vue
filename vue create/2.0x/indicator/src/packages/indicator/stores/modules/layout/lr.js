export const intialState = {
  sidebar: {
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  showSettings: false,
  fixedHeader: false,
  sidebarLogo: true
};

export default {
  state: {
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
    GTT_Sidebar: state => state.sidebar,
    GTT_Device: state => state.device
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
    MUT_ChangeSetting: (state, { key, value }) => {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        state[key] = value;
      }
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
    },
    ACT_ChangeSetting({ commit }, data) {
      commit('MUT_ChangeSetting', data);
    }
  }
};
