import request from "@/utils/request.js";

const i18n = {
  rest: {
    loggingTool: {
      /**
       * 运维端-日志工具-查询日志表格数据
       *
       * @see {@link YApi http://11.51.194.248:3000/project/37/interface/api/1136}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       *
       * @param {Object} data 请求参数
       * @param {number} data.pageNumb - 页码
       * @param {number} data.pageSize - 每页数据条数
       * @param {string} data.appKey - AppKey
       * @param {string} data.unitCode - 对接方案编码
       * @param {string} data.url - API的URI
       * @param {string} data.startTime - 时间范围起始时间戳
       * @param {string} data.endTime - 时间范围截止时间戳
       * @param {string} data.envSite - 运行环境 "prod":当前环境 "uat":影盒环境
       * @returns {Promise.<Response>} 表示查询日志表格数据返回的Promise对象
       */
      queryAppLogsList: (data?: object): Promise<Response> => request.post("/i18n/rest/loggingTool/queryAppLogsList", data),

      /**
       * 运维端-日志工具-查询日志详情数据
       *
       * @see {@link YApi http://11.51.194.248:3000/project/37/interface/api/1137}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       * @property {string} Response.data.requestMethod - 请求方式
       * @property {string} Response.data.request - 请求报文
       * @property {string} Response.data.response - 响应报文
       * @property {string} Response.data.errorMsg - 异常描述
       *
       * @param {Object} data 请求参数
       * @param {string} data.appKey - AppKey
       * @param {number} data.id - 日志ID
       * @param {string} data.envSite - 运行环境 "prod":当前环境 "uat":影盒环境
       * @returns {Promise.<Response>} 表示查询日志表格数据返回的Promise对象
       */
      selectAppLogDetail: (data?: object): Promise<Response> => request.post("/i18n/rest/loggingTool/selectAppLogDetail", data)
    },
    bizOrder: {
      /**
       * 根据 AppKey 查询运维端-日志工具-顶部表单的对接方案选择框选项列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/37/interface/api/1138}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       * @property {string} Response.data[].unitId - 对接方案ID
       * @property {string} Response.data[].unitCode - 对接方案编码
       * @property {string} Response.data[].unitName - 对接方案名称
       * @property {boolean} Response.data[].hasUat - 是否具有影盒环境
       *
       * @param {Object} params 请求参数
       * @param {number} params.appKey - AppKey
       * @returns {Promise.<Response>} 表示根据AppKey查询对接方案选择框选项列表数据返回的Promise对象
       */
      queryApprovedRecordList: (params: object): Promise<Response> => request.get("/i18n/rest/bizOrder/queryApprovedRecordList", { params })
    },
    bizApi: {
      /**
       * 根据AppKey与对接方案ID查询URI列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/37/interface/api/1139}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       * @property {string} Response.data[].apiUrl - API的URI
       *
       * @param {Object} params 请求参数
       * @param {string} params.appKey - AppKey
       * @param {string} params.unitId - 对接方案ID
       * @returns {Promise.<Response>} 表示根据AppKey与对接方案ID查询URI列表的Promise对象
       */
      queryOuterBizOrderApiList: (params?: object): Promise<Response> => request.get("/i18n/rest/bizApi/queryOuterBizOrderApiList", { params })
    }
  }
};

export default i18n;
