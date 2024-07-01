import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'

const service = {
  /**
   * 查询服务覆盖率
   */
  query: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/service/query',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  /**
   * 查询服务覆盖率详情
   */
  get: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/service/get',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  /**
   * 更新服务覆盖率
   * @param data
   * @returns
   */
  update: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/service/update',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  /**
   * 创建服务覆盖率
   * @param data
   * @returns
   */
  create: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/service/create',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  /**
   * 删除服务覆盖率
   * @param data
   * @returns
   */
  delete: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/service/delete',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  /**
     * 查询服务覆盖率
     * @param data
     */
  queryKanbanData: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/service/queryKanbanData',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    })

}

export default service
