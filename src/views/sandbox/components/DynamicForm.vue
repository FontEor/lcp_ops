<template>
  <div>
    <el-divider>
      <span class="open-mock-title mr4">mock配置</span>
      <el-checkbox v-show="editable" v-model="mockDetail.isMock" :true-label="1" :false-label="0"></el-checkbox>
    </el-divider>
    <div v-if="mockDetail.isMock">
      <!-- 客户调JDL -->
      <ExternallyTransferredIn ref="ExternallyTransferredIn" v-if="+filterOptions.selectedApi.callDirection === 1" :filterOptions="filterOptions" :editable="editable" :mockDetail.sync="mockDetail" @getMockData="getMockData"></ExternallyTransferredIn>
      <!-- JDL调客户 -->
      <InTransferredExternally :editable="editable" v-if="+filterOptions.selectedApi.callDirection === 2" :mockDetail.sync="mockDetail"></InTransferredExternally>
      <!-- 代码展示区域  mockData-->
      <MonacoEditor ref="monaco" :editXml="editable" :code="mockData" @codeChange="handleCodeChange"></MonacoEditor>
    </div>
  </div>
</template>
<script>
import API from "@/api/index";
import ExternallyTransferredIn from "./ExternallyTransferredIn.vue";
import { SandBoxModule } from "@/store/modules/sandbox";
import InTransferredExternally from "./InTransferredExternally.vue";
import MonacoEditor from "./MonacoEditor.vue";
import { async } from '@antv/x6/lib/registry/marker/main';
import _ from "lodash";

export default {
  name: "DynamicForm",
  components: {
    ExternallyTransferredIn,
    InTransferredExternally,
    MonacoEditor
  },
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    filterOptions: {
      type: Object,
      default: () => {}
    },
    cancel: {
      type: Boolean,
      default: false,
    }
  },
  computed: {},
  watch: {
    filterOptions: {
      handler() {
        this.getSandboxNode();
      },
      deep: true,
    },
    "filterOptions.selectedApi": {
      handler() {
        this.getMockData();
      },
      deep: true
    },
    "mockDetail.isReturnDifferent": {
      handler(newValue) {
        this.getMockData();
      }
    },
    cancel: {
      handler(newValue) {
        if (newValue) {
          this.getSandboxNode();
        }
      }
    }
  },
  data() {
    return {
      mockDetail: {
        isMock: 0
      },
      mockData: "",
    };
  },
  methods: {
    async getSandboxNode() {
      const {scene, selectedApi, nodeCode} = this.filterOptions;
      const {unitCode, code} = scene;
      const {apiUrl, callDirection} = selectedApi;
      if (!unitCode || !code || !apiUrl || !nodeCode) {
        return;
      }
      const data = {
        unitCode: unitCode,
        apiUri: apiUrl,
        sandboxSceneCode: code,
        nodeCode: nodeCode,
        apiCallDirection: callDirection,
      };
      const response = await API.sandbox.sandboxNodeApi(data);
      this.mockDetail = response.data;
      this.setEmptyInitData();
    },
    setEmptyInitData() {
      this.mockDetail.isReturnDifferent === null && (this.mockDetail.isReturnDifferent = 0);
      if (+this.filterOptions.selectedApi['callDirection'] === 1) { // 客户调JDL
        // 两个条件
        this.mockDetail.mockConditionType === null && (this.mockDetail.mockConditionType = 0);
      }
      if (+this.filterOptions.selectedApi['callDirection'] === 2) { // JDL调客户
        this.mockDetail.mockConditionType === null && (this.mockDetail.mockConditionType = 1);
      }
      // 条件集合
      this.mockDetail.sandboxNodeApiDetailDtos === null && (this.mockDetail.sandboxNodeApiDetailDtos = []);
      this.getMockData();
    },
    getMockData (itemInfo) {
      // {level, id}
      if (!itemInfo) {
        if (this.filterOptions.selectedApi.callDirection === 2) {
          // JDL调客户,使用默认mock数据
          this.mockData = this.mockDetail.sandboxMockData;
        } else {
            // 客户调JDL
          if (this.mockDetail.isReturnDifferent) {
            // 第二个会的时候，使用枚举值的mock数据
            const typeTwoList = this.mockDetail.sandboxNodeApiDetailDtos.filter(item => +item.type === 2) || [];
            typeTwoList.length && (this.mockData = typeTwoList[0].sandboxMockData);
          } else {
            //  第二个不会的时候，使用默认mock数据
            this.mockData = this.mockDetail.sandboxMockData;
          }
        }
      } else { // 枚举值变化
        const activeItem = _.cloneDeep(this.mockDetail.sandboxNodeApiDetailDtos.find(item => +item.id === itemInfo.id)) || {};
        this.mockData = activeItem["sandboxMockData"];
      }
      this.$nextTick(() => {
        const monacoDom = this.$refs["monaco"];
        monacoDom && monacoDom.setNewValue(this.mockData || "")
      })
    },
    handleCodeChange({newCode}) {
      if (!this.editable) {
        return;
      }
      if (this.filterOptions.selectedApi.callDirection === 2) { // JDL调客户，赋值默认值
        this.mockDetail.sandboxMockData = newCode;
      }
      if(this.filterOptions.selectedApi.callDirection === 1 ) {// 客户调JDL
        if (this.mockDetail.isReturnDifferent) {
          // 第二个条件会
          const activeEnumItem = this.$refs["ExternallyTransferredIn"].responseDifferentValueObject;
          this.mockDetail.sandboxNodeApiDetailDtos.forEach(item => {
            if (+item.id === +activeEnumItem.id) {
              item.sandboxMockData = newCode
            }
          })
        } else {
          // 第二个条件不会
          this.mockDetail.sandboxMockData = newCode;
        }
      }
    },
    handleSave () {
      return new Promise((resolve) => {
        const data = this.mockDetail;
        data.apiName = this.filterOptions.selectedApi.apiName;
        data.sandboxNodeApiDetailDtos.forEach(item => {
          item.otherUnitCode = this.filterOptions.scene.unitCode
          item.sandboxNodeApiCode = data.code
          if(item.id < 0) {
            item.id = null;
          }
        })
        this.saveVerify(data).then(async (pass) => {
          if(!pass) return;
          const response = await API.sandbox.saveMockData(data);
          resolve(response.code === 20000)
          if (response.code === 20000) {
            this.$message.success("保存成功");
          } else {
            this.$message.error("保存失败");
          }
        }).catch();
      })
    },
    saveVerify (data) {
      // 保存前验证
      return new Promise((resolve) => {
        const {sandboxMockData, sandboxNodeApiDetailDtos, mockConditionType, isReturnDifferent, mockResponsePath, mockResponseData} = this.mockDetail;
        (sandboxNodeApiDetailDtos || []).forEach(item => {
          const {mockConditionType, otherApiCallDirection, otherApiUri, otherApiName, paramType, mockPath, mockData, sandboxNodeApiCode} = item;
          // 客户调JDL
          if (+this.filterOptions.selectedApi['callDirection'] === 1) {
            if(+mockConditionType === 1 && item.type === 1 && (!otherApiCallDirection || !otherApiUri || !otherApiName || !mockPath || !mockData || !paramType) ) {
              // 条件1打开
              this.$message.error("请填入完整的信息1");
              resolve(false);
              throw new Error("请填入完整信息")
            }
            if (+isReturnDifferent === 1 && +item.type === 2 && (!sandboxNodeApiCode || !otherApiCallDirection || !otherApiUri || !otherApiName || !paramType || !mockPath || !mockData)) {
              // 条件2打开
              this.$message.error("请填入完整的信息2");
              resolve(false);
              throw new Error("请填入完整信息")
            }
            if (!mockResponsePath || !mockResponseData) {
              this.$message.error("请填入完整的信息3");
              resolve(false);
              throw new Error("请填入完整信息")
            }
          }
          // JDL调客户
          if (+this.filterOptions.selectedApi['callDirection'] === 2) {
            if ((+isReturnDifferent === 1  || +mockConditionType !== 3) && (!otherApiCallDirection || !otherApiUri || !otherApiName || !mockPath || !mockData || !paramType)) {
              // 条件1、2打开
              this.$message.error("请填入完整的信息4");
              resolve(false);
              throw new Error("请填入完整信息")
            }

          }
        })
        resolve(true)
      })
    }
  }
};
</script>
<style lang="scss" scoped></style>
