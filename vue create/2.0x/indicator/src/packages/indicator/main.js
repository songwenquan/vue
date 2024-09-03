/*
 * @Author: wqsong2
 * @Date: 2024/04/03 19:08
 * @Description:公共配置
 */
import Vue from 'vue';
// 按需引入UI库
import './plugins/ui.plugin';
// 公共样式
import '@/styles/base.less';
// 应用配置
import { sync } from 'vuex-router-sync';
import configs from './configs';
// 请求
import service from './services';
// 路由
import router from './routers';
// 状态
import store from './stores';
// 路由状态
import App from './App.vue';
// 时间插件
import Moment from 'moment'
// 解决V-HTML指令潜在的XSS攻击
import vueDOMPurifyHTML from 'vue-dompurify-html'

Vue.prototype.$moment = Moment
Vue.config.productionTip = false;
Vue.use(vueDOMPurifyHTML)
Vue.use(configs);
Vue.use(service);
sync(store, router, {
  moduleName: 'routeStore'
});
// vm 外部引用
window.scmp_vm = {};
window.scmp_vm.root = new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app');


