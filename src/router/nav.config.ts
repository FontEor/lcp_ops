// const routes = [
//   {
//     id: '1', // 路由唯一标识
//     path: '/components/home', // [必传]路径-对齐URL上的访问路径
//     name: 'home', // [必传]路由名称
//     desc: '平台管理', // 路由描述
//     meta: { title: '首页', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 1, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '2', // 路由唯一标识
//     path: '/components/doc', // [必传]路径-对齐URL上的访问路径
//     name: 'Doc', // [必传]路由名称
//     desc: '包含新手指南、开发支持、API文档、业务单元、产品等管理页面', // 路由描述
//     meta: { title: '文档管理', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 2, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '3', // 路由唯一标识
//     path: '/components/question', // [必传]路径-对齐URL上的访问路径
//     name: 'Question', // [必传]路由名称
//     desc: '包含API相关问题、授权相关问题、订购相关问题、入驻相关问题、其他问题等管理页面', // 路由描述
//     meta: { title: '常见问题', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 3, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '4', // 路由唯一标识
//     path: '/components/feedback', // [必传]路径-对齐URL上的访问路径
//     name: 'Feedback', // [必传]路由名称
//     desc: '包含体验优化、功能改进、页面优化、联系我们等管理页面', // 路由描述
//     meta: { title: '意见反馈', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 4, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '5', // 路由唯一标识
//     path: '/components/business', // [必传]路径-对齐URL上的访问路径
//     name: 'Business', // [必传]路由名称
//     desc: '包含ISV、自研商家、自营商家等管理页面', // 路由描述
//     meta: { title: '商家管理', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 5, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: [ //子节点
//       {
//         id: '51',
//         path: '/certification',
//         name: 'Certification',
//         desc: '开发商认证管理',
//         group: 1 - 1,
//         groupName: '二级',
//         meta: { title: '开发商认证管理', icon: '' },
//         type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2
//         children: []
//       },
//       {
//         id: '52',
//         path: '/viewInfo',
//         name: 'viewInfo',
//         desc: '开发商信息查看',
//         meta: { title: '开发商信息查看', icon: '' },
//         type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2
//         group: 1 - 2,
//         groupName: '二级',
//         children: []
//       }
//     ]
//   },
//   {
//     id: '6', // 路由唯一标识
//     path: '/components/cache', // [必传]路径-对齐URL上的访问路径
//     name: 'Cache', // [必传]路由名称
//     desc: '包含内网应用、外网应用、ISV应用、商家自研应用等管理页面', // 路由描述
//     meta: { title: '缓存管理', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 6, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '7', // 路由唯一标识
//     path: '/components/report', // [必传]路径-对齐URL上的访问路径
//     name: 'Report', // [必传]路由名称
//     desc: '包含总体数量、开发商数量、API数量、开发者数量、应用数量、API申请数量等管理页面', // 路由描述
//     meta: { title: '运营报表', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 7, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '8', // 路由唯一标识
//     path: '/components/notice', // [必传]路径-对齐URL上的访问路径
//     name: 'Notice', // [必传]路由名称
//     desc: '包含平台公告等管理页面', // 路由描述
//     meta: { title: '消息公告', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 8, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: "9", // 路由唯一标识
//     path: "/components/openBusiness", // [必传]路径-对齐URL上的访问路径
//     name: "OpenBusiness", // [必传]路由名称
//     desc: "包含开放业务审批流等管理页面，展示开放业务订购的审批进度，使得运维人员来推动订购操作", // 路由描述
//     meta: { title: "开放业务审批流", icon: "" }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 9, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: "一级", // 路由名称
//     children: []
//   },
//   {
//     id: '10', // 路由唯一标识
//     path: '/components/appSearch', // [必传]路径-对齐URL上的访问路径
//     name: 'AppSearch', // [必传]路由名称
//     desc: '包含应用查询等管理页面，', // 路由描述
//     meta: { title: '应用查询', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 10, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '11', // 路由唯一标识
//     path: '/components/supplierSearch', // [必传]路径-对齐URL上的访问路径
//     name: 'SupplierSearch', // [必传]路由名称
//     desc: '包含供应商查询等管理页面，', // 路由描述
//     meta: { title: '供应商查询', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 11, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '12', // 路由唯一标识
//     path: '/components/userManagement', // [必传]路径-对齐URL上的访问路径
//     name: 'UserManagement', // [必传]路由名称
//     desc: '包含供用户管理等管理页面，能够查询用户数据、查询开发商、创建idaas账户', // 路由描述
//     meta: { title: '用户管理', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 12, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '13', // 路由唯一标识
//     path: '/components/systemPerformance', // [必传]路径-对齐URL上的访问路径
//     name: 'SystemPerformance', // [必传]路由名称
//     desc: '', // 路由描述
//     meta: { title: '系统履约', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 13, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   },
//   {
//     id: '14', // 路由唯一标识
//     path: '/components/openBusinessClassification', // [必传]路径-对齐URL上的访问路径
//     name: 'OpenBusinessClassification', // [必传]路由名称
//     desc: '', // 路由描述
//     meta: { title: '开放业务分类管理', icon: '' }, // [必传]路由名称、图标
//     type: 1, // 默认为1表示由USF返回，如果需要跳转a链接为2, iframe则为3
//     group: 14, // 路由组唯一标识-对应菜单分组，如不需要分组可不传
//     groupName: '一级', // 路由名称
//     children: []
//   }
// ]

// export default routes
