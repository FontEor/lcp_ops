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
export const rules = {
  workOrderType: [{ required: true, message: "请选择工单类型", trigger: "blur" }],
  name: [
    { required: true, message: "请输入工单类型的名称", trigger: "blur" },
    {
      min: 2,
      max: 30,
      message: "名字长度在 2 到 30 个字符",
      trigger: "blur"
    }
  ]
};
export const ruleForm = {
  workOrderType: 0,
  name: ""
};
