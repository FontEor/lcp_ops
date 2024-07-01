import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'

const cycle = {

  searchUserJoinUp: (data: [Object]) =>
    gwSmartLogRequest({
      url: '/cycle/searchUserJoinUp',
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'LOP-DN': window.env.gatewaySmartLogLopDn,
        'Account-Type': 'erp'
      }
    })

}

export default cycle
