<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane label="系统履约">
        <el-form :model="formInline" ref="formInline" :inline="true">
          <el-form-item label="用户账户" prop="pin">
            <el-input v-model="formInline.pin" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="value">
            <el-select v-model="formInline.value" placeholder="请选择状态">
              <el-option
                v-for="item in formInline.options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button type="primary" @click="resetForm('formInline')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          :data="systemPerformanceTable"
          :default-sort="{ prop: 'statusUpdateTime', order: 'descending' }"
        >
          <el-table-column label="编号" align="center" type="index" />
          <el-table-column label="用户账户" align="center" prop="pin" />
          <el-table-column label="系统类型" align="center" prop="systemType" />
          <el-table-column label="应用场景" align="center" prop="schemeTypeDisplay" />
          <el-table-column label="订购时长" align="center" prop="limit" />
          <el-table-column label="状态" align="center">
             <template slot-scope="{ row }">
              <span
                :class="{
                    primaryColor:
                      row.statusDisplay ==='审核中',
                    dangerColor:
                      row.statusDisplay ==='已驳回',
                    successColor: 
                      row.statusDisplay ==='运行中',
                  }
                "
                >{{ row.statusDisplay}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态更新时间"  sortable align="center" prop="statusUpdateTime" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleEdit(row)"
                >编辑</el-button
              >
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleSeeDetail(row)"
                >查看详情</el-button
              >
              <!-- 编辑Dialog -->
              <el-dialog
                width="500px"
                height="100%"
                :title="dailogTitleType"
                :visible.sync="dialogFormVisible"
              >
                <el-form class="edit" :model="formEdit" label-width="180px">
                  <el-form-item label="系统ID："> <div>{{formEdit.systemId}}</div></el-form-item>
                  <el-form-item label="系统名称："><div>{{formEdit.systemName}}</div></el-form-item>
                  <el-form-item label="用户账户："><div>{{formEdit.pin}}</div></el-form-item>
                  <el-form-item label="应用场景："><div>{{formEdit.schemeTypeDisplay}}</div></el-form-item>
                  <el-form-item label="订购时长："><div>{{formEdit.limit}}</div></el-form-item>
                  <el-form-item label="申请系统时间："><div>{{formEdit.createTime}}</div></el-form-item>
                  <el-form-item label="状态更新时间："><div>{{formEdit.statusUpdateTime}}</div></el-form-item>
                  <el-form-item label="选择状态：" prop="value">
                  <el-select v-model="value">
                    <el-option
                      v-for="item in editOptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                  <el-form-item v-if="value===3" label="链接：">
                    <el-input
                      style="width: 215px"
                      v-model="formEdit.url"
                    ></el-input>
                  </el-form-item>
                  <!-- 暂时不需要邮件同步客户，保留代码注释，后续可能需要 -->
                  <!-- <el-form-item label="发送客户通知：" prop="sendMessage">
                    <el-switch
                      style="margin-left: -180px"
                      v-model="formEdit.sendMessage"
                      active-color="#13ce66"
                      inactive-color="#eee"
                      @change="changeSwitch"
                    >
                    </el-switch>
                  </el-form-item>
                  <el-form-item v-if="formEdit.sendMessage" prop="messageContent">
                    <el-input
                      style="width: 215px"
                      type="textarea"
                      v-model="formEdit.messageContent"
                      show-word-limit
                      maxlength="200"
                    ></el-input>
                  </el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="
                      onChangeSave();
                      dialogFormVisible = false;
                    "
                    >提交</el-button
                  >
                  <el-button @click="fetchData();dialogFormVisible = false">取消</el-button>
                </div>
              </el-dialog>
              <!-- 查看详情dialog -->
              <el-dialog
                width="800px"
                height="100%"
                :title="dailogTitleType"
                :visible.sync="dialogDetailFormVisible"
              >
                <el-row>
                  <el-form class="detail" :model="detail" label-width="180px">
                    <el-col :span="12">
                      <el-form-item label="系统ID："> <div>{{detail.systemId}}</div></el-form-item>
                      <el-form-item label="系统名称："> <div>{{detail.systemName}}</div></el-form-item>
                      <el-form-item label="系统状态："><div>{{detail.statusDisplay}}</div></el-form-item>
                      <el-form-item label="应用场景："><div>{{detail.schemeTypeDisplay}}</div></el-form-item>
                      <el-form-item label="订购时长："><div>{{detail.limit}}</div></el-form-item>
                      <el-form-item label="申请系统时间："><div>{{detail.createTime}}</div></el-form-item>
                      <el-form-item label="状态更新时间："><div>{{detail.statusUpdateTime}}</div></el-form-item>
                      <el-form-item v-if="detail.status===3" label="链接："><div>{{detail.url}}</div></el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="用户账户："><div>{{detail.pin}}</div></el-form-item>
                      <el-form-item label="手机号："><div>{{detail.phone}}</div></el-form-item>
                      <!-- <el-form-item label="邮箱："><div>{{detail.email}}</div></el-form-item> -->
                    </el-col>
                  </el-form>
                </el-row>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogDetailFormVisible = false"
                    >关闭</el-button
                  >
                </div>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap" v-if="systemPerformanceTable.length !== 0">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :current-page.sync="page"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @prev-click="prevClick"
            @next-click="nextClick"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from "../../utils/request";

export default {
  name: "SystemPerformance",
  data() {
    return {
      systemPerformanceTable:[],
      dailogTitleType: '',
      formInline: {
        pin: "",
        value: "",
        options: [
          {
            value: 0,
            label: "全部",
          },
          {
            value: 1,
            label: "审核中",
          },
          {
            value: 2,
            label: "创建中",
          },
          {
            value: 3,
            label: "运行中",
          },
          {
            value: 4,
            label: "已驳回",
          },
        ],
      },
      formEdit: {
        url: "",
        messageContent: "",
        sendMessage: false,
        status:0,
      },
      value:1,
      editOptions:[
          {
            value: 1,
            label: "审核中",
          },
          {
            value: 2,
            label: "创建中",
          },
          {
            value: 3,
            label: "运行中",
          },
          {
            value: 4,
            label: "已驳回",
          },
        ],
      dialogFormVisible: false,
      dialogDetailFormVisible: false,
      page: 1,
      pageSize: 10,
      total: 100,
      detail:{},
      submitForm:{},
      updateId:1
    };
  },
  methods: {
    onSubmit() {
      console.log('pin',this.formInline.pin);
      console.log('status',this.formInline.value);
      const url = "/saas/rest/wms/list";
      request({
        url,
        method: "get",
        params: {
          pin: this.formInline.pin,
          status:this.formInline.value,
          page:1,
          pageSize:this.pageSize,
        },
      })
        .then((res) => {
          this.systemPerformanceTable = res.data.list;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = 1;
        })
        .catch((e) => {
          console.log("按钮提交错误：", e);
        });
    },
    fetchData() {
      const url = "/saas/rest/wms/list";
      request({
        url,
        method: "get",
        params: {
          pin: this.formInline.pin,
          status:this.formInline.value,
          page:this.page,
          pageSize:this.pageSize,
        },
      })
        .then((res) => {
          this.systemPerformanceTable = res.data.list;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
        })
        .catch((e) => {
          console.log("按钮提交错误：", e);
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.onSubmit()
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.dailogTitleType = "编辑";
      const url = "/saas/rest/wms/details";
      request({
        url,
        method: "get",
        params: {
          id: row.id,
        },
      })
        .then((res) => {
          console.log(res);
          this.formEdit = res.data
          this.value  = res.data.status
          this.updateId = res.data.id
          console.log('this.updateId',this.updateId);
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    handleSeeDetail(row) {
      this.dialogDetailFormVisible = true;
      this.dailogTitleType = "系统详情";
      const url = "/saas/rest/wms/details";
      request({
        url,
        method: "get",
        params: {
          id: row.id,
        },
      })
        .then((res) => {
          console.log(res);
          this.detail = res.data
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    onChangeSave(){
     this.submitForm={
       id:this.updateId,
       status:this.value,
       sendMessage:false,
       url:this.formEdit.url,
     }
     console.log('this.submitForm',this.submitForm);
     const url = "/saas/rest/wms/edit";
      request({
        url,
        method: "post",
        data:this.submitForm
      })
        .then((res) => {
          console.log(res);
          this.$message.success('提交成功')
          this.fetchData()
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },


    handleCurrentChange(val) {
      console.log(val);
      const url = "/saas/rest/wms/list";
      request({
        url,
        method: "get",
        params: {
          pin: this.formInline.pin,
          status:this.formInline.value,
          page:val,
          pageSize:this.pageSize,
        },
      })
        .then((res) => {
          this.systemPerformanceTable = res.data.list;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    prevClick() {
      const url = "/saas/rest/wms/list";
      request({
        url,
        method: "get",
        params: {
          pin: this.formInline.pin,
          status:this.formInline.value,
          pageSize: this.pageSize,
          page: this.page - 1,
        },
      })
        .then((res) => {
          this.systemPerformanceTable = res.data.list;
          this.total = res.data.total
          this.pageSize = res.data.pageSize
        })
        .catch((e) => {
          console.log("请求下一页错误", e);
        });
    },
    nextClick() {
      const url = "/saas/rest/wms/list";
      request({
        url,
        method: "get",
        params: {
          pin: this.formInline.pin,
          status:this.formInline.value,
          pageSize: this.pageSize,
          page: this.page + 1,
        },
      })
        .then((res) => {
          this.systemPerformanceTable = res.data.list;
          this.total = res.data.total
          this.pageSize = res.data.pageSize
        })
        .catch((e) => {
          console.log("请求下一页错误", e);
        });
    },
  },
  mounted() {
    const url = "/saas/rest/wms/list";
    request({
      url,
      method: "get",
      params: {
        page:1,
        pageSize:10
      },
    })
      .then((res) => {
        this.systemPerformanceTable = res.data.list; 
        this.total = res.data.total
        this.pageSize = res.data.pageSize
      })
      .catch((e) => {
        console.log("请求错误", e);
      });
  },
};
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
.edit div {
      text-align:left;
      margin-left:36px;
    }
.detail div {
  text-align:left;
}

.primaryColor {
  color: #FFB600;
}
.dangerColor {
  color: #e1251b;
}
.successColor {
  color:#26A872;
}
</style>