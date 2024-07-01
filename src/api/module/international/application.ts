import request from "@/utils/request.js";

const application = {
    /**
     * 国际应用查询
     * @description 根据筛选条件查询应用列表（除分页信息必填，其余参数均为非必填）
     * @param {string} type - 类型 
     * @param {string} name - 名称
     * @param {string} companyName - 公司名称
     * @param {string} code - 编码
     * @param {string} pageNumb
     * @param {string} pageSize
     * @returns {Promise.<response>}     * 
     */
    queryAppInfoList: (params: IQueryAppIinfoListParams): Promise<IQueryAppIinfoListResponse> => request({ url: "/i18n/rest/appInfo/queryAppInfoList", method: "get", params }),

};

export default application;
