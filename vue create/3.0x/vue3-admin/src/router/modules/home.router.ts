/*
 * @Author: wqsong2
 * @Date: 2023/10/17 15:15
 * @Desciption:路由  keepAlive:是否缓存 fullScreen:页面布局类型  requireAuth:是否需要登录 nobread:是否显示面包屑导航  isHideAside: 是否显示侧边栏,
 * fullScreen   TCB 左侧列表布局   TCB-TOP 顶部菜单列表布局  currency 自定义布局 noTagsView 是否展示已点击菜单序列 affix 是否支持删除
 *
 */
export default [
	{
		path: '/login',
		name: 'login',
		meta: {
			title: '扫码登录',
			keepAlive: false,
			fullScreen: 'CUSTOM',
			requireAuth: false,
		},
		component: () => import('@/views/login/index.vue'),
	},
	// 无菜单权限
	{
		path: '/permissionMenu',
		name: 'permissionMenu',
		meta: {
			title: '暂无菜单权限',
			keepAlive: false,
			fullScreen: 'TCB',
			requireAuth: true,
			nobread: false,
			isHideAside: true,
		},
		component: () => import('@/views/index.vue'),
	},
	{
		path: '/',
		component: () => import('@/views/index.vue'),
		name: 'business',
		meta: {
			title: '杭州政务服务一网通办监测预警平台',
		},
		children: [
			// 预警记录
			{
				path: '/warningManagement',
				redirect: '/warningManagement/record',
				meta: {
					title: '预警记录',
				},
				children: [
					// 超期受理
					{
						path: 'record',
						component: () => import('@/views/warningManagement/record.vue'),
						meta: {
							title: '超期受理',
							keepAlive: false,
							fullScreen: 'TCB',
							requireAuth: true,
							nobread: true,
							isHideAside: true,
              affix:true,
						},
					},
					// 超期办结
					{
						path: 'completion',
						component: () => import('@/views/warningManagement/completion.vue'),
						meta: {
							title: '超期办结',
							keepAlive: false,
							fullScreen: 'TCB',
							requireAuth: true,
							nobread: true,
              affix:true,
							isHideAside: true,
						},
					},
				],
			},
		],
	},
];
