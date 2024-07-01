<template>
  <div class="table-list">
    <el-table :data="tableData" row-key="code" :row-class-name="getRowClassName">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <TableSubDetail v-if="scope.row.dockingStatus" :code="scope.row.code" />
          <div v-else class="unable-to-expand-column" />
        </template>
      </el-table-column>
      <el-table-column label="需求单号" prop="orderNo" />
      <el-table-column label="客户公司名称" prop="companyName" />
      <el-table-column label="商家/事业部编码" prop="companyCode" />
      <el-table-column label="客户京东pin" prop="pin" />
      <el-table-column label="归属省区" prop="belongProvince" />
      <el-table-column label="业务范围" prop="business">
        <template slot-scope="scope">
          {{ scope.row.business | formatBusiness }}
        </template>
      </el-table-column>
      <el-table-column label="需求申请人erp" prop="applicant" />
      <el-table-column label="需求承接人erp" prop="successor" />
      <el-table-column label="需求发起时间" prop="startTime" />
      <el-table-column label="需求结束时间" prop="completeTime" />
      <el-table-column label="需求耗时" prop="timeConsuming" />
      <el-table-column label="已达成状态" prop="dockingStatus">
        <template slot-scope="scope">
          {{ scope.row.dockingStatus | formatCurrentStatus }}
        </template>
      </el-table-column>
      <el-table-column label="订阅方案" prop="unitList">
        <template slot-scope="scope">
          <div v-for="item in scope.row.unitList" :key="item">
            {{ item }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <slot />
  </div>
</template>

<script>
import TableSubDetail from './tableSubDetail.vue'
import { cloneDeep } from 'lodash'
export default {
  name: 'TableList',
  components: {
    TableSubDetail
  },

  filters: {
    formatBusiness(value) {
      const hashMap = new Map()
        .set(1, '快递')
        .set(2, '快运')
      return hashMap.get(value) || ''
    },
    formatCurrentStatus(value) {
      const hashMap = new Map()
        .set(0, '需求发起')
        .set(1, '注册账号')
        .set(2, '资质认证')
        .set(3, '创建应用')
        .set(4, '订阅方案')
        .set(5, '首次调用接口')
        .set(6, '方案连续7天调用量大于10')
      return hashMap.get(value) || ''
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },

  methods: {
    getRowClassName(params) {
      const { row } = params
      if (row.dockingStatus) {
        return 'block-row-expand'
      } else {
        return 'display-row-expand'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list {
  /deep/ .el-table__expanded-cell {
    padding: 0;
    border: none;
    // background-color: #eee !important;
  }
}
.unable-to-expand-column {
  padding: 0;
  border: 0;
}
/deep/.display-row-expand {
  // display: none;
  .el-table__expand-column {
    .cell {
      .el-table__expand-icon {
        display: none;
      }
    }
  }
}
</style>
