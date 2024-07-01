import gwApiRequest from "@/utils/gwApiRequest.js";

const OuterDomainApiService = {
  queryPendingApiList: (data: any) => gwApiRequest.post("/OuterDomainApiService/queryPendingApiList", JSON.stringify(data)),

  queryPendingApiDetails: (data: any) => gwApiRequest.post("/OuterDomainApiService/queryPendingApiDetails", JSON.stringify(data)),

  outerApiAuditEnd: (data: any) => gwApiRequest.post("/OuterDomainApiService/outerApiAuditEnd", JSON.stringify(data))
};

export default OuterDomainApiService;
