import axios from 'axios';
import { Loading } from 'element-ui';
import _ from 'lodash';
import Vue from 'vue';
import qs from 'qs';
import store from '../packages/indicator/stores'
import dd from 'gdt-jsapi';
const vm = new Vue();
axios.defaults.withCredentials = true;
class HttpClient {
  // loading 指令实例
  loadingInstance;
  baseUrl;
  loadingTarget;
  requestCount = 0;
  authCode = '';
  // 默认为全局loading , baseUrl环境变量
  constructor(baseUrl = process.env.BASE_URL, loadingTarget = 'body') {
    this.baseUrl = baseUrl;
    this.loadingTarget = loadingTarget;
  }

  async getAuthCode() {
    await dd.getAuthCode({})
        .then((res) => {
          this.authCode = res.auth_code
        })
        .catch(() => {
          this.authCode = ''
        });
  }

  showLoading(target, text) {
    if (this.requestCount === 0 && !this.loadingInstance) {
      this.loadingInstance = Loading.service({
        lock: true,
        text: text || '加载中...',
        background: 'rgba(255, 255, 255, 0.5)',
        target: 'body',
        customClass: target
      });
    }
    this.requestCount++;
  }

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

  // 默认配置
  getInsideConfig(url) {
    const config = {
      baseURL: url !== undefined ? url : this.baseUrl,
      timeout: 15000,
      headers: {
      }
    };
    return config;
  }

  // 拦截器
  interceptors(instance) {
    // 请求拦截
    instance.interceptors.request.use(
        req => {

          if (!req.hideLoading) {
            this.showLoading(this.loadingTarget, req.text);
          }
          // 如果是formData将isFormData设为true
          if (req.isFormData) {
            return req
          }
          // 如果设置isJson也跳过这一步转换
          if (req.method === 'post' && !req.isJson) {
            req.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
            req.data = qs.stringify(req.data);
          }
          return req;
        },
        err => {
          this.hideLoading();
          return Promise.resolve(err);
        }
    );

    // 响应拦截器
    instance.interceptors.response.use(
        async res => {
          const data = res.data;
          this.hideLoading();
          // 跳转UAAC登录页
          if (data.errCode === '401') {
            await this.sleep(2000);
            store.dispatch('auth/user/ACT_InitUserInfo');
            vm.$scmp_router.push({
              path: '/login',
              query: {
                showQrCode: true
              }
            })
          }
          return res;

        },
        async error => {
          await this.sleep(2000);
          this.hideLoading();
          return Promise.reject(error);
        }
    );
  }

  sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  async request(options) {
    const instance = axios.create();
    await this.getAuthCode()
    options.url = options.url + '?authCode=' + this.authCode;
    // options = Object.assign(this.getInsideConfig(), options)
    // 深合并，使用 request方法时，可以对请求做任意层次配置，前者将被覆盖
    options = _.merge(this.getInsideConfig(options.baseUrl), options);
    this.interceptors(instance);
    return instance(options);
  }
  // 注 option 可支持的配置：
  // url?: string;
  // method?: Method;
  // baseURL?: string;
  // transformRequest?: AxiosTransformer | AxiosTransformer[];
  // transformResponse?: AxiosTransformer | AxiosTransformer[];
  // headers?: any;
  // params?: any;
  // paramsSerializer?: (params: any) => string;
  // data?: any;
  // timeout?: number;
  // timeoutErrorMessage?: string;
  // withCredentials?: boolean;
  // adapter?: AxiosAdapter;
  // auth?: AxiosBasicCredentials;
  // responseType?: ResponseType;
  // xsrfCookieName?: string;
  // xsrfHeaderName?: string;
  // onUploadProgress?: (progressEvent: any) => void;
  // onDownloadProgress?: (progressEvent: any) => void;
  // maxContentLength?: number;
  // validateStatus?: (status: number) => boolean;
  // maxRedirects?: number;
  // socketPath?: string | null;
  // httpAgent?: any;
  // httpsAgent?: any;
  // proxy?: AxiosProxyConfig | false;
  // cancelToken?: CancelToken;
}

export default HttpClient;
