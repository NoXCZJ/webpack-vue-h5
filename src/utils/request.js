import axios from 'axios';
import { Toast } from 'vant';
// import store from '@/store';
import { getToken } from '@/utils/auth';
import CONFIG from '@/utils/config';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

// create an axios instance
const service = axios.create({
  baseURL: CONFIG.BaseUrl + CONFIG.requestPath, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
  validateStatus: function(status) {
    if (!(status >= 200 && status < 300)) {
      Toast({
        position: 'bottom',
        message: codeMessage[status]
      });
    }
    return status >= 200 && status < 300; // 状态码在大于或等于500时才会 reject
  }
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    console.log(config);

    if (config.params && config.params.noloading !== false) {
      Toast.loading({
        mask: true,
        duration: 0,
        message: '请稍候...'
      });
    }

    const token = getToken();

    if (config.headers['token'] !== 0 && token) {
      // let each request carry token
      // ['token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = token;
    }
    return config;
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // console.log(res);

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Toast({
        position: 'bottom',
        message: res.msg
      });

      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      Toast.clear();
      return res;
    }
  },
  error => {
    console.log('err', error); // for debug
    Toast('请求失败' + error.message);
    return Promise.reject(false);
  }
);

export default service;
