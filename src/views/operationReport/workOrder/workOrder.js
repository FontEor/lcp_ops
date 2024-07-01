//工单状态
export const ticketStatusList = [
  {
    val: null,
    description: "全部"
  },
  {
    val: 1,
    description: "待处理"
  },
  {
    val: 2,
    description: "已响应"
  },
  {
    val: 3,
    description: "已关闭"
  }
];
//是否解决
export const solveList = [
  {
    val: null,
    description: "全部"
  },
  {
    val: 0,
    description: "未解决"
  },
  {
    val: 1,
    description: "已解决"
  }
];
//关单人
export const closeLister = [
  {
    val: null,
    description: "全部"
  },
  {
    val: 1,
    description: "客户"
  },
  {
    val: 2,
    description: "自动"
  }
];
//快捷选项的日期选择器
export const pickerOptions = {
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
};

export const closeDirectTypeStatus = {
  1: "客户",
  2: "自动"
};
export const workOrderStatus = {
  1: "待处理",
  2: "已响应",
  3: "已关闭"
};
export const whetherToSolveStatus = {
  0: "未解决",
  1: "已解决"
};
export const scoreStatus = {
  1: "1分",
  2: "2分",
  3: "3分",
  4: "4分",
  5: "5分"
};
export const cateListProps = {
  value: "code", //匹配响应数据中的id
  label: "typeName", //匹配响应数据中的typeName
  children: "children" //匹配响应数据中的children
};
export const pagination = {
  page: 1,
  pageSize: 10,
  total: 0
};
