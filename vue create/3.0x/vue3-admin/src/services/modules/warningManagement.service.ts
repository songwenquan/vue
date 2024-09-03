/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:用户 菜单 字典 登录 退出接口 isJson:是否json传参默认JSON  text:请求遮罩文字 hideLoading:是否隐藏请求遮罩
 */
import HttpClient from '@/utils/http-client';
import { config } from '@/configs/index';
const http$ = new HttpClient(config.baseUrl2);
const http$1 = new HttpClient(config.baseUrl);
export default {
	// 获取用户信息所在区划
	getLoginUserOrgInfo() {
		return http$.request({
			url: '/template/getLoginUserOrgInfo',
			method: 'post',
		});
	},
	// 获取用户信息所在区划
	getOrgListByParentId(params: any) {
		return http$.request({
			url: '/indicator/getOrgListByParentId',
			method: 'post',
			params,
		});
	},
	// 导出
	exportPdf(params: any) {
		return http$.request({
			url: '/record/exportPdf',
			method: 'get',
			params,
		});
	},
	// 列表数据
	getSsqdPage(params: any) {
		return http$1.request({
			url: '/sxkMatter/getSsqdPage',
			method: 'post',
			params,
		});
	},
};
