import { ISandbox } from "@/api/module/types/sandbox"
export interface IUserState {
  token: string,
  tokenKey: string,
  accountType: number,
  fullname: string,
  username: string,
  avatar: string,
  email: string,
  tenantCode: string,
  personId: string,
  expire: number,
  mobile: string,
  userId: number,
  orgId: string,
  orgName: string,
  roles: Array<string>,
  hrmDeptId: string,
  loginType: {
    erp: string,
    passport: string
  }
}

export interface SappState {
  sidebar: {
    opened: Boolean,
    showSidebar: Boolean
  },
  editableTabsValue: string,
  editableTabs: Array<object>,
  maxPageNumber: number,
  showCommonView: Boolean,
  themeColor: string,
  showTab: Boolean
}

export interface SandBoxState {
  apiList: ISandbox.SelectApiListByCategoryItem[]
}
