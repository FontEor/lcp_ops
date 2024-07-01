import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'

const apiHealth = {

    getAPIHealthDashboardData: (data: [Object]) =>
        gwSmartLogRequest({
            url: '/apiScore/getAPIHealthDashboardData',
            method: 'post',
            data: JSON.stringify(data),
            headers: {
                'LOP-DN': window.env.gatewaySmartLogLopDn,
                'Account-Type': 'erp'
            }
        }),
}

export default apiHealth
