/*
 * @Author: wqsong2
 * @Date: 2023/10/25 18:05
 * @Desciption:菜单store配置
 */
import { searchTreeL, handleAuthMenu, searchTree } from '@/utils/arithmetic';
import auth from '@/services/modules/auth.service';
import router from '@/router/index';
import { url } from '@/utils/regexp';
export interface stateAppMenu {
	menu: string[];
	menuActiveIndex: string;
	levelList: string[];
	matched: object;
  visitedViews:[];
}
export const intialState: stateAppMenu = {
	menu: [],
	menuActiveIndex: '',
	levelList: [],
	matched: {},
  visitedViews:[]
};
let listArray:any = null
const routerListFunc = (list:any,urlArray:any) => {
  list.map((item:any)=>{
    if(item.path === urlArray){
      listArray = item
    }else if(item.children && item.children.length > 0){
      routerListFunc(item.children,urlArray)
    }
  })
}
export default {
	state: {
		menu: intialState.menu,
		menuActiveIndex: intialState.menuActiveIndex,
		levelList: intialState.levelList,
		matched: intialState.matched,
    visitedViews:intialState.visitedViews
	},
	getters: {
		// 菜单中第一个无子节点的 item
		// TODO: 应查找第一个 url 为非外链的子节点；而任意一个子节点；
		GTT_MenuFirstLeaf: (state: any) => {
			if (state.menu && state.menu !== 0) {
				const menuArr = state.menu.map((item: any) => handleAuthMenu(item, '/'));
				const result = searchTreeL({ items: menuArr }, 'items');
				return result;
			}
		},
	},
	actions: {
		async ACT_GetMenu({ commit }: { commit: any }) {
			try {
				const devResponse: any = {
					errCode: '-1',
					errMsg: 'success',
					data: [
						{
							id: 1,
							menuUrl: '/warningManagement',
							menuName: '预警记录',
							roleCode: 'szys_sadmin',
							roleName: '超级管理员',
							icon: 'icon12.png',
							iconActive: 'icon1.png',
							parentId: '',
							sortNum: 1,
							show: '',
							children: [
								{
									id: 2,
									menuUrl: '/warningManagement/record',
									menuName: '超期受理',
									roleCode: 'szys_sadmin',
									roleName: '超级管理员',
									icon: '',
									iconActive: '',
									parentId: 1,
									sortNum: 1,
									show: '',
									children: [],
								},
								{
									id: 3,
									menuUrl: '/warningManagement/completion',
									menuName: '超期办结',
									roleCode: 'szys_sadmin',
									roleName: '超级管理员',
									icon: '',
									iconActive: '',
									parentId: 1,
									sortNum: 2,
									show: '',
									children: [],
								},
							],
						},
						{
							id: 4,
							menuUrl: '/alarmManagement',
							menuName: '告警记录',
							roleCode: 'szys_sadmin',
							roleName: '超级管理员',
							icon: 'icon9.png',
							iconActive: 'icon4.png',
							parentId: '',
							sortNum: 2,
							show: '',
							children: [
								{
									id: 5,
									menuUrl: '/alarmManagement/record',
									menuName: '超期受理',
									roleCode: 'szys_sadmin',
									roleName: '超级管理员',
									icon: '',
									iconActive: '',
									parentId: 4,
									sortNum: 1,
									show: '',
									children: [],
								},
								{
									id: 6,
									menuUrl: '/alarmManagement/completion',
									menuName: '超期办结',
									roleCode: 'szys_sadmin',
									roleName: '超级管理员',
									icon: '',
									iconActive: '',
									parentId: 4,
									sortNum: 2,
									show: '',
									children: [],
								},
							],
						},
						{
							id: 7,
							menuUrl: '/systemManagement',
							menuName: '系统管理',
							roleCode: 'szys_sadmin',
							roleName: '超级管理员',
							icon: 'icon11.png',
							iconActive: 'icon6.png',
							parentId: '',
							sortNum: 3,
							show: '',
							children: [
								{
									id: 34,
									menuUrl: '/systemManagement/role',
									menuName: '角色管理',
									roleCode: 'szys_sadmin',
									roleName: '超级管理员',
									icon: '',
									iconActive: '',
									parentId: 7,
									sortNum: 1,
									show: '',
									children: [],
								},
								{
									id: 35,
									menuUrl: '/systemManagement/user',
									menuName: '用户管理',
									roleCode: 'szys_sadmin',
									roleName: '超级管理员',
									icon: '',
									iconActive: '',
									parentId: 7,
									sortNum: 2,
									show: '',
									children: [],
								},
								{
									id: 36,
									menuUrl: '/systemManagement/warningUser',
									menuName: '事项预警人员管理',
									roleCode: 'szys_sadmin',
									roleName: '超级管理员',
									icon: '',
									iconActive: '',
									parentId: 7,
									sortNum: 3,
									show: '',
									children: [],
								},
							],
						},
					],
					flag: true,
				};
				let nMenu = [];
				if (process.env.NODE_ENV === 'production') {
					const response = await auth.getMenuData();
					if (!response.data.flag) {
						return { flag: false, errCode: response.data.errCode, msg: response.data.errMsg };
					}
					nMenu = response.data && response.data.data;
				}
				const menu = process.env.NODE_ENV === 'production' ? nMenu : devResponse.data.concat(nMenu);
				menu.map((item: any) => {
					item.icon = item.icon && item.icon !== '' ? require('@/assets/images/nav/' + item.icon) : '';
					item.iconActive = item.iconActive && item.iconActive !== '' ? require('@/assets/images/nav/' + item.iconActive) : '';
				});
				commit('MUT_SetMenu', menu);
				return { flag: true, menu: menu };
			} catch (error) {
				return { flag: false, msg: '连接网络超时' };
			}
		},
		ACT_SetMenuActiveIndex({ state, commit }: { state: any; commit: any }, idx = '') {
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
						router.push(activeItems.url);
					}
				}
			}
		},
		// 选择的是 menu item 对应的path
		ACT_SelectMenuItem(root: any, path = '') {
			(path && url.test(path) && window.open(path)) || (path && router.push(path));
		},
		// 选中菜单 链路节点存储
		ACT_SetlevelList({ commit }: { state: any; commit: any }, levelList: any) {
			commit('MUT_SetlevelList', levelList);
		},
		// 选中菜单 url name存储
		ACT_SetMatched({ commit }: { state: any; commit: any }, matched: any) {
			commit('MUT_SetMatched', matched);
		},
	},
	mutations: {
		MUT_SetMenu(state: any, menu: any) {
			state.menu = [...state.menu, ...menu];
		},
		MUT_SetMenuActiveIndex(state: any, payload: any) {
			state.menuActiveIndex = payload;
		},
		MUT_SetlevelList(state: any, levelList: any) {
			state.levelList = levelList;
		},
		MUT_SetMatched(state: any, matched: any) {
			state.matched = matched;
		},
    // 添加点击过的菜单
    async MUT_SetMenuvisitedViews (state: any, urlArray: any){
      let arr = state.visitedViews.filter((item:any) => item.path === urlArray.path);
      if (arr.length == 0) {
        listArray = null
        await routerListFunc(router.options.routes,urlArray.path)
        if(listArray){
          listArray.query = urlArray.query
          state.visitedViews.push(listArray)
        }
      }
    },
    // 删除某个菜单
    MUT_DeleteMenuvisitedViews (state: any, urlArray: any){
      state.visitedViews = state.visitedViews.filter((item:any)=>item.path !== urlArray)
    }
	},
};
