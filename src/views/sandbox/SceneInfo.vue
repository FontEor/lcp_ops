<template>
  <div class="app-container">
    <el-table :data="table.rowList" border>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="联调场景" prop="name" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.editing">{{ scope.row.name }}</span>
          <el-input v-else size="small" maxlength="100" v-model="scope.row.name" placeholder="请输入联调场景名称"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="场景说明" prop="remark" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.editing">{{ scope.row.remark }}</span>
          <el-input v-else size="small" v-model="scope.row.remark" placeholder="请输入场景说明"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="对接方案" prop="unitName" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.editing">{{ scope.row.unitName }}</span>
          <el-cascader
            v-else
            v-model="scope.row.unitCode"
            :props="unitIdListCascaderProps"
            :options="unitIdListCascaderOptionList"
            :show-all-levels="false"
            clearable
            placeholder="请选择对接方案"
          ></el-cascader>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.editing" type="text" @click="handleClick(scope.row)" size="small">编辑</el-button>
          <el-button v-else type="text" @click="handleSave(scope.row)" size="small">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import lcp from "@/api/lcp/index";
export default {
  name: "SceneInfo",
  props: {},
  watch: {},
  data() {
    return {
      table: {
        rowList: []
      },
      unitIdListCascaderOptionList: [],
      unitIdListCascaderProps: {
        multiple: false,
        emitPath: false,
        value: "code",
        label: "name",
        children: "bizUnitList"
      }
    };
  },
  computed: {},
  mounted() {
    this.selectList();
    this.queryAllBizUnitList();
  },
  methods: {
    // 处理编辑事件
    handleClick(row) {
      row.editing = true;
    },
    // 处理保存事件
    async handleSave(row) {
      row.editing = false;
      await this.edit(row);
      await this.selectList();
    },
    // 运维端-联调场景维护页面-编辑保存
    async edit(row) {
      const params = {
        code: row.code,
        name: row.name,
        remark: row.remark,
        unitCode: row.unitCode
      };
      await lcp.sandbox.sceneInfo
        .edit(params)
        .then(res => {
          if (res.code === 20000) {
            console.log(res);
          }
        })
        .catch(error => {
          throw new Error(`edit, ${error}`);
        });
    },
    // 运维端-联调场景维护页面-查询全部
    async selectList() {
      await lcp.sandbox.sceneInfo
        .selectList()
        .then(res => {
          if (res.code === 20000) {
            let dataList = res.data.map(item => {
              return { ...item, editing: false };
            });
            this.table.rowList = dataList;
          }
        })
        .catch(error => {
          throw new Error(`selectList, ${error}`);
        });
    },
    // 运维端-日志工具-查询对接方案列表
    async queryAllBizUnitList() {
      // 获取分类下的所有对接方案
      await lcp.platform.rest.bizUnit
        .getClassifiedBizUnit()
        .then(res => {
          if (res.code === 20000) {
            this.unitIdListCascaderOptionList =
              res.data instanceof Array
                ? res.data.map((item, index) => {
                    let { bizUnitList } = item;
                    bizUnitList = bizUnitList.map(bizUnitItem => {
                      return { ...bizUnitItem };
                    });
                    return { ...item, code: String(-index), bizUnitList };
                  })
                : [];
          }
        })
        .catch(error => {
          throw new Error(`queryAllBizUnitList, ${error}`);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
