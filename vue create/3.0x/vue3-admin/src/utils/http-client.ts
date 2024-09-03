/*
 * @Author: wqsong2
 * @Date: 2023/10/9 16:53
 * @Desciption:axios 拦截器封装
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ElLoading } from 'element-plus';
import _ from 'lodash';
import qs from 'qs';
axios.defaults.withCredentials = true;
class HttpClient {
	baseUrl: any;
	loadingInstance: any;
	loadingTarget: any;
	requestCount = 0;

	// 默认为全局loading , baseUrl环境变量
	constructor(baseUrl = process.env.BASE_URL, loadingTarget = 'body') {
		this.baseUrl = baseUrl;
		this.loadingTarget = loadingTarget;
	}

	// 显示loading
	showLoading(target: string, text: any) {
		if (this.requestCount === 0 && !this.loadingInstance) {
			this.loadingInstance = ElLoading.service({
				lock: true,
				text: text || '加载中...',
				background: 'rgba(255, 255, 255, 0.5)',
				target: 'body',
				customClass: target,
			});
		}
		this.requestCount++;
	}

	// 隐藏loadin
	hideLoading() {
		this.requestCount--;
		this.requestCount = Math.max(this.requestCount, 0);
		if (this.requestCount === 0) {
			_.debounce(() => {
				this.loadingInstance && this.loadingInstance.close();
				this.loadingInstance = null;
			}, 800).apply(this);
		}
	}

	// 拦截器
	interceptors(instance: AxiosInstance) {
		// 请求拦截
		instance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				if (!config.hideLoading) {
					this.showLoading(this.loadingTarget, config.text);
				}
				if (config.isFormData) {
					return config;
				}
				// 如果设置isJson也跳过这一步转换
				if (config.method === 'post' && !config.isJson) {
					config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
					config.data = qs.stringify(config.data);
				}
				return config;
			},
			(error) => {
				this.hideLoading();
				return Promise.resolve(error);
			}
		);
		// 响应拦截器
		instance.interceptors.response.use(
			async (res: AxiosResponse) => {
				this.hideLoading();
				if (res.status === 200) {
					return res.data;
				} else {
					throw new Error('网络链接超时');
				}
			},
			async (error) => {
				await this.sleep(2000);
				this.hideLoading();
				return Promise.reject(error);
			}
		);
	}

	sleep(ms: number) {
		return new Promise(function (resolve) {
			setTimeout(resolve, ms);
		});
	}

	// 默认配置
	getInsideConfig(url: any) {
		const config = {
			baseURL: url !== undefined ? url : this.baseUrl,
			timeout: 15000,
			headers: {
				// 默认header
			},
		};
		return config;
	}

	request(options: any) {
		const instance: AxiosInstance = axios.create();
		// options = Object.assign(this.getInsideConfig(), options)
		// 深合并，使用 request方法时，可以对请求做任意层次配置，前者将被覆盖
		options = _.merge(this.getInsideConfig(options.baseUrl), options);
		this.interceptors(instance);
		return instance(options);
	}
}
export default HttpClient;
