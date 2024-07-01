import request from "@/utils/request.js";
import { IQuestionRequest } from "../types/question";

// const mockUrl = "/mock/37";
const mockUrl = "";

export const questionRequest: IQuestionRequest.request = {
    // 运维端-文档管理-新增分组
    queryQuestionList: (params) => request({ url: `${mockUrl}/i18n/rest/question/queryQuestionList`, method: "get", params }),
    editQuestion: (data) => request({ url: `${mockUrl}/i18n/rest/question/editQuestion`, method: "post", data }),
    getQuestionDetailById: (params) => request({ url: `${mockUrl}/i18n/rest/question/getQuestionDetailById`, method: "get", params }),
    publishQuestion: (data) => request({ url: `${mockUrl}/i18n/rest/question/publishQuestion`, method: "post", data }),
    deleteQuestion: (data) => request({ url: `${mockUrl}/i18n/rest/question/deleteQuestion`, method: "post", data }),
    downQuestion: (data) => request({ url: `${mockUrl}/i18n/rest/question/downQuestion`, method: "post", data }),
}