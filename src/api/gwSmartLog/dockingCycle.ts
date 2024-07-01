import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'
import request from '@/utils/request.js'

const dockingCycle = {

  getAppDockingSchemeData: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/dockingScheme/getAppDockingSchemeData',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    }),
  queryBizUnitList: () => request({ url: '/platform/rest/bizApi/queryBizUnitList', method: 'get' })
}

export default dockingCycle
