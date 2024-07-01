<template>
  <div>
    <el-form :disabled="!editable">
      <el-form-item>
        本API
        <el-select style="width: 90px;" v-model="mockDetail.mockConditionType">
          <el-option :value="0" label="不会"></el-option>
          <el-option :value="1" label="会"></el-option>
        </el-select>
        <template v-if="!mockDetail.mockConditionType">从其他API中获取特殊字段的值。</template>
        <template v-else
          >从其他API中获取特殊字段的值，并将特殊字段的值在mock的参数中返回给客户。
          <div class="mt10" :key="item.id" v-for="(item, index) in getSpecialValue">
            特殊字段{{ index + 1 }}在
            <el-cascader
              class="api-input"
              v-model="item.ApiValue"
              :ref="`cascader${item.id}`"
              @change="getCheckedApiNodes(`cascader${item.id}`, item)"
              :options="apiList"
              placeholder="请选择"
            ></el-cascader>
            的
            <el-select class="response-input" v-model="item.paramType">
              <el-option :value="1" label="请求参数"></el-option>
              <el-option :value="2" label="响应参数"></el-option>
            </el-select>
            中的
            <el-input class="mock-input" v-model="item.mockPath" placeholder="请填写"></el-input>
            ，其值用
            <el-input class="mock-value-input" v-model="item.mockData" placeholder="请填写"></el-input>
            表示
            <template v-if="editable">
              <i class="el-icon-circle-close cursor-pointer close-icon" @click="handleDelete(item)"></i>
              <i class="el-icon-circle-plus-outline cursor-pointer" v-if="getSpecialValue.length - 1 === index" @click="handleAdd"></i>
            </template>
          </div>
          <i class="el-icon-circle-plus-outline cursor-pointer" v-if="editable && !getSpecialValue.length" @click="handleAdd"></i>
        </template>
      </el-form-item>
      <el-form-item>
        本API
        <el-select style="width: 90px;" v-model="mockDetail.isReturnDifferent">
          <el-option :value="0" label="不会"></el-option>
          <el-option :value="1" label="会"></el-option>
        </el-select>
        <template v-if="!mockDetail.isReturnDifferent">根据其他API的字段返回不同的参数。</template>
        <template v-else>
          根据
          <el-cascader
            class="api-input"
            :ref="`cascader${responseDifferentValueObject.id}`"
            v-model="responseDifferentValueObject.ApiValue"
            @change="getCheckedDifferentApiNodes(`cascader${responseDifferentValueObject.id}`, responseDifferentValueObject)"
            :options="apiList"
            placeholder="请选择"
          ></el-cascader>
          的
          <el-select class="response-input" v-model="responseDifferentValueObject.paramType" @change="handleParamTypeChange">
            <el-option :value="1" label="请求参数"></el-option>
            <el-option :value="2" label="响应参数"></el-option>
          </el-select>
          中的
          <el-input class="mock-input" v-model="responseDifferentValueObject.mockPath" placeholder="请填写" @change="handleChangeMockPath"></el-input>
          返回不同的参数，当值为
          <div class="enum-wrap">
            <el-select class="response-input" v-model="enumerationObjectValue" @change="handleChangeEnumeration" value-key="id">
              <el-option v-for="enumItem in enumerationList" :key="enumItem.id" :label="enumItem.mockData" :value="enumItem"> </el-option>
            </el-select>
            <el-link :underline="false" type="primary" :disabled="!editable" @click="showClassifyCationDialog = true">管理枚举值</el-link>
          </div>
          时，
        </template>
      </el-form-item>
      <el-form-item>
        当业务系统的响应参数中的
        <el-input class="mock-value-input" v-model="mockDetail.mockResponsePath" placeholder="请填写"></el-input>
        值为
        <el-input class="response-input" v-model="mockDetail.mockResponseData" placeholder="请填写"></el-input>
        时，会返回以下参数替代业务系统返回的参数，否则按照业务系统的出参直接返回
      </el-form-item>
    </el-form>
    <ClassifyCationDialog @updateDifferentList="updateEnumList" :showClassificationDialog.sync="showClassifyCationDialog" :sandboxNodeApiCode="mockDetail.code"></ClassifyCationDialog>
  </div>
</template>
<script>
import { SandBoxModule } from "@/store/modules/sandbox";
import ClassifyCationDialog from "./ClassifyCationDialog.vue";
import API from "@/api/index";
import _ from "lodash";

export default {
  components: {
    ClassifyCationDialog
  },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    mockDetail: {
      type: Object,
      default: () => {}
    },
  },
  computed: {
    apiList() {
      return SandBoxModule.apiList;
    },
    getSpecialValue() {
      // 条件1
      const specialValue = (this.mockDetail.sandboxNodeApiDetailDtos || []).filter(item => item.type === 1);
      // 回显逻辑
      specialValue.forEach(item => {
        item.ApiValue = [0, 0];
        this.initApiValue(item);
      });
      return specialValue;
    }
  },
  watch: {
    mockDetailNative: {
      handler(newDetail) {
        this.$emit("update: mockDetail", newDetail);
      },
      immediate: true,
      deep: true
    },
    mockDetail: {
      async handler(newOriginalDetail, oldOrginalDetail) {
        this.mockDetailNative = newOriginalDetail;
        const newId = (newOriginalDetail || {}).id;
        const oldId = (oldOrginalDetail || {}).id;
        if (+newId !== +oldId) {
          this.activeResponseDifferentValueObject = {};
          await this.getEnumerationList();
          this.initResponseDifferentValueObject();
        }
      },
      immediate: true,
      deep: true
    },
  },
  data() {
    return {
      mockDetailNative: {},
      responseDifferentValueObject: {},
      enumerationObjectValue: {},
      showClassifyCationDialog: false,
      enumerationList: [],
      activeResponseDifferentValueObject: {},
    };
  },
  mounted() {},
  methods: {
    initResponseDifferentValueObject() {
      const firstItem = (this.mockDetailNative.sandboxNodeApiDetailDtos || []).filter(item => item.type === 2)[0] || {}
      if (!Object.keys(this.activeResponseDifferentValueObject).length) {
        this.responseDifferentValueObject = firstItem;
        this.activeResponseDifferentValueObject = firstItem;
      } else {
        this.responseDifferentValueObject = _.cloneDeep(this.activeResponseDifferentValueObject);
      }
      this.responseDifferentValueObject.ApiValue = [0, 0];
      this.initApiValue(this.responseDifferentValueObject);
      this.enumerationObjectValue = {
        id: this.responseDifferentValueObject.id,
        mockData: this.responseDifferentValueObject.mockData,
        sandboxNodeApiCode: this.responseDifferentValueObject.sandboxNodeApiCode
      };
    },
    initApiValue(item) {
      const { otherApiUri, otherApiName, otherApiCallDirection } = item;
      this.apiList.forEach(apiItem => {
        const children = apiItem.children || [];
        children.forEach(childItem => {
          if (childItem.apiUrl === otherApiUri && childItem.apiName === otherApiName && +childItem.callDirection === +otherApiCallDirection) {
            item.ApiValue = [apiItem.value, childItem.value];
          }
        });
      });
    },
    async updateEnumList() {
      await this.getEnumerationList();
      // 拿到最新的枚举值后，检查用户已经选择的枚举值是否在最新的枚举值列表中，若不在，则将用户选择的枚举值初始化
      const hasSelectedItem = this.enumerationList.find(item => +item.id === this.enumerationObjectValue.id);
      if (!hasSelectedItem) {
        this.enumerationObjectValue = {};
      }
      // 遍历枚举值，如果当前枚举值没有在条件列表，则将当前枚举值项放入条件列表
      this.enumerationList.forEach(enumItem => {
        const isInDtos = this.mockDetailNative.sandboxNodeApiDetailDtos.find(dtoItem => +dtoItem.id === +enumItem.id);
        if (!isInDtos) {
          const {otherApiCallDirection,otherApiUri,otherApiName, paramType, mockPath} = this.responseDifferentValueObject;
          enumItem.otherApiCallDirection = otherApiCallDirection;
          enumItem.otherApiUri = otherApiUri;
          enumItem.otherApiName = otherApiName;
          enumItem.paramType = paramType;
          enumItem.mockPath = mockPath;
          this.mockDetailNative.sandboxNodeApiDetailDtos.push(enumItem);
        }
      });
      // 遍历条件列表，如果当前条件列表没在枚举值中，将其从条件列表删除
      this.mockDetailNative.sandboxNodeApiDetailDtos = this.mockDetailNative.sandboxNodeApiDetailDtos.filter(dtoItem => {
        const inEnumList = this.enumerationList.find(item => +item.id === +dtoItem.id && +item.type === +dtoItem.type);
        return Boolean(inEnumList)
      })

    },
    getEnumerationList() {
      return new Promise(async resolve => {
        const response = await API.sandbox.selectDifferentList({ sandboxNodeApiCode: this.mockDetail.code });
        this.enumerationList = response.data;
        resolve();
      });
    },
    handleChangeEnumeration({ id, mockData }) {
      const activeItem = this.mockDetail.sandboxNodeApiDetailDtos.find(item => +item.id === +id) || {};
      this.$emit("getMockData", { id });
      this.activeResponseDifferentValueObject = activeItem;
      this.initResponseDifferentValueObject();
    },
    changeCheckedApiNodeItem(domItem, item, changeSelf = false) {
      const checkedNodes = domItem.getCheckedNodes();
      this.mockDetailNative.sandboxNodeApiDetailDtos.forEach(mockItem => {
        const changeSelfFlag = changeSelf ? mockItem.id === item.id : true; // changeSelf true: 只更改一个；false：更改多个
        if (changeSelfFlag && mockItem.type === item.type) {
          const { apiUrl, apiName, callDirection } = checkedNodes[0].data || {};
          mockItem.otherApiCallDirection = callDirection;
          mockItem.otherApiUri = apiUrl;
          mockItem.otherApiName = apiName;
        }
      });
    },
    getCheckedApiNodes(refDom, item) {
      this.$refs[refDom].forEach(domItem => {
        this.changeCheckedApiNodeItem(domItem, item, true);
      });
    },
    getCheckedDifferentApiNodes(refDom, item) {
      const domItem = this.$refs[refDom];
      this.changeCheckedApiNodeItem(domItem, item, false);
    },
    handleParamTypeChange(newParamType) {
      this.changeMockDetailSandboxNodeApiDetailDtosAllItem(2, "paramType", newParamType);
    },
    handleChangeMockPath(newMockPath) {
      this.changeMockDetailSandboxNodeApiDetailDtosAllItem(2, "mockPath", newMockPath);
    },
    changeMockDetailSandboxNodeApiDetailDtosAllItem(type, key, value) {
      this.mockDetailNative.sandboxNodeApiDetailDtos.forEach(item => {
        if (+item.type === +type) {
          item[key] = value;
        }
      });
    },
    handleDelete(item) {
      this.mockDetailNative.sandboxNodeApiDetailDtos = this.mockDetailNative.sandboxNodeApiDetailDtos.filter(mockItem => mockItem.id !== item.id || mockItem.type !== item.type);
    },
    handleAdd() {
      const createTime = new Date();
      const item = {
        type: 1,
        sandboxNodeApiCode: "",
        otherUnitCode: "",
        otherApiUri: "",
        otherApiName: "",
        otherApiCallDirection: 1,
        paramType: 1, // 参数类型：1:请求参数,2:响应参数
        mockPath: "",
        mockData: "",
        mockId: null,
        id: -createTime.getTime()
      };
      const index = this.mockDetailNative.sandboxNodeApiDetailDtos.length;
      this.mockDetailNative.sandboxNodeApiDetailDtos.splice(index, 0, item);
    }
  },
  name: "ExternallyTransferredIn"
};
</script>
<style lang="scss" scoped>
.close-icon {
  margin: 0 8px;
}
.api-input {
  width: 250px;
}
.mock-input {
  width: 300px;
}
.response-input {
  width: 100px;
}
.mock-value-input {
  width: 120px;
}
.enum-wrap {
  display: inline-flex;
  flex-direction: column;
}
</style>
