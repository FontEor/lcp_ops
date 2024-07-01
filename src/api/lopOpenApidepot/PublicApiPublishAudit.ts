import gwlopOpenApidepot from "@/utils/gwlopOpenApidepot.js";

const PublicApiPublishAudit = {
  // 表格
  queryPendingApi: (data: [Object]) =>
    gwlopOpenApidepot({
      url: "/ApiManagerService/queryPendingApi",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": window.env.gatewayApiLopDn,
        "Account-Type": "erp"
      }
    }),
  // 表格
  queryPendingApiI18n: (data: [Object], site: string) => {
    const { gatewayApiBaseUrlI18nUs, gatewayApiBaseUrlI18nEu, gatewayApiLopDnI18n } = window.env;
    const hashMap = new Map().set("us", gatewayApiBaseUrlI18nUs).set("eu", gatewayApiBaseUrlI18nEu);
    const baseURL = hashMap.get(site) || "";

    return gwlopOpenApidepot({
      baseURL,
      url: "/ApiManagerService/queryPendingApi",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": gatewayApiLopDnI18n,
        "Account-Type": "erp"
      }
    });
  },

  // 待审批jsf方法查询
  queryPendingMethodList: (data: [Object]) =>
    gwlopOpenApidepot({
      url: "/ApiManagerService/queryPendingMethodList",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": window.env.gatewayApiLopDn,
        "Account-Type": "erp"
      }
    }),
  // 待审批jsf方法查询
  queryPendingMethodListI18n: (data: [Object], site: string) => {
    const { gatewayApiBaseUrlI18nUs, gatewayApiBaseUrlI18nEu, gatewayApiLopDnI18n } = window.env;
    const hashMap = new Map().set("us", gatewayApiBaseUrlI18nUs).set("eu", gatewayApiBaseUrlI18nEu);
    const baseURL = hashMap.get(site) || "";

    return gwlopOpenApidepot({
      baseURL,
      url: "/ApiManagerService/queryPendingMethodList",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": gatewayApiLopDnI18n,
        "Account-Type": "erp"
      }
    });
  },

  // 待审批jsf方法API文档查询
  queryPendingMethodApiDoc: (data: [Object]) =>
    gwlopOpenApidepot({
      url: "/ApiManagerService/queryPendingMethodApiDoc",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": window.env.gatewayApiLopDn,
        "Account-Type": "erp"
      }
    }),
  // 待审批jsf方法API文档查询
  queryPendingMethodApiDocI18n: (data: [Object], site: string) => {
    const { gatewayApiBaseUrlI18nUs, gatewayApiBaseUrlI18nEu, gatewayApiLopDnI18n } = window.env;
    const hashMap = new Map().set("us", gatewayApiBaseUrlI18nUs).set("eu", gatewayApiBaseUrlI18nEu);
    const baseURL = hashMap.get(site) || "";

    return gwlopOpenApidepot({
      baseURL,
      url: "/ApiManagerService/queryPendingMethodApiDoc",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": gatewayApiLopDnI18n,
        "Account-Type": "erp"
      }
    });
  },

  // 审批
  apiAuditEnd: (data: [Object]) =>
    gwlopOpenApidepot({
      url: "/ApiManagerService/apiAuditEnd",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": window.env.gatewayApiLopDn,
        "Account-Type": "erp"
      }
    }),
  // 审批
  apiAuditEndI18n: (data: [Object], site: string) => {
    const { gatewayApiBaseUrlI18nUs, gatewayApiBaseUrlI18nEu, gatewayApiLopDnI18n } = window.env;
    const hashMap = new Map().set("us", gatewayApiBaseUrlI18nUs).set("eu", gatewayApiBaseUrlI18nEu);
    const baseURL = hashMap.get(site) || "";

    return gwlopOpenApidepot({
      baseURL,
      url: "/ApiManagerService/apiAuditEnd",
      method: "post",
      data: JSON.stringify(data),
      headers: {
        "LOP-DN": gatewayApiLopDnI18n,
        "Account-Type": "erp"
      }
    });
  }
};
export default PublicApiPublishAudit;
