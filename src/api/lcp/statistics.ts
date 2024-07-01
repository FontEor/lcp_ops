import request from "@/utils/request.js";

const safetystatistics = {
  rest: {
    /**
     * 查询ISV调用统计接口
     *
      appKey	string	非必须		appkey	
      endTime	number	必须		结束时间	
      pageNumb	number	必须		第几页	
      pageSize	number	必须		页条数	
      startTime	number	必须		开始时间	
      pin	string	非必须		pin	
      companyCode	string	非必须		社会信用代码	
      gatewayUri	string	非必须		物流网关接口名/EDI接口URL	
      bizUnitCode	string	非必须		对接方案code	
      apiUri	string	非必须		API的URL(path)	
     */
    findSafetyStatisticsList: (data?: object): Promise<Response> => request.post("/safetystatistics/rest/findSafetyStatisticsList", data),

    safetystatisticsExport: (data?: object): Promise<Response> => request.post("/safetystatistics/rest/export", data)

  }
};

export default safetystatistics;
