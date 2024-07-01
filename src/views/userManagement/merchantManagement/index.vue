<template>
  <div class="edi-wrapper">
    <el-form :inline="true" style="padding-top: 10px">
      <el-form-item label="商家名称">
        <el-input
          v-model="queryLike"
          placeholder="输入商家名称、商家编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <div class="block">
          <el-cascader
            style="width: 100%"
            v-model="queryTagCode"
            :options="tagoptions"
            :props="props"
            clearable
          ></el-cascader>
        </div>
      </el-form-item>
      <el-button type="primary" @click="handleSelButton">查 询</el-button>
    </el-form>

    <el-table :data="tableData" :show-tooltip-when-overflow="true">
      <el-table-column label="商家编码" prop="code" />
      <el-table-column label="商家名称" prop="name" />
      <el-table-column label="青龙业主号" prop="businessCode">
        <template slot-scope="{ row }">
          {{ formatCode(1, row) }}
        </template>
      </el-table-column>
      <el-table-column label="事业部编码" prop="businessCode">
        <template slot-scope="{ row }">{{ formatCode(2, row) }}</template>
      </el-table-column>
      <el-table-column label="研发人员ERP" prop="userPin" width="110px" />
      <!-- <el-table-column label="是否配置host" prop="isHostDomainName">
        <template slot-scope="{ row }">
          {{ formatConfiguration(row.isHostDomainName) }}
        </template>
      </el-table-column>
      <el-table-column label="是否配置VIP白名单" prop="isVipWhitelist">
        <template slot-scope="{ row }">
          {{ formatConfiguration(row.isVipWhitelist) }}
        </template>
      </el-table-column>
      <el-table-column label="是否绑定SSL证书" prop="isDomainNameCertificate">
        <template slot-scope="{ row }">
          {{ formatConfiguration(row.isDomainNameCertificate) }}
        </template>
      </el-table-column>
      <el-table-column
        label="物流网关是否配置商家IP白名单"
        prop="isIpWhitelist"
      >
        <template slot-scope="{ row }">
          {{ formatConfiguration(row.isIpWhitelist) }}
        </template>
      </el-table-column> -->
      <el-table-column label="标签" prop="tagName"> </el-table-column>
      <el-table-column label="审核状态" prop="status">
        <template slot-scope="{ row }">
          {{ formatStatus(row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        label="申请时间"
        align="center"
        prop="createTime"
        width="150px"
      >
      </el-table-column>
      <el-table-column label="更新人" prop="updateUser"> </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="150px"
      />
      <el-table-column label="操作" align="left" width="160px">
        <template slot-scope="scope" style="white-space: nowrap">
          <el-button-group>
            <el-button
              size="mini"
              type="text"
              style="margin-right: 5px"
              @click="handleMark(scope.row)"
            >
              打标
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row)"
              style="margin-right: 5px"
            >
              详情
            </el-button>

            <!--显示按钮条件：没有标签,并且是审核中状态-->
            <el-tooltip
              class="item"
              effect="dark"
              content="商家未打客户类型标签，不能进行审核！"
              placement="bottom"
              v-if="
                (!scope.row.tagName ||
                  scope.row.tagCode.indexOf('010000') == -1) &&
                scope.row.status == 1
              "
            >
              <el-button
                size="mini"
                type="text"
                style="color: gray; margin-right: 5px"
                >通过</el-button
              >
            </el-tooltip>

            <!--显示按钮条件：没有标签,并且是审核中状态-->
            <el-tooltip
              class="item"
              effect="dark"
              content="商家未打客户类型标签，不能进行驳回！"
              placement="bottom"
              v-if="
                (!scope.row.tagName ||
                  scope.row.tagCode.indexOf('010000') == -1) &&
                scope.row.status == 1
              "
            >
              <el-button
                size="mini"
                type="text"
                style="color: gray; margin-right: 5px"
                >驳回</el-button
              >
            </el-tooltip>

            <el-popconfirm
              :title="
                '是否确认通过在EDI创建【' + scope.row.name + '】商家的申请?'
              "
              width="10"
              v-if="
                scope.row.tagName &&
                scope.row.tagCode.indexOf('010000') == 0 &&
                (scope.row.status == 1 || scope.row.status == 3)
              "
              @onConfirm="onConfirmPopover(scope.row, 2)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="text"
                style="margin-right: 5px"
              >
                通过
              </el-button>
            </el-popconfirm>

            <el-popconfirm
              :title="
                '是否确认驳回在EDI创建【' + scope.row.name + '】商家的申请?'
              "
              width="10"
              v-if="
                scope.row.tagName &&
                scope.row.tagCode.indexOf('010000') == 0 &&
                (scope.row.status == 1 || scope.row.status == 3)
              "
              @onConfirm="onConfirmPopover(scope.row, 3)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="text"
                v-if="scope.row.tagName && scope.row.status == 1"
              >
                驳回
              </el-button>
            </el-popconfirm>
          </el-button-group>
          <!-- 打标 -->
          <el-dialog
            width="30%"
            height="100%"
            title="打标"
            :close-on-click-modal="false"
            :visible.sync="dialogMarkVisible"
          >
            <div>
              <el-form
                style="width: 400px"
                :model="basicInfoForm"
                label-width="100px"
              >
                <el-form-item label="商家编码" prop="code">
                  <el-input v-model="basicInfoForm.code" disabled />
                </el-form-item>
                <el-form-item label="商家名称" prop="name">
                  <el-input v-model="basicInfoForm.name" disabled />
                </el-form-item>
                <el-form-item label="标签" prop="merchantType">
                  <div class="block">
                    <el-cascader
                      style="width: 100%"
                      v-model="basicInfoForm.merchantType"
                      :options="tagoptions"
                      :props="props"
                      clearable
                    ></el-cascader>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogMarkVisible = false">取消</el-button>
              <el-button type="primary" @click="markMerchantType">
                确定
              </el-button>
            </div>
          </el-dialog>
          <!-- 详情 -->
          <el-dialog
            width="40%"
            title="详情"
            :visible.sync="dialogDetailVisible"
          >
            <div class="dialog-wrapper">
              <p class="detail-title">基本信息</p>
              <el-form
                :model="detailInfoForm"
                style="width: 420px"
                label-width="140px"
              >
                <el-form-item label="客户类型">
                  <p class="basic-content">
                    {{ hashTypeMap[detailInfoForm.merchantType] }}
                  </p>
                </el-form-item>
                <el-form-item label="商家编码">
                  <p class="basic-content">{{ detailInfoForm.code }}</p>
                </el-form-item>
                <el-form-item label="商家名称">
                  <p class="basic-content">{{ detailInfoForm.name }}</p>
                </el-form-item>
                <el-form-item label="业务编码">
                  <p class="basic-content">
                    {{ detailInfoForm.businessCode }}
                  </p>
                </el-form-item>
                <el-form-item label="企业名称">
                  <p class="basic-content">
                    {{ detailInfoForm.companyName }}
                  </p>
                </el-form-item>
                <el-form-item label="社会信用代码">
                  <p class="basic-content">
                    {{ detailInfoForm.socialCreditCode }}
                  </p>
                </el-form-item>
                <el-form-item label="企业联系人姓名">
                  <p class="basic-content">
                    {{ detailInfoForm.companyContactName }}
                  </p>
                </el-form-item>
                <el-form-item label="企业联系人手机">
                  <p class="basic-content">
                    {{ detailInfoForm.companyContactMobile }}
                  </p>
                </el-form-item>
                <el-form-item label="企业联系人邮箱">
                  <p class="basic-content">
                    {{ detailInfoForm.companyContactMail }}
                  </p>
                </el-form-item>
                <el-form-item label="京东业务人员ERP">
                  <p class="basic-content">
                    {{ detailInfoForm.businessPersonnelErp }}
                  </p>
                </el-form-item>
                <el-form-item label="对接业务">
                  <p class="basic-content">
                    {{ detailInfoForm.businessDescription }}
                  </p>
                </el-form-item>
              </el-form>
              <p class="detail-title">特殊配置</p>
              <el-form
                ref="specialConfigurationForm"
                :model="specialConfigurationForm"
                class="special-configuration-form"
                disabled
              >
                <p class="special-configuration-content">
                  1. 【商家系统】特殊配置：是否配置了京东物流网关域名host？
                </p>
                <el-form-item prop="isHostDomainName">
                  <el-radio
                    v-model="specialConfigurationForm.isHostDomainName"
                    :label="true"
                  >
                    是
                  </el-radio>
                  <el-radio
                    v-model="specialConfigurationForm.isHostDomainName"
                    :label="false"
                  >
                    否
                  </el-radio>
                </el-form-item>
                <div v-if="specialConfigurationForm.isHostDomainName === true">
                  <el-form-item
                    label="域名："
                    label-width="140px"
                    prop="hostDomainName"
                  >
                    <el-input
                      v-model="specialConfigurationForm.hostDomainName"
                      placeholder="示例：api.jdwl.jd.local"
                    />
                  </el-form-item>
                  <el-form-item label="IP：" label-width="140px" prop="hostIp">
                    <el-input
                      v-model="specialConfigurationForm.hostIp"
                      placeholder="示例：10.126.211.234 , 11.70.215.191, 11.60.217.127"
                    />
                  </el-form-item>
                  <el-form-item
                    label="备注："
                    label-width="140px"
                    prop="hostRemark"
                  >
                    <el-input
                      v-model="specialConfigurationForm.hostRemark"
                      placeholder="示例：库房是4层协议不支持域名访问，直接使用网关的实例ip"
                    />
                  </el-form-item>
                </div>

                <p class="special-configuration-content">
                  2. 【商家系统】特殊配置：是否配置了京东物流网关域名VIP白名单？
                </p>
                <el-form-item prop="isVipWhitelist">
                  <el-radio
                    v-model="specialConfigurationForm.isVipWhitelist"
                    :label="true"
                  >
                    是
                  </el-radio>
                  <el-radio
                    v-model="specialConfigurationForm.isVipWhitelist"
                    :label="false"
                  >
                    否
                  </el-radio>
                </el-form-item>
                <div v-if="specialConfigurationForm.isVipWhitelist === true">
                  <el-form-item
                    label="域名："
                    label-width="140px"
                    prop="vipWhitelist"
                  >
                    <el-input
                      v-model="specialConfigurationForm.vipWhitelist"
                      placeholder="示例：api.jdwl.jd.local"
                    />
                  </el-form-item>
                  <el-form-item label="IP：" label-width="140px" prop="vipIp">
                    <el-input
                      v-model="specialConfigurationForm.vipIp"
                      placeholder="示例：10.126.211.234 , 11.70.215.191, 11.60.217.127"
                    />
                  </el-form-item>
                </div>
                <p class="special-configuration-content">
                  3. 【商家系统】特殊配置： 是否绑定了京东物流网关域名SSL证书？
                </p>
                <el-form-item prop="isDomainNameCertificate">
                  <el-radio
                    v-model="specialConfigurationForm.isDomainNameCertificate"
                    :label="true"
                  >
                    是
                  </el-radio>
                  <el-radio
                    v-model="specialConfigurationForm.isDomainNameCertificate"
                    :label="false"
                  >
                    否
                  </el-radio>
                </el-form-item>
                <p class="special-configuration-content">
                  4. 【京东物流网关】特殊配置：是否配置了商家IP白名单？
                </p>
                <el-form-item prop="isIpWhitelist">
                  <el-radio
                    v-model="specialConfigurationForm.isIpWhitelist"
                    :label="true"
                  >
                    是
                  </el-radio>
                  <el-radio
                    v-model="specialConfigurationForm.isIpWhitelist"
                    :label="false"
                  >
                    否
                  </el-radio>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogDetailVisible = false">取消</el-button>
              <el-button type="primary" @click="dialogDetailVisible = false">
                确定
              </el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="pagination.total"
      :current-page.sync="pagination.page"
      :page-size.sync="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      background
      @current-change="selectAllMerchant"
      @size-change="selectAllMerchant"
    />
  </div>
</template>

<script>
import request from "@/utils/request";
import { UserModule } from "@/store/modules/user";
export default {
  name: "MerchantManagement",
  data() {
    return {
      dialogMarkVisible: false,
      dialogDetailVisible: false,
      queryLike: "", //商家名称和商家编码
      queryTagCode: "", //tag type
      basicInfoForm: {
        code: "", //商家编码
        name: "", //商家名称
        merchantType: [],
        id: "",
      },
      specialConfigurationForm: {},
      detailInfoForm: {},
      tableData: [],
      hashTypeMap: ["", "KA", "平台"],
      pagination: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
        total: 0,
      },
      props: { multiple: true },
      tagoptions: [],
      enumstatus: [
        {
          val: 1,
          description: "待审核",
        },
        {
          val: 2,
          description: "审核通过",
        },
        {
          val: 3,
          description: "已驳回",
        },
      ],
      confirmPopoverDebounceTimer: null,
    };
  },
  mounted() {
    this.selectAllMerchant();
    const url = "/platform/rest/merchant/getTagByMerchantType";
    let _this = this;
    request({
      url,
      method: "get",
      params: {
        tagType: 3,
      },
    })
      .then((response) => {
        if (response.code === 20000) {
          if (response.data) {
            response.data.forEach(function (val, index) {
              let firstObj = { value: val.tagCode, label: val.tagName };
              if (val.childrenTagDtoList) {
                _this.tagData(firstObj, val.childrenTagDtoList);
              }
              _this.tagoptions.push(firstObj);
            });
          }
        }
      })
      .catch((e) => {
        console.log("查看错误", e);
      });
  },
  methods: {
    formatCode(type, row) {
      if (type === row.businessCodeType) {
        return row.businessCode;
      } else {
        return "-";
      }
    },
    formatConfiguration(type) {
      return type === true ? "是" : "否";
    },
    formatType(type) {
      return this.hashTypeMap[type];
    },
    /**
     * 格式化状态
     */
    formatStatus(status) {
      for (i = 0; i < this.enumstatus.length; i++) {
        if (this.enumstatus[i].val == status) {
          return this.enumstatus[i].description;
        }
      }
    },
    markMerchantType() {
      let tagAry = [];
      this.basicInfoForm.merchantType.forEach(function (val, index) {
        tagAry.push(val[0] + "@" + val[1]);
      });
      const url = "/platform/rest/merchant/updateMerchantType";
      request({
        url,
        method: "post",
        data: {
          code: this.basicInfoForm.code,
          tagCode: tagAry.toString(),
          updateUser: UserModule.username,
        },
      })
        .then((res) => {
          this.dialogMarkVisible = false;
          this.$message.success("操作成功");
          this.selectAllMerchant();
        })
        .catch((e) => {
          console.log("查看错误", e);
        });
    },
    // 打标
    handleMark(row) {
      let _this = this;
      this.basicInfoForm.merchantType = [];
      let parseJson = JSON.parse(JSON.stringify(row));
      this.basicInfoForm.code = parseJson.code;
      this.basicInfoForm.name = parseJson.name;
      this.basicInfoForm.id = parseJson.id;
      let tagCode = parseJson.tagCode;
      if (tagCode && tagCode != "") {
        let aryTagCode = tagCode.split(",");
        aryTagCode.forEach(function (val, index) {
          let tagAry = [];
          tagAry.push(val.split("@")[0]);
          tagAry.push(val.split("@")[1]);
          _this.basicInfoForm.merchantType.push(tagAry);
        });
      } else {
        this.basicInfoForm.merchantType = [];
      }
      console.log(_this.basicInfoForm.merchantType);
      this.dialogMarkVisible = true;
    },
    // 查看详情
    handleDetail(row) {
      const url = "/platform/rest/merchant/selectMerchantInfo";
      request({
        url,
        method: "get",
        params: {
          code: row.code,
          businessCode: row.businessCode,
          businessCodeType: row.businessCodeType,
        },
      })
        .then((response) => {
          const {
            code,
            name,
            isVipWhitelist,
            hostDomainName,
            isIpWhitelist,
            isDomainNameCertificate,
            hostIp,
            hostRemark,
            vipWhitelist,
            vipIp,
            isHostDomainName,
            merchantType,
            businessCode,
            companyName,
            companyContactName,
            companyContactMobile,
            companyContactMail,
            businessPersonnelErp,
            socialCreditCode,
            businessDescription,
          } = response.data;
          this.detailInfoForm = {
            code,
            name,
            merchantType,
            businessCode,
            companyName,
            companyContactName,
            companyContactMobile,
            companyContactMail,
            businessPersonnelErp,
            socialCreditCode,
            businessDescription,
          };
          this.specialConfigurationForm = {
            isHostDomainName,
            hostDomainName,
            hostIp,
            hostRemark,
            isVipWhitelist,
            vipWhitelist,
            vipIp,
            isDomainNameCertificate,
            isIpWhitelist,
          };
          this.dialogDetailVisible = true;
        })
        .catch((e) => {
          console.log("查看错误", e);
        });
    },
    selectAllMerchant() {
      const url = "/platform/rest/merchant/queryMerchantList";
      let queryAry = [];
      if (this.queryTagCode && this.queryTagCode != "") {
        this.queryTagCode.forEach(function (val, index) {
          queryAry.push(val[0] + "@" + val[1]);
        });
      }
      request({
        url,
        method: "get",
        params: {
          queryLike: this.queryLike,
          tagCode: queryAry.toString(),
          pageNumb: this.pagination.page,
          pageSize: this.pagination.pageSize,
        },
      })
        .then((res) => {
          this.tableData = res.data.list;
          this.pagination.total = res.data.total;
        })
        .catch((e) => {
          console.log("查看错误", e);
        });
    },
    tagData(tag, child) {
      tag.children = [];
      child.forEach(function (val, index) {
        let firstObj = { value: val.tagCode, label: val.tagName };
        if (val.childrenTagDtoList) {
          this.tagData(firstObj, val.childrenTagDtoList);
        }
        tag.children.push(firstObj);
      });
    },
    onConfirmPopover(rowData, status) {
      clearTimeout(this.confirmPopoverDebounceTimer);
      this.confirmPopoverDebounceTimer = setTimeout(() => {
        const url = "/platform/rest/merchant/approve";
        request({
          url,
          method: "get",
          params: {
            code: rowData.code,
            status: status,
          },
        })
          .then((res) => {
            this.selectAllMerchant();
          })
          .catch((e) => {
            console.log("查看错误", e);
          });
      }, 300);
    },
    handleSelButton() {
      this.selectAllMerchant();
    },
  },
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
