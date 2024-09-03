/*
 * @Author: wqsong2
 * @Date: 2023/7/25 19:08
 * @Description:用户 菜单 字典 登录 退出接口 isJson:是否json传参默认JSON  text:请求遮罩文字 hideLoading:是否隐藏请求遮罩
 */
import HttpClient from '@/utils/http-client';
import { config } from '../../configs/index';
const http$ = new HttpClient(config.baseUrl);

export default {
  // 获取用户信息
  getUserInfo() {
    return http$.request({
      url: '/user/info',
      method: 'post'
      // baseURL: '/bog-factory-cms' // mock情况可以层叠
    });
  },
  // 用户回调
  callback(params) {
    return http$.request({
      url: '/user/callback',
      method: 'post',
      data: params,
      isJson:false
    });
  },
  // 退出登录
  logout() {
    return http$.request({
      url: '/system/logout',
      method: 'post'
    });
  },
  // 获取菜单
  getMenuData(){
    return http$.request({
      url: '/system/menus',
      method: 'post'
    });
  },
  // 获取字典
  dicts(params){
    return http$.request({
      url: '/system/dicts',
      method: 'post',
      data: params,
      isJson:false
    });
  },
  // 部门 名称列表  查询组织树
  selectDeptName(params){
    return http$.request({
      url: '/org/list',
      method: 'post',
      hideLoading:true,
      data: params,
      isJson:false
    });
  },
};
