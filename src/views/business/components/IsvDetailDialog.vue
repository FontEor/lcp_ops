<template>
  <el-dialog
    title="开发团队详情"
    class="isv-detail-dialog"
    :visible.sync="isvDialogVisible"
    width="900px"
    :before-close="handleClose"
    center
  >
    <!-- 企业信息 -->
    <el-divider class="dialog-divider" content-position="center"
      ><h2 class="divider-title">企业信息</h2>
    </el-divider>
    <el-form :model="isvDetailData" ref="isvForm" label-width="160px">
      <el-form-item label="公司名称:" prop="name">
        <span>{{ isvDetailData.name }}</span>
      </el-form-item>
      <el-form-item label="统一社会信用代码或营业执照号:" prop="companyCode">
        <span>{{ isvDetailData.companyCode }}</span>
      </el-form-item>
      <el-form-item label="企业官网:" prop="officialWebsite">
        <span>{{ isvDetailData.officialWebsite }}</span>
      </el-form-item>
      <el-form-item label="产品名称:" prop="productName">
        <span>{{ isvDetailData.productName }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工商执照照片:">
            <el-button type="text" @click="queryImageData(4)"
              >点击查看</el-button
            >
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业图标:">
            <el-button type="text" @click="queryImageData(5)"
              >点击查看</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="软件著作权:">
        <el-button
          v-if="isvDetailData.softwareRightButtonDisplay"
          type="text"
          @click="queryImageData(9)"
          >点击查看</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 法人信息 -->
    <el-divider class="dialog-divider" content-position="center"
      ><h2 class="divider-title">法人信息</h2>
    </el-divider>
    <el-form :model="isvDetailData" ref="isvForm" label-width="160px">
      <el-form-item label="法人代表姓名:" prop="legalPersonName">
        <span>{{ isvDetailData.legalPersonName }}</span>
      </el-form-item>
      <el-form-item label="法人代表证件号:" prop="legalPersonIdCard">
        <div class="dialog-search-btn">
          <span>{{ isvDetailData.legalPersonIdCard }}</span>
          <el-button type="primary" @click="queryDesensitizationData(6)"
            >查询</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="法人代表证件人像面:">
        <el-button type="text" @click="queryImageData(7)">点击查看</el-button>
      </el-form-item>
      <el-form-item label="法人代表证件国徽面:">
        <el-button type="text" @click="queryImageData(8)">点击查看</el-button>
      </el-form-item>
    </el-form>

    <!-- 联系人信息 -->
    <el-divider class="dialog-divider" content-position="center"
      ><h2 class="divider-title">联系人信息</h2>
    </el-divider>
    <el-form :model="isvDetailData" ref="isvForm" label-width="160px">
      <el-form-item label="联系人姓名:" prop="contactsName">
        <div class="dialog-search-btn">
          <span>{{ isvDetailData.contactsName }}</span>
          <el-button type="primary" @click="queryDesensitizationData(1)"
            >查询</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="联系人手机号:" prop="contactsPhone">
        <div class="dialog-search-btn">
          <span>{{ isvDetailData.contactsPhone }}</span>
          <el-button type="primary" @click="queryDesensitizationData(2)"
            >查询</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="联系邮箱:" prop="contactsEmail">
        <div class="dialog-search-btn">
          <span>{{ isvDetailData.contactsEmail }}</span>
          <el-button type="primary" @click="queryDesensitizationData(3)"
            >查询</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <el-image
      ref="imagePreview"
      style="width: 0px; height: 0px"
      :src="url"
      :zoom-option="{ zoomInRate: 0.3, zoomOutRate: 0.3 }"
      :preview-src-list="srcList"
    >
    </el-image>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import lcp from "@/api/lcp/index";

export default {
  name: "IsvDetailDialog",
  props: {
    isvDialogVisible: {
      type: Boolean,
      required: true,
    },
    isvDetailData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      url: "",
      srcList: [],
    };
  },
  methods: {
    // 查询脱敏数据接口
    async decryptDesensitization(property) {
      // property:1:姓名;2:手机号;3:邮箱;4:营业执照;5:企业图标;6:法人代表身份证件号;7:身份证正;8:身份证反面
      const data = { property, id: this.isvDetailData.id };
      return await lcp.qualification.supplierIsv.decryptDesensitization(data);
    },
    // 查询-图片
    async queryImageData(property) {
      const response = await this.decryptDesensitization(property);
      const value = JSON.parse(response.data.value);
      const { imageJss } = value;
      this.url = imageJss;
      this.srcList = [imageJss];
      // 模拟点击image组件，展示预览大图
      this.$refs.imagePreview.clickHandler();
    },
    // 查询-敏感数据
    async queryDesensitizationData(property) {
      const response = await this.decryptDesensitization(property);
      const propertyMap = {
        1: "contactsName",
        2: "contactsPhone",
        3: "contactsEmail",
        6: "legalPersonIdCard",
      };
      this.isvDetailData[propertyMap[property]] = response.data.value;
    },
    handleClose() {
      this.$emit("update:isvDialogVisible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.isv-detail-dialog {
  /deep/.el-dialog__body {
    max-height: 600px;
    overflow: auto;
  }
  .dialog-divider {
    margin: 30px 0;
    .divider-title {
      font-size: 16px;
      color: #3c6ef0;
    }
  }
  .dialog-search-btn {
    display: flex;
    justify-content: space-between;
  }
}
</style>