<template>
  <div class="docking-cycle">
    <div class="docking-cycle-query">
      <el-form :inline="true" :model="formQuery" label-width="100px">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="formQuery.time"
            type="daterange"
            align="left"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="对接方案名称">
          <el-cascader
            v-model="formQuery.unitIdList"
            :options="unitIdListCascaderOptionList"
            :props="unitIdListCascaderProps"
            :show-all-levels="false"
            :clearable="true"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryAppDockingSchemeData">
            查询
          </el-button>
        </el-form-item>
        <router-link
          :to="{
            path: '/operationReport/customerConnectionDetails',
            query: {
              startTime: formQuery.time[0] ? formQuery.time[0].valueOf() : '',
              endTime: formQuery.time[1] ? formQuery.time[1].valueOf() : '',
              unitIdList: formQuery.unitIdList,
            },
          }"
        >
          <el-button style="float: right" type="text">客户对接明细</el-button>
        </router-link>
      </el-form>
    </div>
    <div class="docking-cycle-board">
      <el-row>
        <el-col :span="6">
          <div class="board-box">
            <h3 class="box-title">
              订阅方案的开发团队数：{{ subscribeTeams }}
            </h3>
            <p class="box-desc">产生方案订阅记录的开发团队数量</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="board-box">
            <h3 class="box-title">
              方案首次联调的开发团队数：{{ firstOnlineCallTeams }}
            </h3>
            <p class="box-desc">对接方案首次产生线上调用的开发团队数量</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="board-box">
            <h3 class="box-title">方案已上线的开发团队数：{{ onlineTeams }}</h3>
            <p class="box-desc">点击方案上线的开发团队数量</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="board-box">
            <h3 class="box-title">活跃的开发团队数：{{ activeTeams }}</h3>
            <p class="box-desc">
              连续7天有调用量且每天调用量大于10的开发团队数量
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="docking-cycle-list">
      <h2 class="list-title">方案已上线的开发团队的对接平均时长占比</h2>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="dockingPhase" label="对接阶段" />
        <el-table-column prop="averageTime" label="平均时长（d）" />
      </el-table>
    </div>
  </div>
</template>

<script>
import gwSmartLog from "@/api/gwSmartLog/index";
import lcp from "@/api/lcp/index";

export default {
  data() {
    return {
      formQuery: {
        time: new Date(),
        unitIdList: [],
      },
      tableData: [],
      subscribeTeams: 0, // 订阅团队数
      firstOnlineCallTeams: 0, // 首次线上调用团队数
      onlineTeams: 0, // 方案上线团队数
      activeTeams: 0, // 活跃团队数
      unitIdListCascaderOptionList: [],
      unitIdListCascaderProps: {
        multiple: true,
        emitPath: false,
        value: "id",
        label: "name",
        children: "bizUnitList",
      },
    };
  },
  mounted() {
    this.initTimeRange();
    this.handleGetClassifiedBizUnit();
    this.queryAppDockingSchemeData();
  },
  methods: {
    // 获取分类下的所有对接方案
    async getClassifiedBizUnit() {
      return await lcp.platform.rest.bizUnit
        .getClassifiedBizUnit()
        .catch((error) => {
          throw new Error(`getClassifiedBizUnit, ${error}`);
        });
    },
    async handleGetClassifiedBizUnit() {
      const { data } = await this.getClassifiedBizUnit().catch((error) => {
        throw new Error(`handleGetClassifiedBizUnit, ${error}`);
      });
      this.unitIdListCascaderOptionList =
        data instanceof Array
          ? data.map((item, index) => {
              let { bizUnitList } = item;
              bizUnitList = bizUnitList.map((bizUnitItem) => {
                const { id } = bizUnitItem;
                return { ...bizUnitItem, id };
              });
              return { ...item, id: String(-index), bizUnitList };
            })
          : [];
    },
    //  时间范围默认定位最近30天
    initTimeRange() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.formQuery.time = [start, end];
    },
    async queryAppDockingSchemeData() {
      const startTime = this.formQuery.time[0].valueOf();
      const endTime = this.formQuery.time[1].valueOf();
      const unitIdList = this.formQuery.unitIdList;
      const data = { startTime, endTime, unitIdList };
      const response =
        await lcp.platform.rest.bizUnit.selectAppDockingSchemeData(data);
      this.subscribeTeams = response.data.subscribeTeams;
      this.firstOnlineCallTeams = response.data.firstOnlineCallTeams;
      this.onlineTeams = response.data.onlineTeams;
      this.activeTeams = response.data.activeTeams;
      const {
        teamToCertificationAvgTime,
        certificationToOrderAvgTime,
        orderToOnlineAvgTime,
        onlineToPlanAvgTime,
      } = response.data;
      this.tableData = [
        {
          dockingPhase: "【团队注册】到【资质认证审核通过】",
          averageTime: teamToCertificationAvgTime,
        },
        {
          dockingPhase: "【资质认证审核通过】到【订阅方案】",
          averageTime: certificationToOrderAvgTime,
        },
        {
          dockingPhase: "【订阅方案】到【线上产生首次调用】",
          averageTime: orderToOnlineAvgTime,
        },
        {
          dockingPhase: "【线上产生首次调用】到【方案上线】",
          averageTime: onlineToPlanAvgTime,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.docking-cycle {
  .docking-cycle-query {
    margin: 20px 0;
  }
  .docking-cycle-board {
    .board-box {
      text-align: center;
      width: 280px;
      .box-title {
        font-size: 16px;
        font-weight: 700;
      }
      .box-desc {
        font-size: 14px;
        margin: 18px 0;
      }
    }
  }
  .docking-cycle-list {
    width: 40%;
    margin-top: 40px;
    .list-title {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>
