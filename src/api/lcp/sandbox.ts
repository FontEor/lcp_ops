import request from "@/utils/request.js";

const sandboxApi = {
  //场景信息维护
  sceneInfo: {
    /**
     * 联调场景维护页面-查询全部
     */
    selectList: (params: Object) => request({ url: "/platform/rest/sandboxScene/selectList", method: "get", params }),
    /**
     * 联调场景维护页面-编辑保存
     */
    edit: (data: Object) => request({ url: "/platform/rest/sandboxScene/edit", method: "post", data }),
    /**
     * 查询对接方案列表
     */
    queryAllBizUnitList: (params: Object) => request({ url: "/platform/rest/bizUnit/queryAllBizUnitList", method: "get", params })
  },
  //沙箱联调
  sandboxJoin: {}
};

export default sandboxApi;
