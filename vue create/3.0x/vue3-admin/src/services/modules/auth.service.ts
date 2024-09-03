/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:用户 菜单 字典 登录 退出接口 isJson:是否json传参默认JSON  text:请求遮罩文字 hideLoading:是否隐藏请求遮罩
 */
import HttpClient from '@/utils/http-client';
import { config } from '@/configs/index';
const http$ = new HttpClient(config.baseUrl);
export default {
	// 获取用户信息
	getUserInfo() {
		return http$.request({
			url: '/getUserInfo',
			method: 'post',
		});
	},
	// 获取字典信息
	dicts(params: any) {
		return http$.request({
			url: '/dic/getDictionarys',
			method: 'post',
			params,
			isFormData: true,
		});
	},
	// 获取字典信息
	dictsDelivery(params: any) {
		return http$.request({
			url: '/qstb/delivery/getDictionarys',
			method: 'post',
			params,
			isFormData: true,
		});
	},
	// 获取菜单
	getMenuData() {
		return http$.request({
			url: '/getNavData',
			method: 'post',
		});
	},
	// 退出登录
	logout() {
		return http$.request({
			url: '/system/logout',
			method: 'post',
		});
	},
};
