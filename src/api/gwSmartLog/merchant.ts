import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'

const merchant = {
  /**
     * 商家量数据面板
     *  getMerchantChartData:获取商家量统计数据、
     */
  getMerchantChartData: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/merchant/getMerchantChartData',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  getMerchantSimpleDescData: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/merchant/getMerchantSimpleDescData',
      method: 'post',
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    })

}

export default merchant
