<template>
  <div>
    <div>
      <span class="font-bolder">联调场景：</span>
      <el-select value-key="unitCode" v-model="filterOptions.scene" placeholder="请选择">
        <el-option v-for="item in sceneList" :key="item.unitCode" :label="item.name" :value="item"> </el-option>
      </el-select>
    </div>
    <Flowchart :currentNode="currentNode" @change="changeFlowchart"></Flowchart>
    <ul class="flex">
      <li>
        <span class="font-bolder">API名称：</span>
        <el-cascader ref="cascader" v-model="checkedApiNodes" @change="getCheckedApiNodes" :options="apiList" placeholder="请选择"></el-cascader>
      </li>
      <li class="pl10 direction">
        API方向：{{ callDirectionMap[`${filterOptions.selectedApi['callDirection']}`]}}
      </li>
      <li class="flex-1 button-wrap">
        <el-button type="primary" v-for="item in prevButtons" :key="item.id" @click="handlePrevNext(item)">上一步：{{item.store.data.node_name}}</el-button>
        <el-button type="primary" v-for="item in nextButtons" :key="item.id" @click="handlePrevNext(item)">下一步：{{item.store.data.node_name}}</el-button>

        <el-button type="primary" v-if="!editable" @click="handleEdit">编辑</el-button>
        <template v-else>
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button type="primary" @click="handleCancel">取消</el-button>
        </template>
      </li>
    </ul>
    <DynamicForm ref="dynamicForm" :filterOptions="filterOptions" :editable="editable" :cancel="cancel"></DynamicForm>
  </div>
</template>

<script>
import Flowchart from "./components/Flowchart";
import API from "@/api/index";
import DynamicForm from "./components/DynamicForm.vue";
import label from '@/components/group/condition';
import {SandBoxModule} from "@/store/modules/sandbox";

export default {
  name: "SandboxJoin",
  props: {},
  watch: {
    "filterOptions.scene.unitCode": {
      handler(newVal) {
        this.selectApiListByCategory();
      }
    },
    checkedApiNodes: {
      handler(newList) {
        this.editable = false;
      },
      deep: true,
      immediate: true,
    }
  },
  components: { Flowchart, DynamicForm },
  data() {
    return {
      sceneList: [],
      filterOptions: {
        scene: {},
        selectedApi: {
          value: 1
        },
        nodeCode: ''
      },
      editable: false,
      callDirectionMap: {
        '1': "客户调JDL", // 外调内
        "2": "JDL调客户"// 内调外
      },
      nextButtons:[],
      prevButtons:[],
      currentNode:'node_1',
      currentNodeObj:{},
      checkedApiNodes: [],
      cancel: false,
    };
  },
  computed: {
    apiList () {
      return SandBoxModule.apiList;
    }
  },
  mounted() {
    this.getSandboxSceneList();
  },
  methods: {
    // 当前节点， 输出节点， 输入节点
    changeFlowchart(currentNodeObj, outgoingNodes, incomingNodes) {
      this.currentNodeObj = currentNodeObj.store.data;
      this.nextButtons = outgoingNodes;
      this.prevButtons = incomingNodes;
      this.filterOptions.nodeCode = this.currentNodeObj.node_code;
      this.editable = false;
    },
    handlePrevNext(obj){
      this.currentNode = obj.id;
    },
    async handleSave () {
      if (this.$refs['dynamicForm']) {
        const isSuccess = await this.$refs['dynamicForm'].handleSave();
        this.editable = !isSuccess;
        this.$refs['dynamicForm'].getSandboxNode();
      }
    },
    handleCancel () {
      this.editable = false;
      this.cancel = true;
    },
    handleEdit () {
      this.cancel = false;
      this.editable = true;
    },
    async getSandboxSceneList() {
      const response = await API.sandbox.sandboxSceneList();
      this.sceneList = response.data || [];
      this.filterOptions.scene = this.sceneList[0];
    },
    async selectApiListByCategory() {
      const params = { unitCode: this.filterOptions.scene.unitCode };
      const response = await API.sandbox.selectApiListByCategory(params);
      const apiList = this.formateCascaderData(response.data);
      SandBoxModule.CHANGE_APILIST(apiList);
      const levelFirstNode = apiList[0] || {};
      const levelSecondeNode = (levelFirstNode["children"] || [])[0] || {}
      this.filterOptions.selectedApi = levelSecondeNode;
      this.checkedApiNodes = [levelFirstNode.value, levelSecondeNode.value]
    },
    formateCascaderData (list, {value, label, subLabel, children} = {label:"name", children:"apiList", value: "code"}) {
      return list.map(item => {
        if (item.apiList) {
          item.apiList = this.formateCascaderData(item.apiList, { label:"apiName", children:"apiList", subLabel:"apiUrl", value: "id"});
        }
        return {
          label: `${item[label]}${item[subLabel] || ''}`,
          value: item[value],
          children: item[children],
          apiUrl: `${item['apiUrl'] || ''}`,
          apiName: item.apiName,
          callDirection: item.callDirection || null,
          id: item.id,
        }
      })
    },
    getCheckedApiNodes () {
      const nodesObj = this.$refs['cascader'].getCheckedNodes();
      this.filterOptions.selectedApi = (nodesObj.map(item => item.data)[0] || {});

    }
  }
};
</script>

<style lang="scss" scoped>
.button-wrap {
  text-align: right;
}
.direction {
  display: flex;
  justify-content: center;
  align-items: center;
}
.open-mock-title {
  color: #3C6EF0;
}
</style>
