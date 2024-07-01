import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'

const supplier = {

  // 开发商页面
  queryDeveloperData: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/supplier/queryKanbanData',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    })
}
export default supplier
