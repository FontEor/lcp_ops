import gwApiRequest from "@/utils/gwApiRequest.js";

const ApiAppeal = {
  queryApiAppealData: (data: [Object]) =>
    gwApiRequest({
      url: "/ApiAppealService/fontQuery",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": window.env.gatewayApiLopDn,
        "Account-Type": "erp"
      }
    }),
  checkApiAppeal: (data: [Object]) =>
    gwApiRequest({
      url: "/ApiAppealService/fontCheck",
      method: "post",
      data: "[" + JSON.stringify(data) + "]",
      headers: {
        "LOP-DN": window.env.gatewayApiLopDn,
        "Account-Type": "erp"
      }
    })
};

export default ApiAppeal;
