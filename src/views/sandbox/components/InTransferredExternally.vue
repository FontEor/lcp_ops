<template>
  <el-form :disabled="!editable">
    <el-form-item>
      推送的前置条件
      <el-radio-group v-model="mockDetail.mockConditionType">
        <el-radio :label="1">多个前置条件满足任意一个即可推送</el-radio>
        <el-radio :label="2">多个限制条件必须同时满足才能推送</el-radio>
        <el-radio :label="3">无推送限制条件</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="mockDetail.mockConditionType !== 3">
      <div class="mb10" :key="item.id" v-for="(item, index) in pushPreconditionList">
        推送前置条件{{ index + 1 }}
        <el-cascader class="api-input" v-model="item.ApiValue" :ref="`cascader${item.id}`" @change="getCheckedApiNodes(`cascader${item.id}`, item)" :options="apiList" placeholder="请选择"></el-cascader>
        的
        <el-select class="response-input" v-model="item.paramType">
          <el-option :value="1" label="请求参数"></el-option>
          <el-option :value="2" label="响应参数"></el-option>
        </el-select>
        中的
        <el-input class="mock-input" v-model="item.mockPath" placeholder="请填写"></el-input>
        ，当值为
        <el-input class="mock-value-input" v-model="item.mockData" placeholder="请填写"></el-input>
        时，触发推送
        <template v-if="editable">
          <i class="el-icon-circle-close cursor-pointer close-icon" @click="handleDelete(item)"></i>
          <i class="el-icon-circle-plus-outline cursor-pointer" v-if="index === pushPreconditionList.length - 1" @click="handleAdd(item.type)"></i>
        </template>
      </div>
        <i class="el-icon-circle-plus-outline cursor-pointer" v-if="editable && !pushPreconditionList.length" @click="handleAdd(1)"></i>
    </el-form-item>
    <el-form-item>
      本API
      <el-select style="width: 90px;" v-model="mockDetail.isReturnDifferent">
        <el-option :value="0" label="不会"></el-option>
        <el-option :value="1" label="会"></el-option>
      </el-select>
      <template v-if="!mockDetail.isReturnDifferent">从其他API中获取特殊字段的值。</template>
      <template v-else>
        从其他API中获取特殊字段的值，并将特殊字段的值在mock的参数中返回给客户。
        <div class="mt10" v-for="(item, index) in getSpecialValueList" :key="item.id">
          特殊字段{{ index + 1 }}在
          <el-cascader class="api-input" v-model="item.ApiValue" :ref="`cascader${item.id}`" @change="getCheckedApiNodes(`cascader${item.id}`, item)" :options="apiList" placeholder="请选择"></el-cascader>
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
            <i class="el-icon-circle-plus-outline cursor-pointer" v-if="index === getSpecialValueList.length - 1" @click="handleAdd(item.type)"></i>
          </template>
        </div>
        <p>
          <i class="el-icon-circle-plus-outline cursor-pointer" v-if="editable && !getSpecialValueList.length" @click="handleAdd(2)"></i>
        </p>
      </template>
    </el-form-item>
    <el-form-item>
      当客户切换环节时，会为客户推送以下参数
    </el-form-item>
  </el-form>
</template>
<script>
import { SandBoxModule } from "@/store/modules/sandbox";

export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    mockDetail: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    apiList() {
      return SandBoxModule.apiList;
    },
    pushPreconditionList() {
      // 条件1
      const list = this.mockDetail.sandboxNodeApiDetailDtos.filter(item => item.type === 1);
      list.forEach(item => {
        this.initApiValue(item)
      })
      return list;
    },
    getSpecialValueList() {
      // 条件2
      const specialValueList = this.mockDetail.sandboxNodeApiDetailDtos.filter(item => item.type === 2);
      specialValueList.forEach(item => {
        this.initApiValue(item)
      })
      return specialValueList
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
      handler(newOriginalDetail) {
        this.mockDetailNative = newOriginalDetail;
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      mockDetailNative: {}
    };
  },
  methods: {
    initApiValue (item) {
      const {otherApiUri, otherApiName, otherApiCallDirection} = item;
        this.apiList.forEach(apiItem => {
          const children = apiItem.children || [];
          children.forEach(childItem => {
            if (childItem.apiUrl === otherApiUri && childItem.apiName === otherApiName && +childItem.callDirection === +otherApiCallDirection) {
              item.ApiValue = [apiItem.value, childItem.value]
            }
          })
        })
    },
    getCheckedApiNodes(refDom, item) {
      this.$refs[refDom].forEach(domItem => {
        this.changeCheckedApiNodeItem(domItem, item);
      });
    },
    changeCheckedApiNodeItem(domItem, item) {
      const checkedNodes = domItem.getCheckedNodes();
      this.mockDetailNative.sandboxNodeApiDetailDtos.forEach(mockItem => {
        if (mockItem.id === item.id && mockItem.type === item.type) {
          const { apiUrl, apiName, callDirection } = checkedNodes[0].data || {};
          mockItem.otherApiCallDirection = callDirection;
          mockItem.otherApiUri = apiUrl;
          mockItem.otherApiName = apiName;
        }
      });
    },
    handleDelete(item) {
      this.mockDetailNative.sandboxNodeApiDetailDtos = this.mockDetailNative.sandboxNodeApiDetailDtos.filter(mockItem => mockItem.id !== item.id || mockItem.type !== item.type);
    },
    handleAdd(type) {
      const createTime = new Date();
      const item = {
        type,
        sandboxNodeApiCode: "",
        otherUnitCode: "",
        otherApiUri: "",
        otherApiName: "",
        otherApiCallDirection: 2,
        paramType: 1, // 参数类型：1:请求参数,2:响应参数
        mockPath: "",
        mockData: "",
        mockId: null,
        id: -createTime.getTime()
      };
      const length = this.mockDetailNative.sandboxNodeApiDetailDtos.length;
      this.mockDetailNative.sandboxNodeApiDetailDtos.splice(length, 0, item);
    }
  },
  name: "InTransferredExternally"
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
.enmu-wrap {
  display: inline-flex;
  flex-direction: column;
}
</style>
