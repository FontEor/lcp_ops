import request from "@/utils/request.js";
import gwApiRequest from "@/utils/gwApiRequest.js";

const report = {
  /**
   * 查询API总数统计图表数据
   * @description 根据起始日期和结束日期查询API总数统计图表数据
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   */
  getFindApiTotalData: (params: Object) => request({ url: "/stat/rest/findApiTotal", method: "get", params }),

  /**
   * 查询API新增和平均数图表数据
   * @description 根据起始日期和结束日期查询API新增和平均数图表数据
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   */
  getFindApiNewAndAverageData: (params: Object) => request({ url: "/stat/rest/findApiNewAndAverage", method: "get", params }),

  /**
   * 查询API申请总数统计图表数据
   * @description 根据起始日期、结束日期和开发商ID查询API申请总数统计图表数据
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   * @param {number} supplierId - 开发商ID
   */
  findApplyTotal: (data: [Object]) => gwApiRequest.post("/ApiDepotPlatformApiService/findApplyTotal", JSON.stringify(data)),

  /**
   * 查询API申请新增和平均数图表数据
   * @description 根据起始日期、结束日期和开发商ID查询API申请新增和平均数图表数据
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   * @param {number} supplierId - 开发商ID
   */
  findApplyNewAndAverage: (data: [Object]) => gwApiRequest.post("/ApiDepotPlatformApiService/findApplyNewAndAverage", JSON.stringify(data)),

  /**
   * 查询开发商列表
   * @description 查询开发商列表作为选择框选项
   */
  getSupplierListData: () => request({ url: "/operation/rest/getSupplierList", method: "get" }),

  /**
   * 查询API调用量列表
   * @description 根据起始日期、结束日期和API名称查询API调用量列表
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   * @param {string} qualifiedName - API名称
   * @param {number} page - 当前页码
   * @param {number} pageSize - 每页数据条数
   */
  getFindApiApplyListData: (params: Object) => request({ url: "/stat/rest/findApiApplyList", method: "get", params }),

  /**
   * 获取开发商、用户的数据统计
   * @description 根据起始日期和结束日期查询获取开发商、用户的数据统计
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   */
  getFindSupplierAndUserTotalData: (params: Object) => request({ url: "/stat/rest/findSupplierAndUserTotal", method: "get", params }),

  /**
   * 查询外部开发商每日增量和平均增量
   * @description 根据起始日期和结束日期查询外部开发商每日增量和平均增量
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   */
  getFindOutSupplierNewAndAverageData: (params: Object) => request({ url: "/stat/rest/findOutSupplierNewAndAverage", method: "get", params }),

  /**
   * 查询内部用户每日增量和平均增量
   * @description 根据起始日期和结束日期查询内部用户每日增量和平均增量
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   */
  getFindInUserNewAndAverageData: (params: Object) => request({ url: "/stat/rest/findInUserNewAndAverage", method: "get", params }),

  /**
   * 查询APP总数
   * @description 根据起始日期和结束日期查询APP总数
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   */
  getFindAppTotalData: (params: Object) => request({ url: "/stat/rest/findAppTotal", method: "get", params }),

  /**
   * 查询APP每日增量和平均新增
   * @description 根据起始日期和结束日期查询APP每日增量和平均新增
   * @param {string} startTime - 起始日期 2021-04-08
   * @param {string} endTime - 结束日期 2021-04-08
   */
  getFindAppNewAndAverageData: (params: Object) => request({ url: "/stat/rest/findAppNewAndAverage", method: "get", params }),

  /**
   * 查询评论数量
   * @description 根据网络类型和文档网址查询评论数量
   * @param {number|undefined} netWorkType - 网络类型 0:内网 1:外网 空:全部
   * @param {string} url - 文档网址
   * @param {number} sortType - 排序类型 0:倒排 1:正排
   * @param {number} sortColumn - 排序列 0:赞数排序 1:踩数排序
   * @param {number} pageNum - 当前页码
   * @param {number} pageSize - 每页数据条数
   */
  postEvaluationCountData: (data: Object) => request({ url: "/evaluation/rest/count", method: "post", data }),

  /**
   * 获得某时间范围内的下单的总量
   * @description 查询近七天的下单的总量
   * @param {number} startTime 开始时间
   * @param {number} endTime 截止时间
   */
  getPlaceAnOrderNum: (params: Object) => request({ url: "/operation/rest/queryPlaceAnOrderNum", method: "get", params }),
  /**
   * 获得已发布的API方法统计总量
   *
   */
  findApiReleaseCount: () => gwApiRequest.post("/ApiDepotPlatformApiService/findApiReleaseCount"),
  /**
   * 获得已经被申请使用了的API的数量
   */
  getIntranetExtranetApplySuccessApiCount: () => request({ url: "/api/rest/getApplySuccessApiCount", method: "get" }),
  /**
   * 内外网API申请成功的总次数,
   */
  getIntranetExtranetApiApplySuccessCount: () => request({ url: "/api/rest/getIntranetExtranetApiApplySuccessCount", method: "get" })
};

export default report;
