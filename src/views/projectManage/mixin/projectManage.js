import project from '@/views/projectManage/api/project'

/**
 * 项目管理(查询)
 */
export default {
  data() {
    return {
      visible: false,
      options: [
        {
          value: '1',
          label: '全部'
        },
        {
          value: '2',
          label: '选项二'
        }
      ],
      form: {
        createPin: '', // 页面筛选条件-创建人erp
        name: '', // 页面筛选条件-项目名称
        // serverType: '',  //页面筛选条件-项目类型(分析类，系统对接类),两个tab页使用
        status: '', // 页面筛选条件-项目状态
        currPage: 1, // 当前页 第1页为 1
        pageSize: 10 // 页大小
      },
      tableList: [
        {
          id: 'DJ321321',
          title: '这是项目名称',
          type: '2种任务类型',
          status: 1,
          statusTip: '未提交'
        },
        {
          id: 'DJ321322',
          title: '这是项目名称',
          type: '2种任务类型',
          status: 2,
          statusTip: '审批中'
        },
        {
          id: 'DJ321323',
          title: '这是项目名称',
          type: '2种任务类型',
          status: 3,
          statusTip: '审批失败'
        },
        {
          id: 'DJ321324',
          title: '这是项目名称',
          type: '2种任务类型',
          status: 4,
          statusTip: '计算中',
          children: [
            {
              id: 'EJ321321',
              title: '这是项目名称',
              type: '2种任务类型',
              status: 4,
              statusTip: '计算中'
            }
          ]
        }
      ],
      total: 100, // 数据总量
      tableListLoading: true,
      currentPage: 1
    }
  },
  created() {
    // this.fetchData()
    // this.getData()
  },
  methods: {
    getData() {
      const data = Object.assign({}, this.form, {
        serverType: '' // this.serverType
      })
      project.search(data).then((res) => {
        this.tableListLoading = false
        this.tableList = res.data.rows
        this.form.currPage = 1
        this.total = res.data.total
      }).catch(() => {
        this.tableListLoading = false
      })
    },
    createProject() { // 创建项目

    },
    /*
       * 查询按钮
       * */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

        } else {
          return false
        }
      })
    },
    /*
     * 分页
     * */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.form.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getData()
    },
    handleDelClick(row) {
      this.$confirm('确定要删除此项目吗？', {
        type: 'warning',
        center: true
      })
    },
    resetForm() { // 重置按钮
      this.form = this.$options.data().form
      this.tableList = this.$options.data().tableList
      this.total = this.$options.data().total
    }
  }
}
