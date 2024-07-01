<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="tabs-wrap">
      <el-tab-pane class="search-bar-wrap" label="常见问题维护" name="questionMaintain">
        <div class="flex-1">
          <span>问题类型</span>
          <el-tooltip class="item" effect="dark" content="可在【工单类型维护】菜单中维护问题类型。" placement="top">
            <i class="el-icon-help-solid"></i>
          </el-tooltip>
          <el-cascader filterable
            class="cascader-item"
            v-model="searchKeyList"
            :options="searchOptions"
            :props="{value:'code', label:'typeName', children:'children'}"
            >
            </el-cascader>
        </div>
        <el-button type="primary" @click="handleCreate()">新建</el-button>
      </el-tab-pane>
    </el-tabs>
    <el-table class="flex-1" :data="tableData" style="width: 100%" height="500">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="remark" label="问题描述" width="400%">
         <template slot-scope="scope">
            <el-button size="mini" type="warning" plain class="top-icon" v-if="+scope.row.top === 1">顶</el-button>
          {{ scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updateUser" label="更新人"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      <el-table-column prop="status" label="状态" width="70">
        <template slot-scope="scope">
          {{ statusText(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览量" width="70"></el-table-column>
      <el-table-column label="操作" width="270">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleCreate(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="primary" plain @click="handleOffLine(scope.row)"  v-if="+scope.row.status === 2">下线</el-button>
          <el-button size="mini" type="primary" plain @click="handlePublic(scope.row)" v-if="+scope.row.status === 1 || +scope.row.status === 3">发布</el-button>
          <el-button size="mini" type="warning" plain @click="handleChangeTopStatus(scope.row, 1)" v-if="+scope.row.top === 0">置顶</el-button>
          <el-button size="mini" type="warning" plain @click="handleChangeTopStatus(scope.row, 0)" v-if="+scope.row.top === 1">取消置顶</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    class="pagination"
        background
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <editQuestion v-if="dialogVisible" :searchKeyList="searchKeyList" :searchOptions="searchOptions" :dialogVisible.sync="dialogVisible" :editType="editType" :rowDetail="editRowDetail" @change="refreshList"></editQuestion>
  </div>
</template>
<script>
import editQuestion from './editQuestion.vue';
import {questionRequest} from "@/api/module/questionMaintain";
const statusMap = new Map([
                [1, '编辑中'],
                [2, '已发布'],
                [3, '已下线']
            ])
export default {
  data() {
    return {
      activeName: "questionMaintain",
      searchKeyList: [],
      searchOptions: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      editRowDetail: {},
      editType: null, // 1: 编辑；2:新增
    };
  },
  computed: {
    statusText() {
        return status => statusMap.get(+status)
    }
  },
  watch: {
    searchKeyList: {
      handler() {
        this.refreshList();
      },
      deep: true,
    }
  },
  mounted() {
    this.getWorkOrderType()
  },
  methods: {
    handleCurrentChange(newCurrentPage) {
      this.currentPage = newCurrentPage;
      this.getQuestionList()
    },
    handleDelete (row) {
        this.$confirm('删除后，用户将无法在开放平台外网看到该问题，且无法恢复，请确认是否删除？', '删除提示', {
            confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
            // 确认
            const response = await questionRequest.deleteQuestion({id: row.id});
            if (response && +response.code === 20000) {
              this.getQuestionList();
            }

        })
        .catch(() => {})
    },
    handleOffLine(row = {}) {
        this.$confirm('下线后，用户将无法在开放平台外网看到该问题，请确认是否下线？', '下线提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
            // 确认
            const response = await questionRequest.downQuestion({id: row.id});
            if (response && +response.code === 20000) {
              this.getQuestionList();
            }
        })
        .catch(() => {})
    },
    handlePublic(row = {}) {
        this.$confirm('发布后，用户将在开放平台外网看到该问题，请确认是否发布？', '发布提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
            // 确认
            questionRequest.publishQuestion({id: row.id})
            .then(response => {
              if (response && +response.code === 20000) {
                this.getQuestionList();
              }
            })
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handleChangeTopStatus(row={}, top) {
      const params = {
        id: row.id,
        top: +top
      }
      questionRequest.topQuestion(params)
      .then(response => {
        if (response && +response.code === 20000) {
          this.getQuestionList()
        }
      })

    },
    async handleCreate(row = {}) {
        if(Object.keys(row).length) {
            const detail = await this.getRowDetail(row.id);
            this.editRowDetail = detail || {};
            this.editType = 1;
        } else {
            this.editRowDetail = Object.assign({}, row, {workOrderTypeCode: this.searchKeyList.at(-1)});
            this.editType = 2;
        }
        this.dialogVisible = true;

    },
    getRowDetail(id) {
      return new Promise(async (res) => {
        const params = {
          id
        }
        const response = await questionRequest.getQuestionDetailById(params);
        const {code, data, message} = response || {};
        if (+code === 20000) {
          res(data);
        } else {
          this.$message.error(message)
        }
      })
    },
    async getWorkOrderType() {
        const response = await questionRequest.queryWorkOrderTypeList()
        if(+response.code === 20000) {
            this.searchOptions = response.data;
            this.searchKeyList = this.filterInitSearchKeyList(response.data || [])
        } else {
            this.$message.error('获取问题类型接口出错')
        }
    },
    async getQuestionList() {
      // this.tableData = []
        const param = {
           workOrderTypeCode: this.searchKeyList.at(-1),
           pageSize: this.pageSize,
           pageNumb: this.currentPage,
        }
        const response = await questionRequest.queryQuestionList(param);
        const {code, message, data} = response || {};
        if (+code === 20000) {
          const {list, total} = data;
          this.total = total;
          this.tableData = list;
        } else {
          this.$message.error(message);
        }
    },
    refreshList(editType) {
      (!editType) && (this.currentPage = 1);
      this.getQuestionList()
    },
    filterInitSearchKeyList(data) {
      const resultList = []
      const loop = (list) => {
        const firstItem = list[0];
        resultList.push(firstItem.code)
        if (firstItem.children && firstItem.children.length) {
          loop(firstItem.children)
        }
      }
      loop(data);
      return resultList
    },
  },
  components: {
    editQuestion
  },
  name: "questionMaintain"
};
</script>
<style lang="scss" scoped>
.app-container {
    height:calc(100vh - 200px);
    display: flex;
    flex-direction:column;
}
.el-icon-help-solid {
  margin: 0 8px 0 2px;
  color: rgba(110, 110, 110, 0.6);
}
.tabs-wrap {
    margin-bottom: 22px;
}
.search-bar-wrap {
  display: flex;
  align-items: center;
}
.flex-1 {
  flex: 1;
}
.top-icon {
    padding: 2px;
   font-size: 10px!important;
}
.pagination {
    margin-top: 20px;
    text-align: right;
}
.cascader-item {
  min-width: 265px;
}
</style>
