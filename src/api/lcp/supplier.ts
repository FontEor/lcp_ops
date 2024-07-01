import request from "@/utils/request.js";

const supplier = {
  user: {
    rest: {
      /**
       * 根据团队名称查询团队信息列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1015}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       * @property {Object[]} Response.data.list - 团队信息列表
       * @property {number} Response.data.list[].id - 团队信息ID
       * @property {string} Response.data.list[].name - 团队名称
       * @property {string} Response.data.list[].code - 团队编码
       * @property {string} Response.data.list[].managerPin - 管理员pin
       * @property {string} Response.data.list[].updateUser - 更新人
       * @property {string} Response.data.list[].updateTime - 更新时间
       *
       * @param {Object} params 请求参数
       * @param {number} params.name - 团队名称
       * @param {number} params.pageNumb - 当前页码
       * @param {number} params.pageSize - 每页数据条数
       * @returns {Promise.<Response>} 表示根据AppKey查询对接方案选择框选项列表数据返回的Promise对象
       */
      querySupplierList: (params: object): Promise<Response> => request.get("/supplier/user/rest/querySupplierList", { params }),

      /**
       * 根据团队ID修改指定团队的管理员
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1021}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       *
       * @param {Object} params 请求参数
       * @param {string} params.supplierId - 团队ID
       * @param {string} params.erp - 新管理员的ERP
       * @returns {Promise.<Response>} 表示根据AppKey查询对接方案选择框选项列表数据返回的Promise对象
       */
      updateSupplierManager: (params: object): Promise<Response> =>
        request.post("/supplier/user/rest/updateSupplierManager", null, {
          headers: { "content-type": "application/x-www-form-urlencoded" },
          params
        })
    }
  }
};

export default supplier;
