import request from "@/utils/request.js";

const workOrderApi = {
  //工单记录接口
  workOrderRecord: {
    /**
     * 查询工单记录列表数据
     */
    getWorkOrderRecordData: (data: Object): Promise<Response> => request.post("/platform/rest/workOrderRecord/query", data),
    /**
     * 查询明细详情接口
     */
    getWorkOrderDetaildData: (params: Object) => request({ url: "/platform/rest/workOrderRecord/getDetail", method: "get", params }),
    /**
     * 导出
     */
    exportWorkOrderRecord: (data?: object): Promise<Response> => request.post("/platform/rest/workOrderRecord/export", data, { responseType: "blob" }),
    /**
     * 明细详情下载附件接口
     */
    downloadFile: (params: Object) => request({ url: "/lcp-rest/_file/download/getDownloader", method: "get", params })
  },
  //工单类型维护接口
  workOrderType: {
    /**
     * 查询工单类型数据
     */
    queryWorkOrderTypeList: (params: Object) => request({ url: "/platform/rest/workOrderType/queryWorkOrderTypeList", method: "get", params }),
    /**
     * 保存新建和编辑工单类型数据
     */
    saveWorkOrderTypeData: (data: Object) => request({ url: "/platform/rest/workOrderType/saveWorkOrderType", method: "post", data }),
    /**
     * 删除工单类型数据
     */
    deleteWorkOrderType: (params: Object) => request({ url: "/platform/rest/workOrderType/deleteWorkOrderType", method: "get", params }),
    /**
     * 删除校验工单类型数据
     */
    deleteWorkOrderTypeCheck: (params: Object) => request({ url: "/platform/rest/workOrderType/deleteWorkOrderTypeCheck", method: "get", params }),
    /**
     * 替换工单类型
     */
    replaceWorkOrderType: (params: Object) => request({ url: "/platform/rest/workOrderType/replaceWorkOrderType", method: "get", params }),
    /**
     * 拖拽排序
     */
    updateWorkOrderTypeSeq: (data: Array<{ id: number; seq: number }>) => request({ url: "platform/rest/workOrderType/updateWorkOrderTypeSeq", method: "post", data })
  }
};

export default workOrderApi;
