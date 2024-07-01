import request from "@/utils/request.js";

const biz = {
  rest: {
    bizOrder: {
      /**
       * 根据 AppKey 查询运维端-日志工具-顶部表单的对接方案选择框选项列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1006}
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
      queryApprovedRecordList: (params: object): Promise<Response> => request.get("/biz/rest/bizOrder/queryApprovedRecordList", { params })
    }
  }
};

export default biz;
