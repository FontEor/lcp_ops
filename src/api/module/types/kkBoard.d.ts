import { ResponseData } from '@/api/module/types/genenral.d'
export namespace AdminKK {

  export type adminUserListParams = {
    erp: string;
  }

  export type adminUserList = {
    id: number;
    erp: string;
    erpName: string;
    createUser: string;
    createTime: string;
    updateTime: string;
    updateUser: string;
  }

  export type createAdminUserParams = {
    erp: string;
    erpName: string;
  }

  export type deleteAdminUserParams = {
    id: number;
  }

  export type deleteAdminUserResponse = ResponseData<string>

  export type userInfoList = {
    headImg: string;
    realName: string;
    userName: string;
    organizationFullName: string;
  }
  export type userInfoResponse = ResponseData<userInfoList[]>
}

export namespace DockingKK {
  export type pages = {
    pageNumb: number;
    pageSize: number;
  }

  export type province = {
    code: number;
    name: string;
  }
  export type provinceList = province[]

  export type dockingStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  export type dockingStatusList = dockingStatus[]
  export type pageListParams = {
    belongProvinceList?: dockingStatusList | [];
    business?: 1 | 2;
    companyName: string;
    completeTimeBegin: string;
    completeTime?: [string, string]
    completeTimeEnd: string;
    dockingStatusList?: [];
    startTime?: [string, string]
    startTimeBegin: string;
    startTimeEnd: string;
    successor?: string;
  }

  export type pageList = pageListParams & pages

  export type detailParams = {
    code: string
  }

  export type processParams = {
    belongProvince?: dockingStatusList | [];
    business?: 1 | 2;
    fromTime?: string;
    toTime?: string;
  }
}
