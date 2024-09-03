/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:路由
 */
export default [
  // 扫码登录
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '扫码登录',
      keepAlive: false,
      fullScreen: 'login',
      requireAuth: false
    },
    component: () => import('../../views/login/index.vue'),
  },
  // 无菜单权限
  {
    path: '/permissionMenu',
    name: 'permissionMenu',
    meta: {
      title: '暂无菜单权限',
      keepAlive: false,
      isHideAside: true,
      nobread: true
    },
    component: () => import('../../views/index'),
  },
  {
    path: '/',
    component: () => import('../../views/index'),
    name: 'indicator',
    meta: {
      title: '杭州政务服务一网通办监测预警平台',
      keepAlive: false,
      showCrumb: false,
    },
    children: [
      // 工作台
      {
        path: '/workstand',
        name: 'workstand',
        meta: {
          title: '工作台',
          keepAlive: false,
          nobread: true
        },
        component: () => import('../../views/workstand/index'),
      },
      // 预警记录
      {
        path: '/warningManagement',
        redirect: '/warningManagement/record',
        meta: {
          title: '预警记录',
          keepAlive: false,
        },
        component: {
          template: `<router-view></router-view> `,
        },
        children: [
          // 超期受理预警
          {
            path: 'record',
            component: () => import('../../views/warningManagement/record.vue'),
            meta: {
              title: '超期受理',
              keepAlive: false,
            },
          },
          // 超期办结预警
          {
            path: 'completion',
            component: () => import('../../views/warningManagement/completion.vue'),
            meta: {
              title: '超期办结',
              keepAlive: false,
            },
          },
        ]
      },
    ]
  }
];
