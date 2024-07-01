import request from "@/utils/request.js";
import { IquestionMaintainRequest } from "./types/questionMaintain";

// const mockUrl = "/mock/5";
const mockUrl = "";

export const questionRequest: IquestionMaintainRequest.request = {
    // 运维端-平台内容管理-常见问题维护
    queryQuestionList: (data) => request({ url: `${mockUrl}/platform/rest/workOrderQuestion/queryQuestionList`, method: "post", data }),
    queryWorkOrderTypeList: (params) => request({ url: `${mockUrl}/platform/rest/workOrderType/queryWorkOrderTypeList`, method: "get", params }),
    getQuestionDetailById: (params) => request({ url: `${mockUrl}/platform/rest/workOrderQuestion/getQuestionDetailById`, method: 'get', params}),
    editQuestion: (data) => request({url: `${mockUrl}/platform/rest/workOrderQuestion/editQuestion`, method: 'post', data}),
    topQuestion: (data) => request({ url: `${mockUrl}/platform/rest/workOrderQuestion/topQuestion`, method: 'post', data}),
    publishQuestion: (params) => request({ url: `${mockUrl}/platform/rest/workOrderQuestion/publishQuestion`, method: 'get', params}),
    downQuestion: (params) => request({ url: `${mockUrl}/platform/rest/workOrderQuestion/downQuestion`, method: 'get', params}),
    deleteQuestion: (params) => request({ url: `${mockUrl}/platform/rest/workOrderQuestion/deleteQuestion`, method: 'get', params}),




}