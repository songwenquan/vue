/*
 * @Author: wqsong2
 * @Date: 2023/11/3 18:14
 * @Desciption:存储信息封装
 */
// cookie的封装
import Cookies from 'js-cookie';
export const cookie = {
	// 设置cookie
	set(key: string, val: any) {
		Cookies.set(key, val);
	},
	// 获取cookie
	get(key: string) {
		return Cookies.get(key);
	},
};
// window.localStorage 浏览器永久缓存
export const Local = {
  // 查看 v2.4.3版本更新日志
  setKey(key: string) {
    return `vue3-project:${key}`;
  },
  // 设置永久缓存
  set(key: string, val: any) {
    window.localStorage.setItem(Local.setKey(key), JSON.stringify(val));
  },
  // 获取永久缓存
  get(key: string) {
    let json = <string>window.localStorage.getItem(Local.setKey(key));
    return JSON.parse(json);
  },
  // 移除永久缓存
  remove(key: string) {
    window.localStorage.removeItem(Local.setKey(key));
  },
  // 移除全部永久缓存
  clear() {
    window.localStorage.clear();
  },
};
// window.localStorage 浏览器临时缓存
export const Session = {
  // 设置临时缓存
  set(key: string, val: any) {
    if (key === 'token') return Cookies.set(key, val);
    window.sessionStorage.setItem(Local.setKey(key), JSON.stringify(val));
  },
  // 获取临时缓存
  get(key: string) {
    if (key === 'token') return Cookies.get(key);
    let json = <string>window.sessionStorage.getItem(Local.setKey(key));
    return JSON.parse(json);
  },
  // 移除临时缓存
  remove(key: string) {
    if (key === 'token') return Cookies.remove(key);
    window.sessionStorage.removeItem(Local.setKey(key));
  },
  // 移除全部临时缓存
  clear() {
    Cookies.remove('token');
    window.sessionStorage.clear();
  },
};
// 获取特殊存储数据
export const storageSetting = {
  // 获取对应Key
  get(key: string,keys:any) {
    if(localStorage.getItem(key)){
      return localStorage.getItem(key)![keys]
    }
  },
};
