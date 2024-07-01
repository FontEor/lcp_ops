import gwSmartLogRequest from '@/utils/gwSmartLogRequest.js'

const conversionFunnel = {

    getConvertFunnelSchemeData: (data: [Object]) =>
        gwSmartLogRequest({
            url: '/dockingScheme/getConvertFunnelSchemeData',
            method: 'post',
            data: JSON.stringify(data),
            headers: {
                'LOP-DN': window.env.gatewaySmartLogLopDn,
                'Account-Type': 'erp'
            }
        }),
}

export default conversionFunnel
