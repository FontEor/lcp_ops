// 业务条线
export const businessLineOptions = [
  {
    value: null,
    label: "全部"
  },
  {
    value: 0,
    label: "快递"
  },
  {
    value: 1,
    label: "快运"
  },
  {
    value: 2,
    label: "仓配一体"
  },
  {
    value: 3,
    label: "冷链"
  },
  {
    value: 4,
    label: "其他"
  }
];
// 新建和编辑业务条线
export const bizLineOptions = [
  {
    value: 0,
    label: "快递"
  },
  {
    value: 1,
    label: "快运"
  },
  {
    value: 2,
    label: "仓配一体"
  },
  {
    value: 3,
    label: "冷链"
  },
  {
    value: 4,
    label: "其他"
  }
];
//新建和编辑表单验证
export const rules = {
  bizLine: [{ required: true, message: "请选择业务条线", trigger: "blur" }],
  companyName: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
  pin: [{ required: true, message: "请输入京东账号pin", trigger: "blur" }],
  erp: [{ required: true, message: "请输入销售/实施ERP", trigger: "blur" }]
};
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
