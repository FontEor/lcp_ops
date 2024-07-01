import bu from "./module/bu";
import login from "./module/login";
import webSocket from "./module/webSocket";
import apiManager from "./module/apiManager";
import report from "./module/report";
import application from "./module/international/application";
import sandbox from "./module/sandbox";

// 统一注册API
const API = { ...bu, ...login, webSocket, apiManager, report, application, sandbox };

export default API;
