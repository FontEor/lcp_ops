import request from "@/utils/request.js";
import { IClassificationRequest } from "../types/classification";

// const mockUrl = "/mock/37";
const mockUrl = "";

export const classificationRequest: IClassificationRequest.request = {
    /**
  * 对接方案分类-查询列表
  * @description
  * @param {} 
  */
  queryBusinessTypeList: (params) => request({ url: mockUrl + "/i18n/rest/businessType/queryBusinessTypeList", method: "get", params }),
  saveBusinessType: (data) => request({ url: mockUrl +  "/i18n/rest/businessType/saveBusinessType", method: 'post', data}),
  getBusinessType: (params) => request({ url: mockUrl + '/i18n/rest/businessType/getBusinessType', method: 'get', params}),
  deleteBusinessTypeCheck: (data) => request({ url: mockUrl + "/i18n/rest/businessType/deleteBusinessTypeCheck", method: 'post', data}),
  deleteBusinessType: (params) => request({ url: mockUrl + '/i18n/rest/businessType/deleteBusinessType', method: 'get', params})

}
