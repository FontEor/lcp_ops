import request from "@/utils/request.js";
import { IDocumentRequest } from "../types/document";

// const mockUrl = "/mock/37";
const mockUrl = "";

export const documentRequest: IDocumentRequest.request = {
   // 运维端-文档管理-新增分组
    saveDocGroup: (data) => request({ url: `${mockUrl}/i18n/rest/docGroup/saveDocGroup`, method: "post", data}),
    queryDocGroupList: (params) => request({ url: `${mockUrl}/i18n/rest/docGroup/queryDocGroupList`, method: "get", params }),
    update: (data) => request({ url: `${mockUrl}/i18n/rest/docGroup/update`, method: "post", data }),
    queryDocList: (params) => request({ url: `${mockUrl}/i18n/rest/doc/queryDocList`, method: "get", params }),
    editDoc: (data) => request({ url: `${mockUrl}/i18n/rest/doc/editDoc`, method: "post", data }),
    getById: (params) => request({ url: `${mockUrl}/i18n/rest/doc/getById`, method: "get", params }),
    publishDoc: (data) => request({ url: `${mockUrl}/i18n/rest/doc/publishDoc`, method: "post", data }),
    deleteDoc: (data) => request({ url: `${mockUrl}/i18n/rest/doc/deleteDoc`, method: "post", data }),
    downDoc: (data) => request({ url: `${mockUrl}/i18n/rest/doc/downDoc`, method: "post", data }),


}