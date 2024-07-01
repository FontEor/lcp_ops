import gwApiRequest from "@/utils/gwApiRequest.js";

const messagePlatformApproveService = {
    // 消息发布审核列表
    searchMessageLog: (data: [Object]) =>
        gwApiRequest({
            url: '/MessageLogService/searchMessageLog',
            method: 'post',
            data: JSON.stringify(data),
            headers: {
                'LOP-DN': 'LOP_MESSAGE_WEB',
                'Account-Type': 'erp'
            }
        }),
    // 消息审批
    approvePublish: (data: [Object]) =>
        gwApiRequest({
            url: '/MessagePlatformApproveService/approvePublish',
            method: 'post',
            data: JSON.stringify(data),
            headers: {
                'LOP-DN': 'LOP_MESSAGE_WEB',
                'Account-Type': 'erp'
            }
        }),
    // 查询消息文档
    queryDoc: (data: [Object]) =>
        gwApiRequest({
            url: '/MessageAccessService/queryDoc',
            method: 'post',
            data: JSON.stringify(data),
            headers: {
                'LOP-DN': 'LOP_MESSAGE_WEB',
                'Account-Type': 'erp'
            }
        }),
}

export default messagePlatformApproveService
