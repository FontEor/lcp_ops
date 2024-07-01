<template>
  <div class="edi-wrapper">
    <el-form label-width="auto">
      <el-row
        :gutter="16"
        type="flex"
        justify="end"
        style="flex-wrap: wrap; flex-direction: row"
      >
        <el-col :span="8">
          <el-form-item label="业务条线">
            <el-select
              v-model="bizLine"
              placeholder="请选择业务条线"
              style="width: 100%"
            >
              <el-option
                v-for="item in businessLineOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司名称">
            <el-input
              v-model="companyName"
              placeholder="请输入公司名称"
              clearable
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="京东账号pin">
            <el-input
              v-model="pin"
              placeholder="请输入京东账号pin"
              clearable
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售/实施ERP">
            <el-input
              v-model="erp"
              placeholder="请输入销售/实施ERP"
              clearable
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提交时间">
            <el-date-picker
              clearable
              v-model="timeValue"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div style="float: right">
            <el-button type="primary" @click="getJosPinWhileList"
              >查 询</el-button
            >
            <el-button type="primary" @click="handleDetail()">新 建</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" height="558" :show-tooltip-when-overflow="true">
      <el-table-column label="序号" type="index" />
      <el-table-column label="业务条线" prop="bizLine">
        <template slot-scope="scope">
          {{ formatBizLine(scope.row.bizLine) }}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" prop="companyName" />
      <el-table-column label="京东账号pin" prop="pin" />
      <el-table-column label="销售/实施ERP" prop="erp" />
      <el-table-column label="更新日期" prop="updateTime">
        <template slot-scope="scope">
          {{ formatTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="160px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
              style="margin-right: 5px"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              style="margin-right: 5px"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建和编辑弹框 -->
    <el-dialog
      width="30%"
      height="100%"
      :title="pinTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogDetail"
      center
    >
      <el-form
        style="width: 90%"
        :rules="rules"
        :model="detailInfo"
        label-width="120px"
        ref="ruleForm"
      >
        <el-form-item label="业务条线" prop="bizLine">
          <el-select
            v-model="detailInfo.bizLine"
            placeholder="请选择业务条线"
            style="width: 100%"
          >
            <el-option
              v-for="item in bizLineOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            v-model="detailInfo.companyName"
            placeholder="请输入公司名称"
          />
        </el-form-item>
        <el-form-item label="京东账号pin" prop="pin">
          <el-input v-model="detailInfo.pin" placeholder="请输入京东账号pin" />
        </el-form-item>
        <el-form-item label="销售/实施ERP" prop="erp">
          <el-input v-model="detailInfo.erp" placeholder="请输入销售/实施ERP" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            maxlength="150"
            v-model="detailInfo.remark"
            show-word-limit
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="dialogDetail = false">取 消</el-button>
        <el-button @click="handleSave('ruleForm')" type="primary"
          >保 存</el-button
        >
      </div>
    </el-dialog>
    <Pagination
      :currentPage.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total.sync="pagination.total"
      :reloadTableData="getJosPinWhileList"
    />
  </div>
</template>

<script>
import lcp from "@/api/lcp/index";
import parseTime from "@/utils/parseTime";
import Pagination from "@/components/Pagination.vue";
import {
  businessLineOptions,
  pickerOptions,
  bizLineOptions,
  rules,
} from "./whitelist";
export default {
  name: "WhiteListManagement",
  components: {
    Pagination,
  },
  data() {
    return {
      bizLine: "全部",
      businessLineOptions,
      bizLineOptions,
      companyName: "",
      pin: "",
      erp: "",
      timeValue: ["", ""],
      pinTitle: "白名单新增京东账号pin",
      detailInfo: {
        bizLine: "",
        companyName: "",
        pin: "",
        erp: "",
        remark: "",
      },
      rules,
      pickerOptions,
      tableData: [],
      dialogDetail: false,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      saveType: 1, //1 代表新建   2//代表编辑
    };
  },
  mounted() {
    this.getJosPinWhileList();
  },
  methods: {
    //获取表格数据
    async getJosPinWhileList() {
      const params = {
        pageNum: this.pagination.page,
        pageSize: this.pagination.pageSize,
        bizLine: this.bizLine === "全部" ? null : this.bizLine,
        companyName: this.companyName || null,
        erp: this.erp || null,
        pin: this.pin || null,
        startTime: (this.timeValue && this.timeValue[0]) || null,
        endTime: (this.timeValue && this.timeValue[1]) || null,
      };
      const response = await lcp.whiteList
        .getJosPinWhileList(params)
        .catch((error) => {
          throw new Error(`getJosPinWhileList, ${error}`);
        });
      this.tableData = response.data.list;
      this.pagination.total = response.data.total;
    },
    //删除
    async handleDelete(row) {
      const params = {
        id: row.id,
      };
      await lcp.whiteList
        .deleteJosPinWhiteListById(params)
        .then((res) => {
          if (res.code === 20000) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getJosPinWhileList();
          }
        })
        .catch((error) => {
          throw new Error(`deleteJosPinWhiteListById, ${error}`);
        });
    },
    //保存
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let response;
          if (this.saveType === 1) {
            response = this.insertJosPinWhileList();
          } else {
            response = this.updateJosPinWhiteList();
          }
          response.then((res) => {
            if (res.code === 20000) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.dialogDetail = false;
              this.getJosPinWhileList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加白名单接口
    async insertJosPinWhileList() {
      const params = {
        bizLine: this.detailInfo.bizLine,
        companyName: this.detailInfo.companyName,
        erp: this.detailInfo.erp,
        pin: this.detailInfo.pin,
        remark: this.detailInfo.remark,
      };
      return await lcp.whiteList
        .insertJosPinWhileList(params)
        .catch((error) => {
          throw new Error(`insertJosPinWhileList, ${error}`);
        });
    },
    //更新白名单接口
    async updateJosPinWhiteList() {
      const params = {
        id: this.detailInfo.id,
        bizLine: this.detailInfo.bizLine,
        companyName: this.detailInfo.companyName,
        erp: this.detailInfo.erp,
        pin: this.detailInfo.pin,
        remark: this.detailInfo.remark,
      };
      return await lcp.whiteList
        .updateJosPinWhiteList(params)
        .catch((error) => {
          throw new Error(`updateJosPinWhiteList, ${error}`);
        });
    },
    formatBizLine(bizLine) {
      const res = this.businessLineOptions.find(
        (item) => item.value === bizLine
      );
      return res.label || "-";
    },
    formatTime(time) {
      return parseTime.timeInTable(time) || "-";
    },
    handleDetail(row) {
      if (row) {
        this.detailInfo.id = row.id;
        this.detailInfo.bizLine = row.bizLine;
        this.detailInfo.companyName = row.companyName;
        this.detailInfo.erp = row.erp;
        this.detailInfo.pin = row.pin;
        this.detailInfo.remark = row.remark;
        this.pinTitle = "白名单编辑京东账号pin";
        this.saveType = 2;
      } else {
        Object.keys(this.detailInfo).forEach((key) => {
          this.detailInfo[key] = "";
        });
        this.pinTitle = "白名单新增京东账号pin";
        this.saveType = 1;
      }
      this.dialogDetail = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.edi-wrapper {
  padding: 1rem;
  .dialog-wrapper {
    height: 60vh;
    overflow: auto;
    .basic-content {
      text-align: left;
      margin-left: 10px;
    }
    .detail-title {
      font-size: 16px;
      font-weight: 700;
      text-align: left;
      margin: 20px;
    }
  }
  .special-configuration-form {
    width: 480px;
    .special-configuration-content {
      margin: 20px;
      text-align: left;
    }
  }
  .el-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
