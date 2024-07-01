import axios from "axios";
import { Message, MessageBox } from "@lui/lui-ui";
import store from "@/store";

let reLoginDialogVisible = false;
// create an axios instance
const gwSmartLogRequest = axios.create({
  // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
  baseURL: window.env.gatewayApiBaseUrl, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    "LOP-DN": window.env.gatewaySmartLogLopDn,
    "Account-Type": "erp"
  }
});

gwSmartLogRequest.interceptors.request.use(
  config => {
    // config.headers["groupCode"] = "";
    return config;
  },
  error => {
    console.log("gwSmartLogRequest", error); // for debug
    return Promise.reject(error);
  }
);

gwSmartLogRequest.interceptors.response.use(
  response => {
    console.log('responseaaaaa', response)
    const { status } = response;
    const { error_response } = response.data;
    if (error_response) {
      Message.error("服务异常");
      return Promise.reject(response);
    }
    if (status === 401 || status === 520) {
      if (!reLoginDialogVisible) {
        reLoginDialogVisible = true;
        reLogin();
      }
      return Promise.reject(response);
    }

    if (response.data) {
      const { code, msg } = response.data;
      if (code === 1) {
        return response.data;
      } else {
        msg && Message.error(msg);
        return Promise.reject(response.data);
      }
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    const { status } = error.response;
    const { error_response } = error.response.data;
    if (error_response) {
      Message.error("服务异常");
    }
    if (status === 401 || status === 520) {
      if (!reLoginDialogVisible) {
        reLoginDialogVisible = true;
        reLogin();
      }
    }
    return Promise.reject(error.response);
  }
);

async function reLogin() {
  await UserModule.SET_LOGINSTATE(false);
  MessageBox.confirm("您的登录状态已失效，是否重新登录？", "提示", {
    confirmButtonText: "登录",
    cancelButtonText: "不登录",
    type: "warning"
  })
    .then(() => {
      reLoginDialogVisible = false;
      store.dispatch("user/resetToken").then(() => {
        location.reload();
      });
    })
    .catch(() => {
      reLoginDialogVisible = false;
    });
}

export default gwSmartLogRequest;