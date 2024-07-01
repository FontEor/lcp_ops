<template>
  <div class="edi-wrapper">
    <el-form :inline="true" style="padding-top:10px">
      <el-form-item label="服务域">
        <el-input v-model="domainQueryLike" placeholder="输入服务域编码"></el-input>
      </el-form-item>
      <el-form-item label="URL">
        <el-input v-model="urlQueryLike" placeholder="输入URL"></el-input>
      </el-form-item>
      <el-form-item label="审批类型">
        <el-select v-model="statusQueryLike" placeholder="请选择审批类型" clearable>
          <el-option v-for="status in statusList" :key="status.val" :value="status.val" :label="status.description" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="queryApiAppealData">查 询</el-button>
    </el-form>

    <el-table :data="tableData" :show-tooltip-when-overflow="true">
      <el-table-column label="序号" type="index" />
      <el-table-column label="服务域编码" prop="domainCode" />
      <el-table-column label="API名称" prop="apiName" />
      <el-table-column label="URL" prop="url" />
      <el-table-column label="申诉场景" prop="apiTag" />
      <el-table-column label="申诉时间" prop="appealTime">
        <template slot-scope="scope">
          {{ formatTime(scope.row.appealTime) }}
        </template> </el-table-column
      >/>
      <el-table-column label="申诉人" align="center" prop="declarant" width="150px" />
      <el-table-column label="状态" prop="status" :formatter="formatStatus" />
      <el-table-column label="审核人" prop="checker" />
      <el-table-column label="审核时间" prop="checkTime">
        <template slot-scope="scope">
          {{ formatTime(scope.row.checkTime) }}
        </template> </el-table-column
      >/>
      <el-table-column label="操作" align="left" width="160px">
        <template slot-scope="scope" style="white-space: nowrap">
          <el-button-group>
            <el-button size="mini" type="text" @click="handleDetail(scope.row)" style="margin-right: 5px">
              详情
            </el-button>
            <el-button size="mini" type="text" style="margin-right: 5px" @click="handleAppeal(scope.row)">
              审批
            </el-button>
          </el-button-group>
          <!-- 详情 -->
          <el-dialog width="30%" height="100%" title="详情" :close-on-click-modal="false" :visible.sync="dialogDetail">
            <div>
              <el-form style="width: 400px" :model="detailInfo" label-width="100px">
                <el-form-item label="服务域编码" prop="domainCode">
                  <el-input v-model="detailInfo.domainCode" disabled />
                </el-form-item>
                <el-form-item label="API名称" prop="apiName">
                  <el-input v-model="detailInfo.apiName" disabled />
                </el-form-item>
                <el-form-item label="URL" prop="url">
                  <el-input v-model="detailInfo.url" disabled />
                </el-form-item>
                <el-form-item label="申诉场景" prop="apiTag">
                  <el-input v-model="detailInfo.apiTag" disabled />
                </el-form-item>
                <el-form-item label="申诉原因" prop="apiTag">
                  <el-input type="textarea" v-model="detailInfo.appealReason" disabled />
                </el-form-item>
                <el-form-item label="申诉时间" prop="appealTime">
                  <el-input v-model="detailInfo.appealTime" disabled />
                </el-form-item>
                <el-form-item label="申诉人" prop="declarant">
                  <el-input v-model="detailInfo.declarant" disabled />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-input v-model="hashStatusMap[detailInfo.status]" disabled />
                </el-form-item>
                <el-form-item label="审核人" prop="checker">
                  <el-input v-model="detailInfo.checker" disabled />
                </el-form-item>
                <el-form-item label="审核时间" prop="checkTime">
                  <el-input v-model="detailInfo.checkTime" disabled />
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogDetail = false">确定</el-button>
            </div>
          </el-dialog>
          <!-- 审批 -->
          <el-dialog width="30%" height="100%" title="详情" :close-on-click-modal="false" :visible.sync="dialogAppeal">
            <div>
              <el-form style="width: 400px" :model="appealInfo" label-width="100px">
                <el-form-item label="服务域编码" prop="domainCode">
                  <el-input v-model="appealInfo.domainCode" disabled />
                </el-form-item>
                <el-form-item label="API名称" prop="apiName">
                  <el-input v-model="appealInfo.apiName" disabled />
                </el-form-item>
                <el-form-item label="URL" prop="url">
                  <el-input v-model="appealInfo.url" disabled />
                </el-form-item>
                <el-form-item label="申诉场景" prop="apiTag">
                  <el-input v-model="appealInfo.apiTag" disabled />
                </el-form-item>
                <el-form-item label="申诉原因" prop="apiTag">
                  <el-input type="textarea" v-model="appealInfo.appealReason" disabled />
                </el-form-item>
                <el-form-item label="申诉时间" prop="appealTime">
                  <el-input v-model="appealInfo.appealTime" disabled />
                </el-form-item>
                <el-form-item label="申诉人" prop="declarant">
                  <el-input v-model="appealInfo.declarant" disabled />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-input v-model="hashStatusMap[appealInfo.status]" disabled />
                </el-form-item>
                <el-form-item label="审批结果" prop="action">
                  <el-select v-model="appealInfo.action" placeholder="审批结果" clearable>
                    <el-option v-for="action in appealActionList" :key="action.val" :value="action.val" :label="action.description" />
                  </el-select>
                </el-form-item>
                <el-form-item label="审批理由" prop="checkReason">
                  <el-input type="textarea" v-model="appealInfo.checkReason" />
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogAppeal = false">取消</el-button>
              <el-button type="primary" @click="checkApiAppeal">
                确定
              </el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :currentPage.sync="pagination.page" :pageSize.sync="pagination.pageSize" :total.sync="pagination.total" :reloadTableData="queryApiAppealData" />
  </div>
</template>

<script>
import ApiAppeal from "@/api/gwApiDepot/ApiAppeal.ts";
import { UserModule } from "@/store/modules/user";
import parseTime from "@/utils/parseTime";
import Pagination from "@/components/Pagination.vue";
export default {
  name: "ApiAppealManagement",
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [],
      dialogDetail: false,
      dialogAppeal: false,
      domainQueryLike: "",
      urlQueryLike: "",
      statusQueryLike: "",
      statusList: [
        {
          val: 1,
          description: "待审核"
        },
        {
          val: 2,
          description: "通过"
        },
        {
          val: 3,
          description: "驳回"
        }
      ],
      appealActionList: [
        {
          val: 2,
          description: "通过"
        },
        {
          val: 3,
          description: "驳回"
        }
      ],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        sort: "appeal_time",
        order: "desc"
      },
      hashStatusMap: ["", "待审核", "通过", "驳回"],
      detailInfo: {
        domainCode: "",
        apiName: "",
        url: "",
        checkReason: "",
        status: "",
        apiTag: "",
        appealReason: "",
        declarant: "",
        appealTime: "",
        checker: "",
        checkTime: ""
      },
      appealInfo: {
        domainCode: "",
        apiName: "",
        url: "",
        checkReason: "",
        status: "",
        apiTag: "",
        appealReason: "",
        declarant: "",
        appealTime: "",
        checker: "",
        checkTime: "",
        action: ""
      },
      appealStatusDict: {
        1: "待审核",
        2: "通过",
        3: "驳回"
      }
    };
  },
  mounted() {
    this.queryApiAppealData();
  },
  methods: {
    async queryApiAppealData() {
      const page = this.pagination;
      const qo = {
        domainCode: this.domainQueryLike,
        url: this.urlQueryLike,
        status: this.statusQueryLike
      };
      const data = [page, qo];
      const response = await ApiAppeal.queryApiAppealData(data).catch(error => {
        throw new Error(`queryApiAppealData, ${error}`);
      });
      console.log("response:", response);
      this.tableData = response.data.rows;
      this.pagination.total = response.data.total;
      console.log("response:", this.tableData);
    },
    formatStatus(row, column, cellValue, index) {
      return this.appealStatusDict[cellValue];
    },
    formatTime(time) {
      return parseTime.timeInTable(time) || "-";
    },
    handleDetail(row) {
      this.detailInfo.domainCode = row.domainCode;
      this.detailInfo.url = row.url;
      this.detailInfo.apiName = row.apiName;
      this.detailInfo.apiTag = row.apiTag;
      this.detailInfo.status = row.status;
      this.detailInfo.appealReason = row.appealReason;
      this.detailInfo.checkReason = row.checkReason;
      this.detailInfo.declarant = row.declarant;
      this.detailInfo.appealTime = this.formatTime(row.appealTime);
      this.detailInfo.checker = row.checker;
      this.detailInfo.checkTime = this.formatTime(row.checkTime);
      this.dialogDetail = true;
    },
    handleAppeal(row) {
      this.appealInfo.domainCode = row.domainCode;
      this.appealInfo.url = row.url;
      this.appealInfo.apiName = row.apiName;
      this.appealInfo.apiTag = row.apiTag;
      this.appealInfo.status = row.status;
      this.appealInfo.appealReason = row.appealReason;
      this.appealInfo.checkReason = row.checkReason;
      this.appealInfo.declarant = row.declarant;
      this.appealInfo.appealTime = this.formatTime(row.appealTime);
      this.appealInfo.checker = row.checker;
      this.appealInfo.checkTime = this.formatTime(row.checkTime);
      this.dialogAppeal = true;
    },
    async checkApiAppeal() {
      const data = {
        domainCode: this.appealInfo.domainCode,
        url: this.appealInfo.url,
        apiTag: this.appealInfo.apiTag,
        checkReason: this.appealInfo.checkReason,
        status: this.appealInfo.action,
        checker: UserModule.username
      };
      const response = await ApiAppeal.checkApiAppeal(data)
        .then(res => {
          this.dialogAppeal = false;
          this.$message.success("审批成功");
        })
        .catch(error => {
          this.dialogAppeal = false;
          this.$message.error("审批失败");
        });
      console.log("response:", response);
    }
  }
};
</script>

<style lang="scss" scoped>
.edi-wrapper {
  padding: 10px;
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
