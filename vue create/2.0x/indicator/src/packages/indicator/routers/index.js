/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:路由配置
 */
import Vue from 'vue';
import Router from 'vue-router';
import store from '../stores'
import { checkPermission } from '@utils/utils'
/* ---start: 顶部进度条加载 --- */
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
});

/* ---end --- */

// hack router push callback
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => err);
};

/* ---end --- */
Vue.use(Router);

let routerModule = [
  // 配置入口 route, 用来控制 / 自动跳转，也可以不配置。
  {
    path: '/',
    redirect: "/login"
  }
];

const requireRouters = require.context('./', true, /^((?!index|\.unit\.).)*\.js$/);
requireRouters.keys().forEach(r => {
  routerModule = routerModule.concat(...requireRouters(r).default);
});

/* ---ebd: --- */
const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [...routerModule]
});
// 判断主体路由模板
function fullScreen(to, next, url) {
  if (to.meta.fullScreen) {
    store.commit('layout/ly/MUT_SetLayout', 'FULL')
    return url ? next(url) : next()
  } else {
    store.commit('layout/ly/MUT_SetLayout', 'TCB')
    return url ? next(url) : next()
  }
}
// 判断菜单权限
async function menusFunc(to, next) {
  let menus = []
  if (store.state.auth.menu.menu && store.state.auth.menu.menu.length > 0) {// 判断是否有菜单数据
    menus = store.state.auth.menu.menu
  } else {
    const menu = await store.dispatch('auth/menu/ACT_GetMenu')
    if (menu.flag === true) {
      menus = menu.menu
    } else {
      Vue.prototype.$message.error(menu.msg, 3000);
    }
  }
  if (process.env.NODE_ENV === 'production' && to.path !== '/permissionMenu' && checkPermission('menuUrl', to.path, menus) === -1) { // 没有该菜单权限
    Vue.prototype.$message.error('暂无该菜单权限，请重新扫码登录', 3000);
    fullScreen(to, next, '/permissionMenu')
  } else {
    fullScreen(to, next)
  }
}
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // console.log(store.state.auth.user,store.state.auth.menu.menu,to,from,checkPermission)
  // TODO: 权限验证（结合 menu store）
  // 判断是否为需要登录的页面
  if (to.meta.requireAuth === false || to.path === '/' || to.path === '/login' || process.env.NODE_ENV !== 'production') {
    fullScreen(to, next)
  } else {
    if (store.state.auth.user.userInfo.employeeCode) { // 判断是否有登录信息
      await menusFunc(to, next)
    } else {
      const user = await store.dispatch('auth/user/ACT_GetUserInfo')
      if (user.flag === true) {
        await menusFunc(to, next)
      } else {
        if (user.errCode === '401') {
          Vue.prototype.$message.error(user.msg, 3000);
          return next('/login')
        } else {
          Vue.prototype.$message.error(user.msg, 3000);
        }
      }
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

// 注册$scmp_router，方便在js中引用
Object.defineProperty(Vue.prototype, '$scmp_router', {
  enumerable: true,
  get() {
    return router;
  }
});

export default router;
