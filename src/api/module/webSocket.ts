import request from "@/utils/request.js";

const WEBSOCKET = {
  /**
   * 根据服务别名注销全部长连接
   * @description WebSocket server实例下线或重启，注销全部长连接，实例置为不可用
   * @param {string} alias - WebSocket server别名
   */
  postLogoutData: (params: object) => request({ url: "/ws/con/rest/unregister", method: "post", data: params }),

  /**
   * 根据服务别名注销全部长连接（异常）
   * @description WebSocket server实例异常，注销全部长连接
   * @param {string} alias - WebSocket server别名
   */
  postLogoutUnusualData: (params: object) => request({ url: "/ws/con/rest/unregisterFaults", method: "post", data: params }),

  /**
   * 根据应用KEY与分组注销连接
   * @description 注销指定应用的连接
   * @param {string} appKey - 应用KEY
   * @param {string | null | undefined} group - 分组
   */
  postLogoutByAppData: (params: Object) => request({ url: "/ws/con/rest/unregisterByApp", method: "post", data: params }),

  /**
   * 根据应用KEY、分组、别名、长连接ID注销指定连接
   * @description 注销指定连接
   * @param {string} appKey - 应用KEY
   * @param {string} group - 分组
   * @param {string} alias - WebSocket server别名
   * @param {string} sessionId - 长连接ID
   */
  postLogoutByIdData: (params: Object) => request({ url: "/ws/con/rest/unregisterById", method: "post", data: params }),

  /**
   * 根据应用KEY与分组查询所有长连接
   * @description 查询某应用的所有长连接
   * @param {string} appKey - 应用KEY
   * @param {string | null | undefined} group - 分组
   */
  getSearchByAppData: (params: Object) => request({ url: "/ws/con/rest/findByApp", method: "get", params })
};

export default WEBSOCKET;
