import Vue from 'vue';
import Vuex from 'vuex';
import camelCase from 'lodash/camelCase';

Vue.use(Vuex);

const storeData = {
  modules: {},
  plugins: []
};

const requireModule = require.context('.', true, /^((?!index|\.unit\.).)*\.js$/);

requireModule.keys().forEach(fileName => {
  const moduleDefinition = requireModule(fileName).default || requireModule(fileName);
  const modulePath = fileName
      .replace(/^\.\/modules\//, '')
      .replace(/(\.store)?\.\w+$/, '')
      .split(/\//)
      .map(camelCase);

  const { modules } = getNamespace(storeData, modulePath);

  modules[modulePath.pop()] = {
    namespaced: true,
    ...moduleDefinition
  };
});

function getNamespace(subtree, path) {
  if (path.length === 1) {
    return subtree;
  }

  const namespace = path.shift();
  subtree.modules[namespace] = {
    modules: {},
    namespaced: true,
    ...subtree.modules[namespace]
  };
  return getNamespace(subtree.modules[namespace], path);
}

const store = new Vuex.Store(storeData);

Object.defineProperty(Vue.prototype, '$scmp_store', {
  enumerable: true,
  get() {
    return store;
  }
});

export default store;
