import request from "@/utils/request.js";

const whiteList = {
  /**
   * 查询白名单接口
   */
  getJosPinWhileList: (data: Object) => request({ url: "/platform/rest/jospinwhitelist/getJosPinWhileList", method: "post", data}),
  /**
   * 添加白名单接口
   */
  insertJosPinWhileList: (data: Object) => request({ url: "/platform/rest/jospinwhitelist/insertJosPinWhileList", method: "post", data }),
  /**
   * 更新白名单接口
   */
  updateJosPinWhiteList: (data: Object) => request({ url: "/platform/rest/jospinwhitelist/updateJosPinWhiteList", method: "post", data }),
  /**
   * 删除白名单接口
   */
  deleteJosPinWhiteListById: (params: Object) => request({ url: "/platform/rest/jospinwhitelist/deleteJosPinWhiteListById", method: "get", params })
};

export default whiteList;
