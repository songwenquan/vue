/*
* @Author: wqsong2
* @Date: 2023/10/17 15:15
* @Desciption:路由  keepAlive:是否缓存 fullScreen:页面布局类型  requireAuth:是否需要登录 nobread:是否显示面包屑导航  isHideAside: 是否显示侧边栏,
* fullScreen   TCB 左侧列表布局  NEXT 顶部菜单列表布局  currency 自定义布局 noTagsView 是否展示已点击菜单序列 affix 是否支持删除
* */
export default  [
  {
    path: '/loginAdmin',
    name: 'loginAdmin',
    component: () => import('@/views/login/loginAdmin.vue'),
    meta: {
      fullScreen:'CUSTOM',
      isKeepAlive: false,
      title: 'staticRoutes.signIn',
    },
  },
  {
    path: '/',
    component: () => import( '@/views/next.vue'),
    name: 'vue3-next-admin',
    meta: {
      title: 'vue3-next-admin',
    },
    children:[
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          fullScreen:'NEXT',
          title: 'router.home',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: true,
          isIframe: false,
          affix:true,
          roles: ['admin', 'common'],
          icon: 'iconfont icon-shouye',
        }
      }
    ]
  }
]

