import axios from "axios";
import { Message } from "@lui/lui-ui";
import { UserModule } from "@/store/modules/user";

const service = axios.create({
  // baseURL: "/", // url = base url + request url
  timeout: 5000,
  withCredentials: true // 跨域时需要带上cookie需要开启
});

// 不需要拦截响应错误的url白名单
const urlWhiteList: any[] = ["/api/verifyTicket", "/erp/login", "/erp/logout", "/oidc/authorize"];

// Request 拦截
service.interceptors.request.use(
  (config: any) => {
    config.headers["X-Requested-With"] = "XMLHttpRequest";

    // 白名单内不校验拦截器
    if (urlWhiteList.some(item => config.url.indexOf(item) > -1)) {
      return config;
    }
    if (UserModule.token) {
      config.headers["X-Access-Token"] = UserModule.token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// Response 拦截
service.interceptors.response.use(
  (response: any) => {
    const res = response.data;
    // 白名单内不校验拦截器
    if (urlWhiteList.some(item => response.config.url.indexOf(item) > -1)) {
      return res;
    }
    // 业务接口统一处理response异常
    if (res.code) {
      switch (res.code) {
        case 2:
        case 65:
          Message("网络拥挤，请稍候再试~");
          break;
        case 120:
          Message("您的账号存在安全风险，请联系客服~");
          break;
        default:
          // 条件 code !== 142 && code !== 143
          Message("系统开小差了，请稍候再试~");
          break;
      }
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res;
  },
  async error => {
    if (error.response && error.response.status === 401) {
      const {
        headers: { location = "" },
        config
      } = error.response;
      const {
        data: { type, value = "" }
      } = await service.get(location);
      if (type === "OIDC_CODE") {
        const _config = { ...config };
        _config.params ? (_config.params.code = value) : (_config.params = { code: value });

        return service.request(_config);
      }
    } else {
      Message({
        message: error.message,
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(error);
    }
  }
);

export default service;
