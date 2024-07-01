import request from "@/utils/request.js";

const apiManager = {
  /**
   * 根据API名称查询对应XML数据
   * @description 根据API名称查询对应XML数据
   * @param {string} qualifiedName - API名称
   */
  getApiXmlContentData: (params: object) => request({ url: "/api/rest/getApiXmlContent", method: "get", params })
};

export default apiManager;
