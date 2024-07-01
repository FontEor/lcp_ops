<template>
  <div class="information-search">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="公司名称">
        <el-input
          v-model="formInline.name"
          placeholder
          @keyup.enter.native="requestTableData"
        />
      </el-form-item>
      <el-form-item label="资质认证">
        <el-select
          v-model="formInline.value"
          @keyup.enter.native="requestTableData"
        >
          <el-option
            v-for="item in formInline.options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="formInline.tag"
          @keyup.enter.native="requestTableData"
          clearable
        >
          <el-option
            v-for="item in formInline.tagoptions"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="requestTableData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="itemsClone" style="width: 100%">
      <el-table-column label="序号" type="index" :index="indexMethod" />
      <el-table-column label="公司名称" prop="name" align="center" />
      <el-table-column
        label="资质类型"
        prop="qualificationType"
        align="center"
      />
      <el-table-column label="更新人" prop="updateUser" align="center" />
      <el-table-column label="更新时间" prop="updateTime" align="center" />
      <el-table-column label="入驻时间" prop="applyTime" />
      <el-table-column label="操作" align="center">
        <template slot="header" />
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleClickDetail(scope.$index, scope.row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="pagination.total"
      :current-page.sync="pagination.page"
      :page-size.sync="pagination.pageSize"
      :total="pagination.total"
      layout="prev, pager, next, jumper"
      background
      @current-change="requestTableData"
      @size-change="requestTableData"
    />

    <!-- 开发商详情对话框 -->
    <el-dialog
      class="isv-detail-dialog"
      title="开发商详情"
      width="720px"
      :close-on-click-modal="false"
      :visible.sync="isvDetailDialogVisible"
      @close="$refs.isvDetailForm.resetFields()"
    >
      <el-form
        class="isv-detail-form"
        ref="isvDetailForm"
        label-width="120px"
        :model="isvDetailFormData"
      >
        <!-- 企业信息 -->
        <!-- <p style="color: #000; font-size: 16px">企业信息:</p> -->
        <div class="menuHeader">
          <h2 class="menuTitle">企业信息</h2>
        </div>
        <br />
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业名称:">{{
              currentRowData.name
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人姓名:">{{
              currentRowData.contactsName
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人手机号:">{{
              currentRowData.contactsPhone
            }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人邮箱:">{{
              currentRowData.contactsEmail
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业所在地区:">
              {{ currentRowData.countryName }}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 管理员信息 -->
        <!-- <p style="color: #000; font-size: 16px">管理员信息</p> -->
        <div class="menuHeader">
          <h2 class="menuTitle">管理员信息</h2>
        </div>
        <br />
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号:">{{
              currentManagerInfo.pin
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱:">{{
              currentManagerInfo.email
            }}</el-form-item>
          </el-col>
        </el-row>
        <!-- 标签 -->
        <!-- <p style="color: #000; font-size: 16px">标签</p> -->
        <div class="menuHeader">
          <h2 class="menuTitle">标签信息</h2>
        </div>
        <br />
        <el-row>
          <el-col :span="24">
            <el-form-item label="" label-width="60px">
              <el-select
                v-model="isvDetailFormData.tag"
                placeholder="请选择"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in formInline.tagoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button @click="cancleIsvDetail">取 消</el-button>
        <el-button type="primary" @click="saveIsvDetail">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "InformationSearch",
  data() {
    return {
      updateId: 1,
      flag: false,
      netType: 2,
      itemsClone: [],
      totalClone: 1,
      page: 1,
      formInline: {
        name: "",
        radio: 2,
        content: "",
        value: 0,
        options: [
          {
            value: 0,
            label: "全部类型",
          },
          {
            value: 1,
            label: "ISV",
          },
          {
            value: 2,
            label: "自研商家",
          },
          // {
          //   value: 3,
          //   label: "自营商家",
          // },
          {
            value: 4,
            label: "合作伙伴",
          },
        ],
        tag: "",
        tagoptions: [
          {
            label: "测试",
            value: "010000",
          },
          {
            label: "非测试",
            value: "020000",
          },
        ],
      },
      dialogFormVisible: false,
      dialogChangeFormVisible: false,
      dialogVisible: false,
      dialogVisibleDel: false,
      msg: "",
      value: "",
      form: {},
      temp: {},
      formChange: {},
      formLabelWidth: "156px",
      itemsEdit: [],
      size: 10,
      editPage: 1,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      // 开发商类型
      typeTable: ["", "ISV", "自研商家", "自营商家", "合作伙伴"],
      // 开发商详情对话框
      isvDetailDialogVisible: false,
      isvDetailFormData: {
        tag: "", //标签
        mobile: "", //手机号
        id: "", //ID
      },
      mobileDisabled: true,

      currentRowData: {},

      currentManagerInfo: {
        pin: "",
        email: "",
      },
    };
  },
  filters: {
    formatProvinceNameText(provinceName) {
      return provinceName || "";
    },
    formatCityNameText(formatProvinceNameText, cityName) {
      return formatProvinceNameText
        ? cityName
          ? `${formatProvinceNameText}/${cityName}`
          : formatProvinceNameText
        : "-";
    },
    formatIsvDetailScaleText(scale) {
      const hashMap = {
        1: "0-50人",
        2: "51-100人",
        3: "101-500人",
        4: "500人以上",
      };
      return hashMap[scale] || "-";
    },
  },
  watch: {
    items: {
      handler(newVal, oldVal) {
        this.itemsClone = newVal;
      },
      immediate: true,
    },
    total: {
      handler(newVal, oldVal) {
        this.totalClone = newVal;
      },
      immediate: true,
    },
  },
  methods: {
    handleClickDetail(index, row) {
      this.isvDetailDialogVisible = true;
      this.mobileDisabled = true;
      this.isvDetailFormData.id = row.id;
      this.currentRowData = row;
      this.isvDetailFormData.tag = row.tagCode;
      const url = "/i18n/rest/supplierUser/getManagerUserBySupplierId";
      request({
        url,
        method: "get",
        params: {
          supplierId: row.supplierId,
        },
      })
        .then((res) => {
          if (res.code === 20000) {
            if (res.data) {
              this.currentManagerInfo.email = res.data.email;
              this.currentManagerInfo.pin = res.data.pin;
            }
          }
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    async requestTableData() {
      const url = "/i18n/rest/supplierIsv/queryDeveloperTeamList";
      const method = "get";
      const type = this.formInline.value;
      const name = this.formInline.name;
      const status = 3; // 审核状态  1：认证中，2：认证不通过，3：认证通过
      const pageNumb = this.pagination.page;
      const pageSize = this.pagination.pageSize;
      const tagCode = this.formInline.tag;
      const tagType = this.formInline.tag != "" ? "4" : "";
      const params = {
        type,
        name,
        status,
        pageNumb,
        pageSize,
        tagCode,
        tagType,
      };
      const response = await request({ url, method, params }).catch((error) => {
        throw error;
      });
      this.itemsClone = response.data.list;
      this.pagination.total = response.data.total;
    },
    indexMethod(index) {
      return index;
    },
    changeMobile() {
      this.mobileDisabled = false;
    },
    /**
     * 取消detail
     */
    cancleIsvDetail() {
      this.isvDetailDialogVisible = false;
      this.isvDetailFormData.tag = "";
      this.mobileDisabled = false;
    },
    /**
     * 保存信息
     */
    saveIsvDetail() {
      request({
        headers: {
          "Content-Type": "application/json",
        },
        url: "/i18n/rest/supplierIsv/updateSupplierIsv",
        method: "post",
        data: {
          isvCode: this.currentRowData.isvCode,
          site: this.currentRowData.site,
          tagCode:
            this.isvDetailFormData.tag === null
              ? ""
              : this.isvDetailFormData.tag,
        },
      })
        .then((res) => {
          if (res.code === 20000) {
            this.cancleIsvDetail();
            this.requestTableData();
          }
        })
        .catch((e) => {
          console.log("查看错误", e);
        });
    },
  },
  mounted() {
    this.requestTableData();
  },
};
</script>

 <style lang="scss" scoped>
.information-search {
  .input_style {
    width: 150%;
    margin: 5px 0 5px -30px;
  }
  .pagination-wrap {
    margin-top: 20px;
    text-align: center;
  }
  .el-pagination {
    display: flex;
    justify-content: center;
  }
  .isv-detail-dialog {
    /deep/.el-dialog__body {
      max-height: 55vh;
      overflow-y: auto;
    }
  }
}
.menuHeader {
  display: flex;
  align-items: center;

  .menuTitle {
    padding: 0 12px;
    font-size: 16px;
    font-weight: 600;
    position: relative;

    &::before {
      content: "";
      display: block;
      width: 3px;
      height: 100%;
      background: #3c6ef0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
