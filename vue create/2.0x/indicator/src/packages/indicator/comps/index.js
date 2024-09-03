/**
 * file_name: components/index.js
 * describe: 组件注册入口
 * creat_user: pengliu9<pengliu9@iflytek.com>
 * update_time: 2020-05-15  15:36:47
 **/

import Vue from 'vue';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

const requireComponent = require.context('./', true, /index.vue$/);

const reg = /\.\/(\S+)\/index\.vue$/;

requireComponent.keys().forEach(c => {
  const fileName = c.match(reg)[1];
  const componentName = upperFirst(camelCase(fileName));
  const component = requireComponent(c).default || requireComponent(c);
  Vue.component(componentName, component);
});
