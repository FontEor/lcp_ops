import request from '@/utils/request.js'
import { AdminKK, DockingKK } from '@/api/module/types/kkBoard.d'

const prefix = '/platform/rest/kkadmin'
const dockingPrefix = '/platform/rest/kk'

// 快递快运对接业务看板
const kkBoardApi = {
  // 场景信息维护
  adminKk: {
    // 获取管理员列表 Look: 出参待定义
    getAdminUserList: (data: AdminKK.adminUserListParams) => request({ url: prefix + '/findList', method: 'post', data }) as any,

    // 新建快递快运管理员
    createAdminUser: (data: AdminKK.createAdminUserParams) => request({ url: prefix + '/insert', method: 'post', data }) as AdminKK.deleteAdminUserResponse,

    // 删除快递快运管理员
    deleteAdminUser: (params: AdminKK.deleteAdminUserParams) => request({ url: prefix + '/deleteById', method: 'get', params }) as AdminKK.deleteAdminUserResponse,

    // 模糊查询erp列表
    findUser: (params: AdminKK.adminUserListParams) => request({ url: '/lcp-rest/hrInfo/findUser', method: 'get', params }) as AdminKK.userInfoResponse
  },
  dockingKk: {
    // 省区列表查询
    baseInfoList: () => request({ url: dockingPrefix + '/docking/baseInfoList', method: 'get' }),

    // 对接明细列表查询
    pageList: (data: DockingKK.pageList) => request({ url: dockingPrefix + '/docking/page', method: 'post', data }),

    // 明细查询
    detail: (params: DockingKK.detailParams) => request({ url: dockingPrefix + `/docking/detail/${params.code}`, method: 'get' }),

    // 省区进展表
    process: (data: DockingKK.processParams) => request({ url: dockingPrefix + '/progressstatistics/findKKProgressStatistics', method: 'post', data }),

    // 导出
    export: (data: DockingKK.pageList): Promise<Response> =>
      request.post(dockingPrefix + '/docking/export', null, {
        responseType: 'blob',
        headers: { 'content-type': 'application/json', timeout: 600000 },
        data
      })
  }
}

export default kkBoardApi
