import request from "@/utils/request.js";

const domainCertificate = {
  /**
   * 添加证书接口
   */
  insertDomainCertificate: (data: Object): Promise<Response> => request.post("/domaincertificate/rest/insertDomainCertificate", data),
  /**
   * 更新证书接口
   */
  updateDomainCertificate: (data: Object): Promise<Response> => request.post("/domaincertificate/rest/updateDomainCertificate", data),
  /**
   * 删除证书接口
   */
  delDomainCertificateById: (params: Object) => request({ url: "/domaincertificate/rest/delDomainCertificateById", method: "get", params }),
  /**
   * 更新证书失效接口
   */
  updateDomainCertificateStatusById: (params: Object) => request({ url: "/domaincertificate/rest/updateDomainCertificateStatusById", method: "get", params }),
  /**
   * 查询证书接口
   */
  findDomainCertificateList: (params: Object) => request({ url: "/domaincertificate/rest/findDomainCertificateList", method: "get", params }),
  /**
   * 上传证书
   */
  fileupload: (params: Object) => request({ url: "/domaincertificate/rest/fileupload", method: "get", params }),
};

export default domainCertificate;
