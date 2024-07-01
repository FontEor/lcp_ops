// import Fetch from '@pandora/fetch'
import service from '@/lib/request'

const project = {
  // 项目管理-列表查询
  search: (params: Object) => service.post('/project/search', params),
  // 项目管理-列表页中显示的统计数据(可见接口注释)
  statistic: (params: Object) => service.post('/project/statistic', params),
  // 项目管理-编辑/查看详情
  get: (params: Object) => service.post('/project/get', params),
  // 项目管理-系统对接类项目-项目日志
  searchInstance: (params: Object) => service.post('/project/searchInstance', params),
  // 项目管理-创建项目
  add: (params: Object) => service.post('/project/add', params),
  // 项目管理-编辑(中途退出提示是否暂存)-保存(暂存)
  update: (params: Object) => service.post('/project/update', params),
  // 项目管理-新建/编辑(添加完任务后)-提交
  submit: (params: Object) => service.post('/project/submit', params),
  // 项目管理-删除
  delete: (params: Object) => service.post('/project/delete', params),
  // 项目管理-重新计算
  rerun: (params: Object) => service.post('/project/rerun', params),
  // 项目管理-项目终止
  disable: (params: Object) => service.post('/project/disable', params)
}

export default project
