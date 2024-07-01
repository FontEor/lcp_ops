import request from "@/utils/request.js";
import gwApiRequest from "@/utils/gwApiRequest.js";
import { ISandboxRequest } from "./types/sandbox";
// const mockUrl = "/mock/5";
const mockUrl = "";
const sandbox: ISandboxRequest.Request = {
  sandboxSceneList: () => request({ url: `${mockUrl}/platform/rest/sandboxScene/selectList`, method: "get"}),
  selectApiListByCategory: (params) => request({ url: `${mockUrl}/platform/rest/bizApi/selectApiListByCategory`, method: "get", params }),
  sandboxNodeApi: (data) => request({ url: `${mockUrl}/platform/rest/sandboxNodeApi/select`, method: 'post', data}),
  getMockData: (params) => request({ url: `${mockUrl}/platform/rest/sandboxNodeApiMock/select`, menthod: 'get', params}),
  selectDifferentList: (params) => request({ url: `${mockUrl}/platform/rest/sandboxNodeApiDetail/selectDifferentList`,method: 'get', params}),
  saveDifferent: (data) => request({ url: `${mockUrl}/platform/rest/sandboxNodeApiDetail/saveDifferent`, method: 'post', data}),
  saveMockData: (data) => request({ url: `${mockUrl}/platform/rest/sandboxNodeApi/save`, method: 'post', data}),
}
export default sandbox;
