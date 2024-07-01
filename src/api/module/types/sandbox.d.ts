export namespace ISandbox {
  export interface SandboxSceneItem {
    name: string;
    remark: string;
    unitName: string;
    unitCode: string;
  }
  export type FuzzyQueryBizApiListRequest = {
    unitCode: string
  }

  interface SelectApiListByCategoryItemChildItem {
    apiName: string;
    apiUrl: string;
    callDirection: number;
  }

  export interface SelectApiListByCategoryItem {
    code: string,
    name: string,
    apiList: SelectApiListByCategoryItemChildItem[]
  }
  export type SandboxNodeApiRequest = {
    unitCode: string;
    apiUri: string;
    sandboxSceneCode: string;
    nodeCode: string;
    apiCallDirection: number;
  }
  type sandboxNodeApiDetailDtosItem = {
    id: number;
    sandboxNodeApiCode: string;
    otherUnitCode: string;
    otherApiUri: string;
    otherApiName: string;
    otherApiCallDirection: number;
    paramType: number;
    mockPath: string;
    mockData: string;
    type: number;
    mockId: number;
  }
  export type SandboxNodeApiResponse = {
    code: string;
    nodeCode: string;
    sandboxSceneCode: string;
    unitCode: string;
    apiUri: string;
    apiName: string;
    apiCallDirection: number;
    isMock: number;
    mockConditionType: number;
    isReturnDifferent: number;
    mockResponsePath: string;
    mockResponseData: string;
    mockId: number;
    sandboxNodeApiDetailDtos: sandboxNodeApiDetailDtosItem[]
  }
  export type GetMockDataRequest = {
    mockId: number;
  }
  export type GetMockDataResponse = {
    data: string;
  }
  export type SelectDifferentListRequest = {
    sandboxNodeApiCode: string;
  }
  export type SelectDifferentListResponse = {
    mockData: string;
    sandboxNodeApiCode: string;
    id: number;
    otherApiUri: string;
    otherApiCallDirection: number;
    paramType: number;
    otherApiName: string;
    otherUnitCode: string;
    type: number;
    mockId: number;
    mockPath: string;
  }
  export type SaveDifferentRequestItem = {
    id: number;
    sandboxNodeApiCode: string;
    mockData: string;
  }
}
export namespace ISandboxRequest {
  export interface Request {
    sandboxSceneList: () => Promise<ISandbox.SandboxSceneItem[]>;
    selectApiListByCategory: (options: ISandbox.FuzzyQueryBizApiListRequest) => Promise<ISandbox.SelectApiListByCategoryItem[]>;
    sandboxNodeApi: (options: ISandbox.SandboxNodeApiRequest) => Promise<ISandbox.SandboxNodeApiResponse>;
    getMockData: (options: ISandbox.GetMockDataRequest) => Promise<ISandbox.GetMockDataResponse>;
    selectDifferentList: (options: ISandbox.SelectDifferentListRequest) => Promise<ISandbox.SelectDifferentListResponse>;
    saveDifferent: (options: ISandbox.SaveDifferentRequestItem[]) => Promise<unknown>;
    saveMockData: (options: ISandbox.SandboxNodeApiResponse) => Promise<unknown>;
  }
}
