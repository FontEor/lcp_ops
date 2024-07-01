import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'

const nps = {
  /**
   * 查询服务覆盖率
   */
  query: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/nps/query',
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
      url: '/nps/get',
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
      url: '/nps/update',
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
      url: '/nps/create',
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
      url: '/nps/delete',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  // 用户体验页面请求
  /**
     * 查询时间段内nps周平均量评分
     */
  queryKanbanData: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/nps/queryKanbanData',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    })
}

export default nps
