import Vue from "vue";
import Router from "vue-router";
import Layout from "@/components/common/index.vue";
import { UserModule } from "@/store/modules/user";
import { SappModule } from "@/store/modules/app";

Vue.use(Router);

export const routes: any = [
  {
    path: "/404",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "",
        name: "404",
        meta: { title: "找不到该页面" },
        component: () => import("@/views/404.vue")
      }
    ]
  },
  // 首页
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "Home",
        meta: { title: "首页" },
        component: () => import("@/views/home/index.vue")
      }
    ]
  },
  // 平台内容管理
  {
    path: "/platform",
    name: "Platform",
    redirect: "/platform/document",
    component: Layout,
    children: [
      // 平台内容管理-文档管理
      {
        path: "document",
        name: "Document",
        meta: { title: "文档管理" },
        component: () => import("@/views/doc/index.vue")
      },
      // 平台内容管理-文档管理（国际站）
      {
        path: "documentInternational",
        name: "DocumentInternational",
        meta: { title: "文档管理（国际站）" },
        component: () => import("@/views/docInternational/index.vue")
      },
      // 平台内容管理-常见问题(国际站)
      {
        path: "questionInternational",
        name: "QuestionInternational",
        meta: { title: "常见问题（国际站）" },
        component: () => import("@/views/question/international/index.vue")
      },
      // 平台内容管理-常见问题
      // {
      //   path: "question",
      //   name: "Question",
      //   meta: { title: "常见问题" },
      //   component: () => import("@/views/question/index.vue")
      // },
      {
        // 平台内容管理-常见问题维护
        path: "questionMaintain",
        name: "QuestionMaintain",
        meta: { title: "常见问题维护" },
        component: () => import("@/views/questionMaintain/index.vue")
      },
      // 平台内容管理-基础SDK管理
      {
        path: "baseSdk",
        name: "BaseSdk",
        component: () => import("@/views/sdk/baseSdk.vue"),
        meta: { title: "基础SDK管理" }
      },
      // （已停用）平台内容管理-消息公告
      {
        path: "notice",
        name: "Notice",
        component: () => import("@/views/notice/index.vue"),
        meta: { title: "消息公告" }
      },
      // （已停用）平台内容管理-意见反馈
      {
        path: "feedback",
        name: "Feedback",
        component: () => import("@/views/feedback/index.vue"),
        meta: { title: "意见反馈" }
      },
      // 平台内容管理-工单类型维护
      {
        path: "workOrderType",
        name: "WorkOrderType",
        component: () => import("@/views/workOrderType/index.vue"),
        meta: { title: "工单类型维护" }
      },
      
      // 平台内容管理-域名证书文件
      {
        path: "domainCertificate",
        name: "domainCertificate",
        component: () => import("@/views/domainCertificate/index.vue"),
        meta: { title: "域名证书文件" }
      },
      
      // 平台内容管理-沙箱工具维护
      {
        path: "sandbox",
        name: "sandbox",
        component: () => import("@/views/sandbox/index.vue"),
        meta: { title: "沙箱工具维护" }
      }
    ]
  },
  // 用户管理
  {
    path: "/user",
    name: "User",
    redirect: "/user/search",
    component: Layout,
    children: [
      // 用户管理-成员信息查询
      {
        path: "search",
        name: "Search",
        meta: { title: "成员信息查询" },
        component: () => import("@/views/userManagement/index.vue")
      },
      // 用户管理-成员信息查询
      {
        path: "I18nMembershipInfoQuery",
        name: "I18nMembershipInfoQuery",
        meta: { title: "国际成员信息查询" },
        component: () => import("@/views/User/I18nMembershipInfoQuery/index.vue")
      },

      // 用户管理-成员信息查询-内部开发团队管理
      {
        path: "internalDevelopmentTeam",
        name: "InternalDevelopmentTeam",
        meta: { title: "内部开发团队管理" },
        component: () => import("@/views/userManagement/internalDevelopmentTeam/index.vue")
      },
      // 用户管理-开发商管理
      { path: "ISV", name: "ISV", redirect: "/user/ISV/certification" },
      // 用户管理-开发商管理-资质认证
      {
        path: "/user/ISV/certification",
        name: "Certification",
        meta: { title: "资质认证" },
        component: () => import("@/views/business/index.vue")
      },
      // 用户管理-开发商管理-开发团队管理
      {
        path: "/user/ISV/information",
        name: "Information",
        meta: { title: "开发团队管理" },
        component: () => import("@/views/business/information.vue")
      },
      // 用户管理-开发商管理-国际资质认证
      {
        path: "/user/ISV/i18nCertification",
        name: "I18nCertification",
        meta: { title: "国际资质认证" },
        component: () => import("@/views/business/i18nQualification/index.vue")
      },
      // 用户管理-开发商管理-国际开发团队管理
      {
        path: "/user/ISV/i18nInformation",
        name: "I18nInformation",
        meta: { title: "国际开发团队管理" },
        component: () => import("@/views/business/i18nInformation/index.vue")
      },
      // （已停用）用户管理-开发商管理-更改手机号
      {
        path: "/user/ISV/updateMobile",
        name: "UpdateMobile",
        component: () => import("@/views/business/updateMobile.vue"),
        meta: { title: "更改手机号" }
      },
      // 用户管理-EDI商家打标
      {
        path: "/user/EDI/merchantManagement",
        name: "MerchantManagement",
        component: () => import("@/views/userManagement/merchantManagement/index.vue"),
        meta: { title: "EDI商家打标" }
      },
      // 用户管理-JOS应用创建白名单
      {
        path: "/user/EDI/whitelistManagement",
        name: "WhitelistManagement",
        component: () => import("@/views/userManagement/whitelistManagement/index.vue"),
        meta: { title: "JOS应用创建白名单" }
      },
      // （已停用）用户管理-SaaS管理
      {
        path: "SaaS",
        name: "SaaS",
        component: () => import("@/views/systemPerformance/index.vue"),
        meta: { title: "SaaS管理" }
      }
    ]
  },
  // 应用查询
  {
    path: "/DevOps/application",
    component: Layout,
    children: [
      {
        path: "",
        name: "Application",
        meta: { title: "国内应用查询" },
        component: () => import("@/views/appSearch/index.vue")
      },
      {
        path: "international",
        name: "ApplicationInternational",
        meta: { title: "国际应用查询" },
        component: () => import("@/views/appSearchInternational/index.vue")
      }
    ]
  },
  // 对接方案管理
  {
    path: "/DevOps/openBusiness",
    name: "OpenBusiness",
    redirect: "/DevOps/openBusiness/classification",
    component: Layout,
    children: [
      // 对接方案管理-方案类型配置
      {
        path: "/DevOps/openBusiness/classification",
        name: "Classification",
        meta: { title: "方案类型配置" },
        component: () => import("@/views/openBusinessClassification/index.vue")
      },
      // 国际方案类型配置
      {
        path: "/DevOps/openBusiness/classificationInternational",
        name: "ClassificationInternational",
        meta: { title: "国际方案类型配置" },
        component: () => import("@/views/openBusinessClassificationInternational/index.vue")
      },
      // 对接方案管理-对接方案打标
      {
        path: "/operationReport/dockingScheme",
        name: "DockingScheme",
        meta: { title: "对接方案打标" },
        component: () => import("@/views/operationReport/dockingScheme/index.vue")
      },
      // 方案审批查询（审批进度查询）
      {
        path: "/DevOps/openBusiness/approvalFlow",
        name: "ApprovalFlow",
        meta: { title: "方案审批查询" },
        component: () => import("@/views/openBusiness/index.vue")
      }
    ]
  },
  // API打标
  {
    path: "/apiAppeal",
    component: Layout,
    children: [
      {
        path: "",
        name: "ApiAppeal",
        meta: { title: "API审核" },
        component: () => import("@/views/apiAppeal/index.vue")
      }
    ]
  },
  // 运营数据查询
  {
    path: "/operationReport",
    name: "OperationReport",
    component: Layout,
    children: [
      // 运营数据查询-运营看板
      {
        path: "operationDashboard",
        name: "OperationDashboard",
        meta: { title: "运营看板" },
        component: () => import("@/views/operationReport/operationDashboard/index.vue")
      },
      {
        path: "apiScore",
        name: "apiScore",
        meta: { title: "API治理运营看板" },
        component: () => import("@/views/operationReport/apiScore/index.vue")
      },
      // （已停用）运营数据查询-运营看板
      {
        path: "customerStatistics",
        name: "CustomerStatistics",
        meta: { title: "客户统计" },
        component: () => import("@/views/operationReport/customerStatistics/index.vue")
      },
      // 运营数据查询-API统计
      {
        path: "apiStatistics",
        name: "ApiStatistics",
        meta: { title: "API统计" },
        component: () => import("@/views/operationReport/apiStatistics/index.vue")
      },
      // （已停用）运营数据查询-应用统计
      {
        path: "applicationStatistics",
        name: "ApplicationStatistics",
        meta: { title: "应用统计" },
        component: () => import("@/views/operationReport/applicationStatistics/index.vue")
      },
      // （已停用）运营数据查询-评论统计
      {
        path: "commentStatistics",
        name: "CommentStatistics",
        meta: { title: "评论统计" },
        component: () => import("@/views/operationReport/commentStatistics/index.vue")
      },
      // 运营数据查询-文档评价明细
      {
        path: "document-evaluation-details",
        name: "DocumentEvaluationDetails",
        meta: { title: "文档评价明细" },
        component: () => import("@/views/operationReport/document-evaluation-details/index.vue")
      },
      // 运营数据查询-客户对接明细
      {
        path: "customerConnectionDetails",
        name: "CustomerConnectionDetails",
        meta: { title: "客户对接明细" },
        component: () => import("@/views/operationReport/customerConnectionDetails/index.vue")
      },
      // 运营数据查询-转化漏斗
      {
        path: "/operationReport/conversionFunnel",
        name: "ConversionFunnel",
        meta: { title: "转化漏斗" },
        component: () => import("@/views/operationReport/ConversionFunnel/index.vue")
      },
      // 运营数据查询-运营数据维护
      { path: "operationalData", name: "OperationalData", redirect: "/operationReport/operationalData/nps" },
      // 运营数据查询-运营数据维护-NPS评分
      {
        path: "/operationReport/operationalData/nps",
        name: "Nps",
        meta: { title: "NPS评分" },
        component: () => import("@/views/operationReport/nps/index.vue")
      },
      // 运营数据查询-运营数据维护-服务覆盖率
      {
        path: "/operationReport/operationalData/coverage",
        name: "Coverage",
        meta: { title: "服务覆盖率" },
        component: () => import("@/views/operationReport/coverage/index.vue")
      },
      // 运营数据查询-工单记录
      {
        path: "workOrder",
        name: "workOrder",
        meta: { title: "工单记录" },
        component: () => import("@/views/operationReport/workOrder/index.vue")
      },
      // 运营数据查询-智能助手记录
      {
        path: "smartRobotRecord",
        name: "SmartRobotRecord",
        meta: { title: "智能助手记录" },
        component: () => import("@/views/operationReport/smartRobotRecord/index.vue")
      },
      // 运营数据查询-API调用量统计
      {
        path: "apiCallAmountStatistics",
        name: "apiCallAmountStatistics",
        meta: { title: "API调用量统计" },
        component: () => import("@/views/operationReport/apiCallAmountStatistics/index.vue")
      },
      
      // 运营数据查询-快快业务看板
      {
        path: "dockingKk",
        name: "dockingKk",
        meta: { title: "快快业务对接看板" },
        component: () => import("@/views/operationReport/dockingKk/index.vue")
      },

      // 运营数据查询-运营数据维护-快快业务看板权限
      {
        path: "/operationReport/operationalData/adminKk",
        name: "adminKk",
        meta: { title: "快快业务对接看板" },
        component: () => import("@/views/operationReport/dockingKk/admin.vue")
      },

    ]
  },
  // 运维工具
  {
    path: "/DevOps",
    name: "DevOps",
    redirect: "/DevOps/openBusiness/approvalFlow",
    component: Layout,
    children: [
      // （已停用）运维工具-缓存管理
      {
        path: "cache",
        name: "Cache",
        meta: { title: "缓存管理" },
        component: () => import("@/views/cache/index.vue")
      },
      // 日志工具
      {
        path: "loggingTool",
        name: "LoggingTool",
        meta: { title: "日志工具" },
        component: () => import("@/views/loggingTool/index.vue")
      },
      // 国际站日志工具
      {
        path: "i18nLoggingTool",
        name: "I18nLoggingTool",
        meta: { title: "国际站日志工具" },
        component: () => import("@/views/i18nLoggingTool/index.vue")
      },
      // 接口查询工具
      {
        path: "interfaceSearchTool",
        name: "InterfaceSearchTool",
        meta: { title: "接口查询工具" },
        component: () => import("@/views/devOps/interfaceSearchTool/index.vue")
      },
      // 运维工具-同步数据
      {
        path: "synData",
        name: "SynData",
        redirect: "/SynData/SynLogData"
      },
      // 运维工具-同步数据-成员信息
      {
        path: "/SynData/memberInformation",
        name: "SynDataMemberInformation",
        meta: { title: "成员信息" },
        component: () => import("@/views/synData/memberInformation/index.vue")
      },
      // 运维工具-同步数据-开发团队信息
      {
        path: "/DevOps/supplier",
        name: "Supplier",
        meta: { title: "开发团队信息" },
        component: () => import("@/views/supplierSearch/index.vue")
      },
      // 运维工具-同步数据-应用信息
      {
        path: "/SynData/applicationInformation",
        name: "SynDataApplicationInformation",
        meta: { title: "应用信息" },
        component: () => import("@/views/synData/applicationInformation/index.vue")
      },
      // 运维工具-同步数据-MQ日志
      {
        path: "/SynData/SynLogData",
        name: "SynLogData",
        meta: { title: "MQ日志" },
        component: () => import("@/views/synData/synlog.vue")
      },
      // 运维工具-API元数据查询
      {
        path: "apiManager",
        name: "ApiManager",
        meta: { title: "API元数据查询" },
        component: () => import("@/views/apiManager/index.vue")
      },
      // 运维工具-WS长连接管理
      {
        path: "/WSLongConnection",
        name: "WSLongConnection",
        redirect: "/WSLongConnection/logout"
      },
      // 运维工具-WS长连接管理-注销连接
      {
        path: "/WSLongConnection/logout",
        name: "Logout",
        meta: { title: "注销连接" },
        component: () => import("@/views/WSLongConnection/logoutConnection/index.vue")
      },
      // 运维工具-WS长连接管理-查看连接
      {
        path: "/WSLongConnection/check",
        name: "Check",
        meta: { title: "查看连接" },
        component: () => import("@/views/WSLongConnection/viewConnection/index.vue")
      }
    ]
  },
  {
    path: "/apiManagementAudit",
    // name: "apiManagementAudit",
    // redirect: "/apiManagementAudit/index",
    component: Layout,
    children: [
      {
        path: "",
        name: "apiManagementAudit",
        meta: { title: "API分级管理审核" },
        component: () => import("@/views/apiManagementAudit/index.vue")
      }
    ]
  },
  {
    path: "/I18nApiReleaseApproval",
    component: Layout,
    children: [
      {
        path: "",
        name: "I18nApiReleaseApproval",
        meta: { title: "国际API发布审批" },
        component: () => import("@/views/I18nApiReleaseApproval/index.vue")
      }
    ]
  },
  // （已停用）运营报表
  {
    path: "/report",
    component: Layout,
    children: [
      {
        path: "",
        name: "Report",
        meta: { title: "运营报表" },
        component: () => import("@/views/report/index.vue")
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const router: any = new Router({
  mode: "hash", // 推荐使用 history 便于埋点统计且地址栏路径较直观
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

// 全局路由状态
let checkStatus: boolean = false;

// 前端校验路由权限 [通过接口返回的路由与本地全量的路由进行对比]
const checkRouterRole = (routers: any, checkRouter: string) => {
  routers.forEach((route: any) => {
    if (route.name === checkRouter) {
      checkStatus = true;
      return checkStatus;
    }
    return route.children && route.children.length && checkRouterRole(route.children, checkRouter);
  });
  return checkStatus;
};

// 依赖服务端接口动态注册路由
// const dynamicRegistRouters = (routers: any) => {
//   router.addRoutes()
// }

// 路由守卫,路由跳转前做一些验证，比如登录验证（未登录去登录页）
router.beforeEach(async (to: any, from: any, next: any) => {
  SappModule.INIT_FRAMEWORK();
  // 使用keepAlive缓存组件
  SappModule.KEEP_ALIVE(to.name);
  // 重置路由状态
  checkStatus = false;
  // 校验登录
  const loginStatus = await UserModule.checkLogin();
  // 如无登录态则终止流程
  if (!loginStatus) return;
  // 获取菜单
  !SappModule.menus.length && (await SappModule.getMenus());
  // 校验菜单权限
  const routerWhiteList = ["/", "404", "OperationDashboard1"];
  if (routerWhiteList.some(white => white === to.name) || checkRouterRole(SappModule.menus, to.name)) {
    next();
  } else {
    next({ name: "404" });
  }
});

export default router;
