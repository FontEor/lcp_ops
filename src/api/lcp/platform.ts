import request from "@/utils/request.js";

const platform = {
  rest: {
    userSatisfaction: {
      /**
       * 根据时间查询用户满意度列表数据
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/995}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       *
       * @param {Object} params 请求参数
       * @param {number} params.pageNumb - 当前页码
       * @param {number} params.pageSize - 每页数据条数
       * @param {string} params.startTime - 起始时间 2022-04-01
       * @param {string} params.endTime - 截止时间 2022-04-01
       * @returns {Promise.<Response>} 表示根据时间查询用户满意度列表数据返回的Promise对象
       */
      queryList: (params: object): Promise<Response> => request.get("/platform/rest/userSatisfaction/queryList", { params }),

      /**
       * 根据时间查询用户满意度图表数据
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/996}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       *
       * @param {Object} params 请求参数
       * @param {string} params.startTime - 起始时间 2022-04-01
       * @param {string} params.endTime - 截止时间 2022-04-01
       * @param {string} params.type - 截止时间 2022-04-01
       * @returns {Promise.<Response>} 表示根据时间查询用户满意度图表数据返回的Promise对象
       */
      queryData: (params: object): Promise<Response> => request.get("/platform/rest/userSatisfaction/queryData", { params })
    },
    lcpDict: {
      /**
       * 查询字典表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1001}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       *
       * @param {Object} params 请求参数
       * @param {string} params.type - 字典类别
       * @returns {Promise.<Response>} 表示查询字典表返回的Promise对象
       */
      getDicts: (params?: object): Promise<Response> => request.get("/platform/rest/lcpDict/getDicts", { params })
    },
    bizApi: {
      /**
       * 根据AppKey与对接方案ID查询URI列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1009}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       * @property {string} Response.data[].apiUrl - API的URI
       *
       * @param {Object} params 请求参数
       * @param {string} params.appKey - AppKey
       * @param {string} params.unitId - 对接方案ID
       * @returns {Promise.<Response>} 表示根据AppKey与对接方案ID查询URI列表的Promise对象
       */
      queryBizOrderApiList: (params?: object): Promise<Response> => request.get("/platform/rest/bizApi/queryBizOrderApiList", { params }),
      /**
       * 根据AppKey与对接方案ID查询URI列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1104}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       * @property {string} Response.data[].apiUrl - API的URI
       *
       * @param {Object} params 请求参数
       * @param {string} params.appKey - AppKey
       * @param {string} params.unitId - 对接方案ID
       * @returns {Promise.<Response>} 表示根据AppKey与对接方案ID查询URI列表的Promise对象
       */
      queryOuterBizOrderApiList: (params?: object): Promise<Response> => request.get("/platform/rest/bizApi/queryOuterBizOrderApiList", { params }),
      /**
       * 模糊查询URI列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1099}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       * @property {string} Response.data[].apiUrl - API的URI
       *
       * @param {Object} params 请求参数
       * @param {string} params.queryLike - 模糊查询内容
       * @returns {Promise.<Response>} 表示根据AppKey与对接方案ID查询URI列表的Promise对象
       */
      fuzzyQueryBizApiList: (params?: object): Promise<Response> => request.get("/platform/rest/bizApi/fuzzyQueryBizApiList", { params }),
      /**
       * 模糊查询URI列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1106}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       * @property {string} Response.data[].apiUrl - API的URI
       *
       * @param {Object} params 请求参数
       * @param {string} params.queryLike - 模糊查询内容
       * @returns {Promise.<Response>} 表示根据AppKey与对接方案ID查询URI列表的Promise对象
       */
      fuzzyQueryCallBackApiList: (params?: object): Promise<Response> => request.get("/platform/rest/bizApi/fuzzyQueryCallBackApiList", { params }),
      /**
       * 运维端-接口查询工具
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1070}
       * @param {Object} data 请求参数
       * @param {string} data.unitCode - 对接方案编码
       * @param {number} data.apiUrl - 接口的URL
       * @param {string} data.interfaceName - JSF接口名
       * @param {string} data.interfaceMethod - JSF方法名
       *
       * @returns {Promise.<Response>} 表示查询接口查询工具数据返回的Promise对象
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       */
      queryApiInfoList: (data?: object): Promise<Response> => request.post("/platform/rest/bizApi/queryApiInfoList", data),

      /**
       * 根据对接方案code查询apipath
       *
       */
      findOutCallInnerApiListByUnitCode: (params?: object): Promise<Response> => request.get("/platform/rest/bizApi/findOutCallInnerApiListByUnitCode", { params })
    },
    loggingTool: {
      /**
       * 运维端-日志工具-查询日志表格数据
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1008}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       *
       * @param {Object} data 请求参数
       * @param {number} data.pageNumb - 页码
       * @param {number} data.pageSize - 每页数据条数
       * @param {string} data.appKey - AppKey
       * @param {string} data.unitCode - 对接方案编码
       * @param {string} data.url - API的URI
       * @param {string} data.startTime - 时间范围起始时间戳
       * @param {string} data.endTime - 时间范围截止时间戳
       * @param {string} data.env - 运行环境 "prod":当前环境 "uat":影盒环境
       * @returns {Promise.<Response>} 表示查询日志表格数据返回的Promise对象
       */
      queryAppLogsList: (data?: object): Promise<Response> => request.post("/platform/rest/loggingTool/queryAppLogsList", data),
      /**
       * 运维端-日志工具-查询回传API日志表格数据
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1105}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object[]} Response.data - 返回数据
       *
       * @param {Object} data 请求参数
       * @param {number} data.pageNumb - 页码
       * @param {number} data.pageSize - 每页数据条数
       * @param {string} data.appKey - AppKey
       * @param {string} data.unitCode - 对接方案编码
       * @param {string} data.url - API的URI
       * @param {string} data.startTime - 时间范围起始时间戳
       * @param {string} data.endTime - 时间范围截止时间戳
       * @param {string} data.env - 运行环境 "prod":当前环境 "uat":影盒环境
       * @returns {Promise.<Response>} 表示查询日志表格数据返回的Promise对象
       */
      queryCallBackList: (data?: object): Promise<Response> => request.post("/platform/rest/loggingTool/queryCallBackList", data),

      /**
       * 运维端-日志工具-查询日志详情数据
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1010}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       * @property {string} Response.data.requestMethod - 请求方式
       * @property {string} Response.data.request - 请求报文
       * @property {string} Response.data.response - 响应报文
       * @property {string} Response.data.errorMsg - 异常描述
       *
       * @param {Object} data 请求参数
       * @param {string} data.appKey - AppKey
       * @param {number} data.id - 日志ID
       * @param {string} data.env - 运行环境 "prod":当前环境 "uat":影盒环境
       * @returns {Promise.<Response>} 表示查询日志表格数据返回的Promise对象
       */
      selectAppLogDetail: (data?: object): Promise<Response> => request.post("/platform/rest/loggingTool/selectAppLogDetail", data),

      /***
       * 运维端-运维工具-日志工具-消息日志
       *   查询消息订阅数据
       */
      queryMsgUnitByAppKey: (replacements?: object): Promise<Response> => request.get("/platform/rest/bizMessage/queryOrder{appKey}", replacements),
      /***
       * 运维端-运维工具-日志工具-消息日志
       *   消息日志查询
       */
      queryLogToolMsgPage: (data?: object, params?: object): Promise<Response> => request.post("/platform/rest/loggingTool/msgPage", data, { params }),
      /***
       * 运维端-运维工具-日志工具-消息日志
       *    消息日志查询详情接口
       */
      queryLogToolMsgDetails: (replacements?: object, params?: object): Promise<Response> => request.get("/platform/rest/loggingTool/msgDetails{traceId}", replacements, { params }),
      /***
       * 运维端-运维工具-日志工具-消息日志
       *    消息日志重推
       */
      queryLogToolMsgRetryPush: (params?: object, replacements?: object): Promise<Response> =>
        request.post("/platform/rest/bizMessage/msgRetryPush{traceId}", null, {
          headers: { "content-type": "application/x-www-form-urlencoded" },
          params,
          replacements
        })
    },
    dockingPeriod: {
      /**
       * 运维端-客户对接明细-查询客户对接明细列表数据
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1040}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       * @property {number} Response.data.total - 数据总数
       * @property {number[]} Response.data.list - 列表数据
       * @property {number} Response.data.list[].bizOrderId - 业务ID 用于打标
       * @property {string} Response.data.list[].tagCode - 标签 "01":"正常","02":"异常"
       * @property {string} Response.data.list[].companyName - 公司名称
       * @property {string} Response.data.list[].appKey - 应用编码
       * @property {string} Response.data.list[].unitName - 方案名称
       * @property {string} Response.data.list[].supplierCreateTime - 注册时间
       * @property {string} Response.data.list[].isvApproveFirstTime - 首个资质审核通过时间
       * @property {string} Response.data.list[].approveTime - 方案订阅审批通过日期
       * @property {string} Response.data.list[].firstCallTime - 首次调用时间
       * @property {string} Response.data.list[].onlineTime - 方案点击上线时间
       * @property {string} Response.data.list[].firstCallActualTime - 首次连续7天成功调用次数大于10的日期
       * @property {string} Response.data.list[].dockingPeriodTime - 对接周期（天）
       * @property {Object} Response.data.list[].docUserSatisfactionDto - 文档描述数据对象
       * @property {number} Response.data.list[].docUserSatisfactionDto.score - 分数
       * @property {string} Response.data.list[].docUserSatisfactionDto.content - 内容
       * @property {string} Response.data.list[].funcUserSatisfactionDto - 平台功能数据对象
       * @property {number} Response.data.list[].funcUserSatisfactionDto.score - 分数
       * @property {string} Response.data.list[].funcUserSatisfactionDto.content - 内容
       * @property {string} Response.data.list[].answerUserSatisfactionDto - 客服答疑数据对象
       * @property {Object} Response.data.list[].answerUserSatisfactionDto.score - 分数
       * @property {string} Response.data.list[].answerUserSatisfactionDto.content - 内容
       * @property {string} Response.data.list[].tagRemark - 备注标签原因
       *
       * @param {Object} data 请求参数
       * @param {number} data.pageNum - 当前页
       * @param {number} data.pageSize - 每页数据条数
       * @param {number} data.onlineStatus - 数据展示范围 0:全部（已订阅），1:待上线，2:已上线，3:已下线
       * @param {number} data.approveStartTime - 订阅开始时间戳
       * @param {number} data.approveEndTime - 订阅结束时间戳
       * @param {number} data.onlineStartTime - 订阅结束时间戳
       * @param {number} data.onlineEndTime - 订阅结束时间戳
       * @param {number[]} data.unitIdList - 对接方案ID列表
       * @param {string} data.companyName - 公司名称
       *
       * @returns {Promise.<Response>} 表示查询客户对接明细列表数据返回的Promise对象
       */
      queryDockingPeriodList: (data?: object): Promise<Response> => request.post("/platform/rest/dockingPeriod/queryDockingPeriodList", data),

      /**
       * 运维端-客户对接明细-导出对接周期
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1043}
       *
       * @typedef {Object} Response 响应参数
       *
       * @param {Object} data 请求参数
       * @param {number} data.onlineStatus - 数据展示范围 0:全部（已订阅），1:待上线，2:已上线，3:已下线
       * @param {number} data.approveStartTime - 订阅开始时间戳
       * @param {number} data.approveEndTime - 订阅结束时间戳
       * @param {number} data.onlineStartTime - 订阅结束时间戳
       * @param {number} data.onlineEndTime - 订阅结束时间戳
       * @param {number[]} data.unitIdList - 对接方案ID列表
       * @param {string} data.companyName - 公司名称
       *
       * @returns {Promise.<Response>} 表示导出对接周期数据返回的Promise对象
       */
      exportDockingPeriod: (data?: object): Promise<Response> => request.post("/platform/rest/dockingPeriod/exportDockingPeriod", data, { responseType: "blob" }),

      /**
       * 运维端-客户对接明细-对接周期打标
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1043}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       *
       * @param {Object} data 请求参数
       * @param {number} data.id - 业务ID 用于打标的bizOrderId
       * @param {string} data.tagCode - 打标编码 "01":"正常","02":"异常"
       * @param {string} data.tagRemark - 打标备注
       *
       * @returns {Promise.<Response>} 表示对接周期打标返回的Promise对象
       */
      saveBizOrderTag: (data?: object): Promise<Response> => request.post("/platform/rest/dockingPeriod/saveBizOrderTag", data)
    },
    bizUnit: {
      /**
       * 运维端-客户对接明细-获取分类下的所有对接方案两级级联列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1041}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       * @property {Object[]} Response.data - 列表数据
       * @property {number} Response.data[].id - 对接方案分类ID 需要前端生成以实现级联选择
       * @property {string} Response.data[].name - 对接方案分类名称
       * @property {Object[]} Response.data[].bizUnitList - 对接方案数据对象列表
       * @property {Object[]} Response.data[].bizUnitList[].id - 对接方案ID
       * @property {Object[]} Response.data[].bizUnitList[].name - 对接方案名称
       *
       * @returns {Promise.<Response>} 表示获取分类下的所有对接方案返回的Promise对象
       */
      getClassifiedBizUnit: (): Promise<Response> => request.get("/platform/rest/bizUnit/getClassifiedBizUnit"),
      /**
       * 运维端-客户对接明细-获取分类下的所有对接方案两级级联列表
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1102}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       * @property {Object[]} Response.data - 列表数据
       * @property {number} Response.data[].id - 对接方案ID
       * @property {string} Response.data[].name - 对接方案名称
       * @property {Object[]} Response.data[].code - 对接方案编码
       * @property {Object[]} Response.data[].hasUat -是否支持沙箱
       *
       * @returns {Promise.<Response>} 表示获取所有对接方案返回的Promise对象
       */
      queryAllBizUnitList: (): Promise<Response> => request.get("/platform/rest/bizUnit/queryAllBizUnitList"),
      /**
       * 运维端-客户对接明细-对接周期查询
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1057}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       */
      selectAppDockingSchemeData: (data?: object): Promise<Response> => request.post("/platform/rest/dockingPeriod/selectAppDockingSchemeData", data),
    },
    evaluate: {
      /**
       * 定义根据文档类型导出文档评价明细报表接口
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1636}
       *
       * @typedef {Object} Response 响应参数
       *
       * @param {Object} data 请求参数
       * @param {number} data.queryDataType - 文档类型 1:对接方案文档 2:平台文档
       * @param {number|undefined} data.startTime - 评价开始时间戳
       * @param {number|undefined} data.endTime - 评价结束时间戳
       * @param {number|undefined} data.whetherHelp - 是否有帮助 0:无帮助 1:有帮助
       * @param {number[]|undefined} data.handleStatusList - 处理状态 0:评价待处理 1:评价已处理 2:挂起 3:评价不合理
       * @param {number[]|undefined} data.questionCauseList - 问题原因 1:内容不详细 2:文档更新不及时 3:内容有误 4:视觉体验差 5:其他
       * @param {number[]|undefined} data.unitIdList - 对接方案ID列表
       *
       * @returns {Promise.<Response>} 表示根据文档类型导出文档评价明细报表接口返回的Promise对象
       */
      export: (data: object): Promise<Response> =>
        request.post("/platform/rest/evaluate/export", data, {
          responseType: "blob",
          transformResponse: [
            function(evaluateData: string) {
              const code = 20000;
              const data = evaluateData;
              return { code, data };
            }
          ]
        }),

      /**
       * 定义查询文档评价明细列表接口
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1632}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       * @property {number} Response.data.total - 数据总数
       * @property {number[]} Response.data.list - 列表数据
       * @property {number} Response.data.list[].id - 评价ID
       * @property {string} Response.data.list[].unitName - 对接方案名称
       * @property {number} Response.data.list[].docTypeSub - 子文档类型 1:"API文档" 2:"业务介绍" 3:"开发说明" 4:"联调指南" 5:"常见问题" 6:"消息文档"
       * @property {string} Response.data.list[].title - 文档标题
       * @property {string} Response.data.list[].createTime - 评价时间
       * @property {string} Response.data.list[].createUser - 评价人
       * @property {number} Response.data.list[].whetherHelp - 是否有帮助 0:无帮助 1:有帮助
       * @property {number} Response.data.list[].questionCause - 问题原因 1:内容不详细 2:文档更新不及时 3:内容有误 4:视觉体验差 5:其他
       * @property {string} Response.data.list[].questionDesc - 问题描述
       * @property {number} Response.data.list[].handleStatus - 处理状态 0:评价待处理 1:评价已处理 2:挂起 3:评价不合理
       * @property {string} Response.data.list[].handleUser - 处理人
       * @property {string} Response.data.list[].userExplain - 处理说明
       *
       * @param {Object} data 请求参数
       * @param {number} data.queryDataType - 文档类型 1:对接方案文档 2:平台文档
       * @param {number} data.pageNum - 当前页
       * @param {number} data.pageSize - 每页数据条数
       * @param {number|undefined} data.startTime - 评价开始时间戳
       * @param {number|undefined} data.endTime - 评价结束时间戳
       * @param {number|undefined} data.whetherHelp - 是否有帮助 0:无帮助 1:有帮助
       * @param {number[]|undefined} data.handleStatusList - 处理状态 0:评价待处理 1:评价已处理 2:挂起 3:评价不合理
       * @param {number[]|undefined} data.questionCauseList - 问题原因 1:内容不详细 2:文档更新不及时 3:内容有误 4:视觉体验差 5:其他
       * @param {number[]|undefined} data.unitIdList - 对接方案ID列表
       *
       * @returns {Promise.<Response>} 表示查询客户对接明细列表数据返回的Promise对象
       */
      queryEvaluateHelpList: (data: object): Promise<Response> => request.post("/platform/rest/evaluate/queryEvaluateHelpList", data),

      /**
       * 定义处理文档评价接口
       *
       * @see {@link YApi http://11.51.194.248:3000/project/5/interface/api/1634}
       *
       * @typedef {Object} Response 响应参数
       * @property {Object} Response.data - 返回数据
       *
       * @param {Object} data 请求参数
       * @param {number} data.id - 评价ID
       * @param {string} data.handleStatus - 处理状态 0:评价待处理 1:评价已处理 2:挂起 3:评价不合理
       * @param {string} data.userExplain - 处理说明
       *
       * @returns {Promise.<Response>} 表示处理文档评价接口返回的Promise对象
       */
      updateEvaluateHelp: (data: object): Promise<Response> => request.post("/platform/rest/evaluate/updateEvaluateHelp", data)
    },
    smartRobotRecord:{
      /**
       * 智能助手记录查询
       */
      queryList: (data: object): Promise<Response> => request.post("/platform/rest/smartRobotRecord/queryList", data)

    }
  }
};

export default platform;
