<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="公司名称">
        <el-input v-model="formInline.name" placeholder />
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="formInline.value" @change="selectChange">
          <el-option
            v-for="item in formInline.options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 合作伙伴类型 -->
      <el-form-item label="合作伙伴类型" v-if="type === 4">
        <el-select v-model="formInline.cooperationValue">
          <el-option
            v-for="item in cooperationOptions"
            :key="item.label"
            :label="item.label"
            :value="item.cooperationValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="itemsClone" style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column
        label="类型"
        prop="type"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="申请人" prop="createUser"></el-table-column>
      <el-table-column label="申请时间" prop="applyTime"></el-table-column>
      <el-table-column label="公司编码" prop="companyCode"></el-table-column>
      <el-table-column label="公司名称" prop="name"></el-table-column>
      <el-table-column
        label="蓝鲸申请状态"
        prop="bwApplyStatus"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column
        label="蓝鲸认证状态"
        prop="bwStatus"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column
        label="运营审批状态"
        prop="status"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="合作伙伴类型" prop="cooperationType">
        <template slot-scope="{ row }">{{
          formatType(row.cooperationType)
        }}</template>
      </el-table-column>
      <el-table-column
        label="注册推荐人邮箱"
        prop="referrerMail"
      ></el-table-column>
      <el-table-column label="审批人" prop="approveUser">
        <template slot-scope="{ row }">{{
          formatUser(row.approveUser)
        }}</template>
      </el-table-column>
      <el-table-column label="审批时间" prop="approveTime"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot="header" />
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-show="
                scope.row.status == 1 ||
                scope.row.status == 2 ||
                scope.row.status == 3
              "
              v-if="type !== 4"
              size="mini"
              type="primary"
              plain
              @click="handleEdit(scope.$index, scope.row)"
              >查看详情</el-button
            >
            <!-- 合作伙伴查看详情 -->
            <el-button
              v-show="
                scope.row.status == 1 ||
                scope.row.status == 2 ||
                scope.row.status == 3
              "
              v-if="type === 4"
              size="mini"
              type="primary"
              plain
              @click="handleDetail(scope.$index, scope.row)"
              >查看详情</el-button
            >
            <el-button
              v-show="scope.row.status == 1 || scope.row.status == 2"
              size="mini"
              type="primary"
              plain
              @click="onClickPassButton(scope.row)"
              >通过</el-button
            >
            <el-button
              v-show="scope.row.status == 1"
              size="mini"
              type="danger"
              plain
              @click="handleReject(scope.$index, scope.row)"
              >驳回</el-button
            >
            <el-button
              v-show="scope.row.status == 3 && type !== 4"
              size="mini"
              type="primary"
              plain
              @click="handleUpdate(scope.$index, scope.row)"
              >数据同步</el-button
            >
            <el-button
              v-show="type === 1"
              size="mini"
              type="primary"
              plain
              @click="approveView(scope.$index, scope.row)"
              >认证详情查看</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 认证详请弹窗框 -->
    <el-dialog
      width="40%"
      height="100%"
      :title="dailogApproveType"
      :visible.sync="dialogApproveVisible"
    >
      <span>{{ dialogMsg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogApproveVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
      width="40%"
      height="100%"
      :title="dailogTitleType"
      :visible.sync="dialogChangeFormVisible"
    >
      <el-form :model="formChange" label-width="100px">
        <el-form-item label="联系人姓名">
          <el-input v-model="formChange.contactsName" disabled />
        </el-form-item>
        <el-form-item label="联系人手机号">
          <el-input
            v-model="formChange.contactsPhone"
            disabled
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="联系人邮箱">
          <el-input
            v-model="formChange.contactsEmail"
            disabled
            autocomplete="off"
          />
        </el-form-item>
        <template v-if="type === 2">
          <el-form-item label="客户编码">
            <el-select
              v-model="formChange.sellerType"
              disabled
              style="width: 100%"
            >
              <el-option
                v-for="item in sellerOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="编码">
            <el-input
              v-model="formChange.eclpBusinessNo"
              disabled
              autocomplete="off"
            />
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeFormVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 合作伙伴查看详情对话框 -->
    <el-dialog
      width="65%"
      height="100%"
      :title="dailogTitleType"
      :visible.sync="dialogCooperationVisible"
      :before-close="closedReset"
      :close-on-click-modal="false"
      center
    >
      <el-form
        class="form"
        label-width="130px"
        :model="partnerForm"
        :rules="rules"
        ref="partnerForm"
      >
        <el-row>
          <el-col :span="24">
            <div class="dividerStyle">
              <el-divider content-position="center">
                <h2 class="title">企业信息</h2>
              </el-divider>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="合作类型" prop="cooperationType">
              <el-select
                v-model="partnerForm.cooperationType"
                placeholder="请选择合作类型"
                :disabled="disableForm"
              >
                <el-option
                  v-for="item in cooperationOnlyOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.cooperationValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="name">
              <el-input
                placeholder="请输入公司名称"
                v-model="partnerForm.name"
                show-word-limit
                :disabled="disableForm"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区" prop="cascaderOptions">
              <el-cascader
                v-model="partnerForm.cascaderOptions"
                :key="Math.random()"
                :options="partnerForm.cascaderData"
                ref="cascader"
                @active-item-change="onAreaItemChange"
                @change="onAreaChange"
                placeholder="请选择地区"
                :props="{
                  value: 'areaCode',
                  label: 'areaName',
                  children: 'cities',
                }"
                style="width: 100%"
                :disabled="disableForm"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="统一社会信用代码或营业执照号"
              prop="companyCode"
            >
              <el-input
                placeholder="请输入统一社会信用代码或营业执照号"
                v-model="partnerForm.companyCode"
                show-word-limit
                :disabled="disableForm"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司规模" prop="scale">
              <el-select
                v-model="partnerForm.scale"
                placeholder="请选择公司规模"
                style="width: 100%"
                :disabled="disableForm"
              >
                <el-option
                  v-for="item in scaleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="主营业务" prop="businessScope">
              <el-input
                type="textarea"
                placeholder="请输入主营业务，长度不超过500"
                :rows="3"
                maxlength="500"
                show-word-limit
                v-model="partnerForm.businessScope"
                :disabled="disableForm"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="dividerStyle">
              <el-divider content-position="center">
                <h2 class="title">联系人信息</h2>
              </el-divider>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="联系人姓名" prop="contactsName">
              <el-input
                placeholder="请输入联系人姓名"
                show-word-limit
                v-model="partnerForm.contactsName"
                :disabled="disableForm"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button class="btnStyle" @click="seePlaintext(1)" type="primary"
              >查看</el-button
            >
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人邮箱" prop="contactsEmail">
              <el-input
                placeholder="请输入联系人邮箱"
                v-model="partnerForm.contactsEmail"
                :disabled="disableForm"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button class="btnStyle" @click="seePlaintext(3)" type="primary"
              >查看</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="联系人手机号" prop="contactsPhone">
              <el-input
                placeholder="请输入联系人手机号"
                v-model="partnerForm.contactsPhone"
                :disabled="disableForm"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button class="btnStyle" @click="seePlaintext(2)" type="primary"
              >查看</el-button
            >
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册推荐人邮箱" prop="referrerMail">
              <el-input
                placeholder="请填写与您对接的京东员工邮箱"
                v-model="partnerForm.referrerMail"
                :disabled="disableForm"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="dividerStyle">
              <el-divider content-position="center">
                <h2 class="title">其它信息</h2>
              </el-divider>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="合作内容" prop="cooperationContent">
              <el-input
                type="textarea"
                placeholder="请输入合作内容，长度不超过500"
                :rows="2"
                maxlength="500"
                show-word-limit
                v-model="partnerForm.cooperationContent"
                :disabled="disableForm"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="editStatus" @click="handleEditForm">编辑</el-button>
        <el-button v-show="!editStatus" @click="handleSaveForm('partnerForm')"
          >保存</el-button
        >
        <el-button @click="closeForm('partnerForm')">关闭</el-button>
      </div>
    </el-dialog>
    <IsvDetailDialog
      :isvDialogVisible.sync="isvDialogVisible"
      :isvDetailData="formChange"
    />
    <div class="pagination-wrap" v-if="itemsClone.length !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalClone"
        @prev-click="prevClick"
        @next-click="nextClick"
      />
    </div>

    <el-dialog
      title="公司编码重复"
      width="30%"
      :visible.sync="dialogTableVisible"
      center
    >
      <p>已有其他账号的相同公司编码审核通过，不可重复审核通过</p>
      <p>重复用户名：{{ businessInfo.pin }}</p>
      <p>重复公司名：{{ businessInfo.companyName }}</p>
      <p>申请时间：{{ businessInfo.applyTime }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../utils/request";
import IsvDetailDialog from "@/views/business/components/IsvDetailDialog.vue";

export default {
  name: "Certification",
  components: { IsvDetailDialog },
  props: {
    items: Array,
    type: Number,
    pageSize: Number,
    total: Number,
  },
  data() {
    //自定义校验手机号
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("联系人手机号不能为空"));
      }
      const reg = /^1[3456789]\d{9}$/;
      //编辑时校验用户是否修改密文，未修改则直接通过校验
      if (this.editStatus === false && value === this.tempPhone) {
        callback();
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("联系人手机号格式不正确"));
        }
      }
    };
    //自定义校验姓名
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("联系人姓名不能为空"));
      }
      const reg = /^[\u4e00-\u9fa5a-zA-Z]*$/;
      if (this.editStatus === false && value === this.tempName) {
        callback();
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("只允许输入中文和英文，请重新输入"));
        }
      }
    };
    //自定义校验邮箱
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("联系人邮箱不能为空"));
      }
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      //编辑时校验用户是否修改密文，未修改则直接通过校验
      if (this.editStatus === false && value === this.tempEmail) {
        callback();
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("联系人邮箱地址格式不正确"));
        }
      }
    };
    return {
      businessInfo: {
        pin: "rollingforever",
        companyName: "安徽印屿设广告传媒有限公司",
        applyTime: "2023-06-09 18:30:19",
      },
      dialogTableVisible: false,
      //合作伙伴查看详情表单校验
      rules: {
        cooperationType: [{ required: true }],

        name: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度超过限制，长度在 1到 50 个字符",
            trigger: "blur",
          },
        ],

        cascaderOptions: [
          { required: true, message: "地区不能为空", trigger: "change" },
        ],

        companyCode: [
          {
            required: true,
            message: "统一社会信用代码或营业执照号不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "长度超过限制，长度在 1到 50 个字符",
            trigger: "blur",
          },
        ],

        scale: [
          {
            required: true,
            message: "公司规模不能为空",
            trigger: "change",
          },
        ],

        businessScope: [
          {
            required: true,
            message: "主营业务不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 500,
            message: "长度超过限制，长度在 1到 500 个字符",
            trigger: "blur",
          },
        ],

        contactsName: [
          { required: true, validator: checkName, trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度超过限制，长度在 1到 50 个字符",
            trigger: "blur",
          },
        ],

        contactsEmail: [
          { required: true, validator: checkEmail, trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度超过限制，长度在 1到 50 个字符",
            trigger: "blur",
          },
        ],

        contactsPhone: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],

        referrerMail: [
          {
            pattern:
              /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            message: "推荐人邮箱格式不正确",
          },
          {
            min: 1,
            max: 50,
            message: "长度超过限制，长度在 1到 50 个字符",
            trigger: "blur",
          },
        ],

        cooperationContent: [
          { required: true, message: "合作内容不能为空", trigger: "blur" },
          {
            min: 1,
            max: 500,
            message: "长度超过限制，长度在 1到 500 个字符",
            trigger: "blur",
          },
        ],
      },
      //公司规模
      scaleOptions: [
        { label: "0-50人", value: 1 },
        { label: "51-100人", value: 2 },
        { label: "101-500人", value: 3 },
        { label: "500人以上", value: 4 },
      ],
      sellerOptions: [
        { label: "月结编码", value: "eclp" },
        { label: "客户编码", value: "cloudWarehouse" },
        { label: "服务编码", value: "servicePlus" },
      ],
      updateId: 1,
      flag: false,
      page: 1,
      netType: 2,
      itemsClone: [],
      totalClone: 1,
      formInline: {
        radio: 2,
        content: "",
        value: 0,
        cooperationValue: 0,
        options: [
          {
            value: 0,
            label: "全部类型",
          },
          {
            value: 1,
            label: "认证中",
          },
          {
            value: 2,
            label: "认证不通过",
          },
          {
            value: 3,
            label: "认证通过",
          },
        ],
      },
      disableForm: true,
      //控制编辑/保存显示变量
      editStatus: true,
      partnerForm: {
        //--认证信息唯一标示
        id: "",
        //--认证状态标示,初始未认证
        status: 0,
        //--合作性质
        cooperationType: 1,
        //--公司名称
        name: "",
        //--地区选项
        cascaderOptions: [],
        //--地区数据
        cascaderData: [],
        //--级联Label
        cascaderLabel: [],
        //省编码
        provinceCode: "",
        //省名称
        provinceName: "",
        //城市编码
        cityCode: "",
        //城市名称
        cityName: "",
        //区县编码
        districtCode: "",
        //区县编码名称
        districtName: "",
        //--组织机构代码
        companyCode: "",
        //--主营业务
        businessScope: "",
        //--公司规模
        scale: "",
        //--主营业务
        cooperationContent: "",
        //--联系人姓名
        contactsName: "",
        //--联系人手机号
        contactsPhone: "",
        //--联系人邮箱
        contactsEmail: "",
        //--推荐人邮箱
        referrerMail: "",
      },
      //联系人姓名编辑时的临时变量
      tempName: "",
      //联系人手机号编辑时的临时变量
      tempPhone: "",
      //联系人邮箱编辑时的临时变量
      tempEmail: "",
      //--合作类型选项
      cooperationOptions: [
        {
          cooperationValue: 0,
          label: "全部类型",
        },
        {
          cooperationValue: 1,
          label: "供应商",
        },
        {
          cooperationValue: 2,
          label: "分销商",
        },
        {
          cooperationValue: 3,
          label: "其他",
        },
      ],
      cooperationOnlyOptions: [
        {
          cooperationValue: 1,
          label: "供应商",
        },
        {
          cooperationValue: 2,
          label: "分销商",
        },
        {
          cooperationValue: 3,
          label: "其他",
        },
      ],
      dialogFormVisible: false,
      dialogChangeFormVisible: false,
      dialogCooperationVisible: false,
      dialogVisible: false,
      dialogVisibleDel: false,
      dailogTitleType: "",
      dailogApproveType: "蓝鲸认证信息",
      dialogApproveVisible: false,
      dialogMsg: "",
      msg: "",
      value: "",
      form: {},
      temp: {},
      formChange: {},
      formLabelWidth: "156px",
      addressForm: {},
      // 开发商类型
      typeTable: ["", "ISV", "自研商家", "自营商家", "合作伙伴"],
      // 蓝鲸认证申请状态
      bwApplyStatusTable: {
        "00000": "成功",
        "00001": "成功但结果为空",
        10000: "服务不可用",
        20000: "缺少或非法入参参数",
        30000: "接口调用权限不足",
        40000: "业务处理异常",
      },
      // 蓝鲸认证状态
      bwStatusTable: [
        "认证中",
        "审核通过",
        "认证失败",
        "认证成功",
        "审核被驳回",
        "认证过期",
        "认证失败",
        "待审核",
      ],
      // 认证状态
      statusTable: ["", "认证中", "认证不通过", "认证通过"],
      isvDialogVisible: false,
      passButtonDebounceTimer: null,
    };
  },
  methods: {
    formatter(row, column, cellValue) {
      const value2TextTable = {
        type: () => this.typeTable[cellValue],
        bwApplyStatus: () => this.bwApplyStatusTable[cellValue],
        bwStatus: () => this.bwStatusTable[cellValue],
        status: () => this.statusTable[cellValue],
      };
      return value2TextTable[column.property]();
    },
    handleUpdate(index, val) {
      this.$confirm("确定要数据同步吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const url = "/supplierIsv/rest/syncIsvToCloud";
          request({
            url,
            method: "get",
            params: {
              id: val.id,
            },
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "同步成功!",
              });
            })
            .catch((e) => {
              console.log("数据同步错误", e);
            });
        })
        .catch((e) => {
          console.log("取消同步", e);
        });
    },
    closedReset(done) {
      this.$refs["partnerForm"].resetFields();
      done();
    },
    fetchData() {
      const url = "supplierIsv/rest/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page,
          name: this.formInline.name,
          status: this.formInline.value,
          cooperationType: this.formInline.cooperationValue,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    selectChange(val) {},
    onSubmit() {
      const url = "supplierIsv/rest/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          page: 1,
          rows: this.pageSize,
          name: this.formInline.name,
          cooperationType: this.formInline.cooperationValue,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
          this.netType = this.formInline.radio;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    handleEdit(index, row) {
      this.type === 1
        ? (this.isvDialogVisible = true)
        : (this.dialogChangeFormVisible = true);
      this.updateId = row.id;
      this.dailogTitleType = "开发商详情";
      const url = "/supplierIsv/rest/getSupplierIsvDetailById";
      request({
        url,
        method: "get",
        params: {
          id: row.id,
        },
      })
        .then((res) => {
          this.formChange = res.data;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },

    //合作伙伴tab的查看详情
    handleDetail(index, row) {
      this.dialogCooperationVisible = true;
      this.editStatus = true;
      this.disableForm = true;
      this.$nextTick(() => {
        if (
          !(
            this.partnerForm.cascaderOptions &&
            this.partnerForm.cascaderOptions.length > 0
          )
        ) {
          this.getAreaList();
        }
      });
      this.updateId = row.id;
      this.dailogTitleType = "开发商详情";
      const url = "/supplierIsv/rest/getSupplierIsvDetailById";
      request({
        url,
        method: "get",
        params: {
          id: row.id,
        },
      })
        .then((res) => {
          const data = res.data;
          this.tempName = data.contactsName;
          this.tempPhone = data.contactsPhone;
          this.tempEmail = data.contactsEmail;

          if (data.provinceName) {
            this.partnerForm.cascaderLabel[0] = data.provinceName;
          }
          if (data.cityName) {
            this.partnerForm.cascaderLabel[1] = data.cityName;
          }
          if (data.districtName) {
            this.partnerForm.cascaderLabel[2] = data.districtName;
          }
          if (data.provinceCode) {
            this.partnerForm.cascaderOptions.push(data.provinceCode);
          }
          if (data.cityCode) {
            this.partnerForm.cascaderOptions.push(data.cityCode);
          }
          if (data.districtCode) {
            this.partnerForm.cascaderOptions.push(data.districtCode);
          }
          this.partnerForm.id = data.id;
          this.partnerForm.status = data.status;
          this.partnerForm.cooperationType = data.cooperationType;
          this.partnerForm.name = data.name;
          this.partnerForm.companyCode = data.companyCode;
          this.partnerForm.businessScope = data.businessScope;
          this.partnerForm.scale = data.scale;
          this.partnerForm.cooperationContent = data.cooperationContent;
          this.partnerForm.contactsName = data.contactsName;
          this.partnerForm.contactsPhone = data.contactsPhone;
          this.partnerForm.contactsEmail = data.contactsEmail;
          this.partnerForm.referrerMail = data.referrerMail;
          this.showAreaList();
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },

    //合作伙伴查看详情【编辑】按钮
    handleEditForm() {
      this.editStatus = false;
      this.disableForm = false;
    },

    //合作伙伴查看详情【保存】按钮
    handleSaveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editStatus = true;
          this.disableForm = true;
          this.dialogCooperationVisible = false;
          const url = "/supplierIsv/rest/updatePartnerById";
          const method = "post";
          const headers = { "Content-Type": "application/json" };
          this.addressForm = {
            provinceCode: this.partnerForm.cascaderOptions[0],
            cityCode: this.partnerForm.cascaderOptions[1],
            districtCode: this.partnerForm.cascaderOptions[2],
            provinceName: this.partnerForm.cascaderLabel[0],
            cityName: this.partnerForm.cascaderLabel[1],
            districtName: this.partnerForm.cascaderLabel[2],
          };
          //组合表单请求参数
          this.submitForm = Object.assign(this.partnerForm, this.addressForm);
          const data = this.submitForm;
          request({ url, method, headers, data })
            .then((response) => {
              this.$refs[formName].resetFields();
              this.$message.success("保存成功");
              this.fetchData();
            })
            .catch((error) => {
              console.log("保存认证信息失败", error);
            });
        } else {
          console.log("validate failed");
          return false;
        }
      });
    },
    //通过
    onClickPassButton(row) {
      clearTimeout(this.passButtonDebounceTimer);
      this.passButtonDebounceTimer = setTimeout(() => {
        let url = "";
        this.$confirm("确定要通过吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.dialogVisibleDel = false;
            if (this.type === 4) {
              url = "/supplierIsv/rest/approvePartner";
            } else {
              url = "/supplierIsv/rest/approve";
            }
            request({
              url,
              method: "get",
              params: {
                id: row.id,
              },
            }).then(async (res) => {
              if (res.code === 20058) {
                await this.queryApproveByCompanyCode(row.companyCode);
              } else {
                this.$message.success("操作成功");
                this.fetchData();
              }
            });
          })
          .catch((e) => {
            console.log("错误", e);
          });
      }, 300);
    },
    queryApproveByCompanyCode(companyCode) {
      const url = "/supplierIsv/rest/queryApproveByCompanyCode";
      request({
        url,
        method: "get",
        params: { companyCode },
      })
        .then((res) => {
          if (res.data) {
            Object.assign(this.businessInfo, res.data);
            this.dialogTableVisible = true;
          }
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    formatUser(approveUser) {
      if (approveUser === null) {
        return "—";
      } else {
        return approveUser;
      }
    },
    formatType(cooperationType) {
      if (cooperationType === null) {
        return "—";
      } else if (cooperationType === 1) {
        return "供应商";
      } else if (cooperationType === 2) {
        return "分销商";
      } else if (cooperationType === 3) {
        return "其他";
      }
    },

    //驳回
    handleReject(index, row) {
      let url = "";
      this.$confirm("确定要驳回吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dialogVisibleDel = false;
          if (this.type === 4) {
            url = "/supplierIsv/rest/rejectPartner";
          } else {
            url = "/supplierIsv/rest/reject";
          }
          request({
            url,
            method: "get",
            params: {
              id: row.id,
            },
          }).then((res) => {
            this.$message.success("操作成功");
            this.fetchData();
          });
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },

    //关闭对话框
    closeForm(formName) {
      this.dialogCooperationVisible = false;
      this.$refs[formName].resetFields();
    },

    indexMethod(index) {
      return index;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    //--触发地区信息级连联动作
    onAreaItemChange(val) {
      this.getAreaList(val);
    },

    //--地区变更操作
    onAreaChange() {
      if (
        this.$refs["cascader"].getCheckedNodes()[0] &&
        this.$refs["cascader"].getCheckedNodes()[0].pathLabels
      ) {
        this.partnerForm.cascaderLabel =
          this.$refs["cascader"].getCheckedNodes()[0].pathLabels;
      }
    },

    //--获取地区列表
    getAreaList(val) {
      let queryLevel;
      let areaCode;
      if (!val) {
        queryLevel = 1;
        areaCode = "";
      } else if (val.length === 1) {
        queryLevel = 2;
        areaCode = val[0];
      } else if (val.length === 2) {
        queryLevel = 3;
        areaCode = val[1];
      }
      let url = "/supplierIsv/rest/getAreaList";
      request({
        url: url,
        method: "get",
        params: {
          queryLevel: queryLevel,
          areaCode: areaCode,
        },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            let items = rsp.data;
            if (queryLevel === 1) {
              this.partnerForm.cascaderData = items.map((value, i) => {
                return {
                  areaCode: value.areaCode,
                  areaName: value.areaName,
                  cities: [],
                };
              });
            } else if (queryLevel === 2) {
              this.partnerForm.cascaderData.map((value, i) => {
                if (value.areaCode === val[0]) {
                  if (!value.cities.length) {
                    value.cities = items.map((value, i) => {
                      return {
                        areaCode: value.areaCode,
                        areaName: value.areaName,
                        cities: [],
                      };
                    });
                  }
                }
              });
            } else if (queryLevel === 3) {
              this.partnerForm.cascaderData.map((value, i) => {
                if (value.areaCode === val[0]) {
                  value.cities.map((value, i) => {
                    if (value.areaCode === val[1]) {
                      if (!value.cities.length) {
                        value.cities = items.map((value, i) => {
                          return {
                            areaCode: value.areaCode,
                            areaName: value.areaName,
                          };
                        });
                      }
                    }
                  });
                }
              });
            }
          } else {
            this.$message.error("服务器获取数据失败!");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    //回显地址
    showAreaList() {
      let val = this.partnerForm.cascaderOptions;
      let queryLevel = 1;
      let areaCode = "";
      let url = "/supplierIsv/rest/getAreaList";
      request({
        url: url,
        method: "get",
        params: {
          queryLevel: queryLevel,
          areaCode: areaCode,
        },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            let Items = rsp.data;
            if (queryLevel === 1) {
              this.partnerForm.cascaderData = Items.map((value, i) => {
                return {
                  areaCode: value.areaCode,
                  areaName: value.areaName,
                  cities: [],
                };
              });
            } else if (queryLevel === 2) {
              this.partnerForm.cascaderData.map((value, i) => {
                if (value.areaCode === val[0]) {
                  if (!value.cities.length) {
                    value.cities = Items.map((value, i) => {
                      return {
                        areaCode: value.areaCode,
                        areaName: value.areaName,
                        cities: [],
                      };
                    });
                  }
                }
              });
            } else if (queryLevel === 3) {
              this.partnerForm.cascaderData.map((value, i) => {
                if (value.areaCode === val[0]) {
                  value.cities.map((value, i) => {
                    if (value.areaCode === val[1]) {
                      if (!value.cities.length) {
                        value.cities = Items.map((value, i) => {
                          return {
                            areaCode: value.areaCode,
                            areaName: value.areaName,
                          };
                        });
                      }
                    }
                  });
                }
              });
            }
            queryLevel = 2;
            areaCode = this.partnerForm.cascaderOptions[0];
            request({
              url: url,
              method: "get",
              params: {
                queryLevel: queryLevel,
                areaCode: areaCode,
              },
            })
              .then((rsp) => {
                if (rsp.code === 20000) {
                  let Items = rsp.data;
                  if (queryLevel === 1) {
                    this.partnerForm.cascaderData = Items.map((value, i) => {
                      return {
                        areaCode: value.areaCode,
                        areaName: value.areaName,
                        cities: [],
                      };
                    });
                  } else if (queryLevel === 2) {
                    this.partnerForm.cascaderData.map((value, i) => {
                      if (value.areaCode === val[0]) {
                        if (!value.cities.length) {
                          value.cities = Items.map((value, i) => {
                            return {
                              areaCode: value.areaCode,
                              areaName: value.areaName,
                              cities: [],
                            };
                          });
                        }
                      }
                    });
                  } else if (queryLevel === 3) {
                    this.partnerForm.cascaderData.map((value, i) => {
                      if (value.areaCode === val[0]) {
                        value.cities.map((value, i) => {
                          if (value.areaCode === val[1]) {
                            if (!value.cities.length) {
                              value.cities = Items.map((value, i) => {
                                return {
                                  areaCode: value.areaCode,
                                  areaName: value.areaName,
                                };
                              });
                            }
                          }
                        });
                      }
                    });
                  }
                  queryLevel = 3;
                  areaCode = this.partnerForm.cascaderOptions[1];
                  request({
                    url: url,
                    method: "get",
                    params: {
                      queryLevel: queryLevel,
                      areaCode: areaCode,
                    },
                  })
                    .then((rsp) => {
                      if (rsp.code === 20000) {
                        let Items = rsp.data;
                        if (queryLevel === 1) {
                          this.partnerForm.cascaderData = Items.map(
                            (value, i) => {
                              return {
                                areaCode: value.areaCode,
                                areaName: value.areaName,
                                cities: [],
                              };
                            }
                          );
                        } else if (queryLevel === 2) {
                          this.partnerForm.cascaderData.map((value, i) => {
                            if (value.areaCode === val[0]) {
                              if (!value.cities.length) {
                                value.cities = Items.map((value, i) => {
                                  return {
                                    areaCode: value.areaCode,
                                    areaName: value.areaName,
                                    cities: [],
                                  };
                                });
                              }
                            }
                          });
                        } else if (queryLevel === 3) {
                          this.partnerForm.cascaderData.map((value, i) => {
                            if (value.areaCode === val[0]) {
                              value.cities.map((value, i) => {
                                if (value.areaCode === val[1]) {
                                  if (!value.cities.length) {
                                    value.cities = Items.map((value, i) => {
                                      return {
                                        areaCode: value.areaCode,
                                        areaName: value.areaName,
                                      };
                                    });
                                  }
                                }
                              });
                            }
                          });
                        }
                      } else {
                        this.$message.error("服务器获取数据失败!");
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                } else {
                  this.$message.error("服务器获取数据失败!");
                }
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            this.$message.error("服务器获取数据失败!");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    //查看明文
    seePlaintext(property) {
      const url = "/supplierIsv/rest/decryptDesensitization";
      const params = {
        id: this.partnerForm.id,
        property: property,
      };
      request({
        url,
        method: "POST",
        data: params,
      })
        .then((res) => {
          if (property === 1) {
            //姓名
            this.partnerForm.contactsName = res.data.value;
          } else if (property === 2) {
            //手机号
            this.partnerForm.contactsPhone = res.data.value;
          } else if (property === 3) {
            //邮箱
            this.partnerForm.contactsEmail = res.data.value;
          }
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },

    handleCurrentChange(val) {
      const url = "supplierIsv/rest/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: val,
          name: this.formInline.name,
          status: this.formInline.value,
          cooperationType: this.formInline.cooperationValue,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    prevClick() {
      const url = "supplierIsv/rest/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page - 1,
          status: this.formInline.value,
          name: this.formInline.name,
          cooperationType: this.formInline.cooperationValue,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    nextClick() {
      const url = "supplierIsv/rest/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page + 1,
          status: this.formInline.value,
          name: this.formInline.name,
          cooperationType: this.formInline.cooperationValue,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    approveView(index, val) {
      const url = "supplierIsv/rest/getApproveMsg";
      request({
        url,
        method: "get",
        params: {
          otherId: val.id,
        },
      }).then((res) => {
        this.dialogApproveVisible = true;
        if (res.data) {
          this.dialogMsg = res.data;
        } else {
          this.dialogMsg = "无数据!";
        }
      });
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
};
</script>

 <style lang="scss" scoped>
.input_style {
  width: 150%;
  margin: 5px 0 5px -30px;
}
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
.btnStyle {
  margin-left: 10px;
}
.dividerStyle {
  margin: 36px 0;
  .title {
    font-size: 16px;
    color: #3c6ef0;
  }
}
/deep/ .el-form-item__label[for="companyCode"] {
  font-size: 14px;
  line-height: 14px;
}
/deep/ .el-dialog__footer {
  text-align: right;
}
</style>
