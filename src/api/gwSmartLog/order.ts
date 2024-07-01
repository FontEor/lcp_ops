import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'

const order = {

  // 订单页面
  searchOrder: () =>
    gwSmartLogRequest({
      url: '/order/searchOrder',
      method: 'post',
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  searchOrderAVGWeekCPW: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/order/searchOrderAVGWeekCPW',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  searchOrderAVGWeekIDP: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/order/searchOrderAVGWeekIDP',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    })

}
export default order
