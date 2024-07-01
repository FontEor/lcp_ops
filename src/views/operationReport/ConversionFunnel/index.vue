<template>
  <div class="conversion-funnel">
    <div class="conversion-funnel-query">
      <el-form :inline="true" :model="formQuery" label-width="100px">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="formQuery.time"
            type="daterange"
            :clearable="false"
            align="left"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="截止转化时间">
          <el-date-picker
            v-model="formQuery.extraTime"
            type="date"
            :clearable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getConvertFunnelSchemeData">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="conversion-funnel-content">
      <div class="funnel-content-echarts">
        <div ref="funnelContentEcharts" style="height: 550px; width: 100%" />
      </div>
      <div class="funnel-content-desc">
        <h1 class="desc-title">指标说明：</h1>
        <p>
          1.<b>转化漏斗统计口径</b>：时间范围内注册过账号的开发团队到截止时间的转化情况；
        </p>
        <p>2.<b>资质认证</b>：认证过任意一个资质；</p>
        <p>3.<b>创建应用</b>：创建过任意一个应用；</p>
        <p>4.<b>订阅方案</b>：订阅并通过任意一个对接方案；</p>
        <p>5.<b>方案上线</b>：任意一个对接方案点击过上线；</p>
        <p>6.<b>调用接口</b>：调用过任意一个接口；</p>
        <p>
          7.<b>活跃</b>：已上线的方案中，任意一个方案连续7天每天API成功调用总量大于10
        </p>
        <p class="desc-divider">
          <b>悬浮框</b
          >：分别记录每个资质类型下的开发团队数量，如同一开发团队认证多个资质，每种资质均统计，但"全部"去重。
        </p>
        <p><b>柱状图百分比=当前阶段开发团队数量/注册账号开发团队数量</b></p>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import gwSmartLog from "@/api/gwSmartLog/index";

export default {
  name: "ConversionFunnel",
  data() {
    return {
      echartsInstance: null,
      formQuery: {
        time: new Date(),
        extraTime: new Date(),
      },
      pickerOptions: {
        disabledDate: (time) =>
          time.getTime() < this.formQuery.time[1] ||
          time.getTime() > new Date(),
      },
      percentLabel: [],
      echartsData: [],
    };
  },
  async mounted() {
    this.initTimeRange();
    await this.getConvertFunnelSchemeData();
    this.createChartInstance();
  },
  methods: {
    //  初始化查询时间范围
    initTimeRange() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.formQuery.time = [start, end];
    },
    async getConvertFunnelSchemeData() {
      const startTime = this.formQuery.time[0].valueOf();
      const endTime = this.formQuery.time[1].valueOf();
      const extraTime = this.formQuery.extraTime.valueOf();
      const data = [{ startTime, endTime, extraTime }];
      const response =
        await gwSmartLog.conversionFunnel.getConvertFunnelSchemeData(data);
      const registerAccount = response.data.registerAccount;
      registerAccount.value = registerAccount.sum;
      const qualifications = response.data.qualifications;
      qualifications.value = qualifications.sum;
      const application = response.data.application;
      application.value = application.sum;
      const subscriptionBizUnit = response.data.subscriptionBizUnit;
      subscriptionBizUnit.value = subscriptionBizUnit.sum;
      const callInterface = response.data.callInterface;
      callInterface.value = callInterface.sum;
      const bizUnitOnline = response.data.bizUnitOnline;
      bizUnitOnline.value = bizUnitOnline.sum;
      const active = response.data.active;
      active.value = active.sum;
      // 柱状图展示百分比
      this.percentLabel = [
        registerAccount.ratio,
        qualifications.ratio,
        application.ratio,
        subscriptionBizUnit.ratio,
        callInterface.ratio,
        bizUnitOnline.ratio,
        active.ratio,
      ];
      this.echartsData = [
        registerAccount,
        qualifications,
        application,
        subscriptionBizUnit,
        callInterface,
        bizUnitOnline,
        active,
      ];
      this.createChartInstance();
    },
    // echarts图表配置
    createChartInstance() {
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter(params) {
            const item = params[0];
            return `
                ISV:${item.data.isvCount}<br />
                自研商家:${item.data.businessCount}<br />
                合作伙伴:${item.data.partnerCount}<br />
                全部:${item.data.sum}
               `;
          },
        },
        grid: {
          left: "5%",
          right: "4%",
          bottom: "6%",
          containLabel: true,
        },
        xAxis: {
          name: "开发团队所处阶段",
          nameLocation: "middle",
          nameTextStyle: {
            fontSize: 16, //字体大小
            fontWeight: 700,
          },
          nameGap: 34,
          type: "category",
          data: [
            "注册账号",
            "资质认证",
            "创建应用",
            "订阅方案",
            "调用接口",
            "方案上线",
            "活跃",
          ],
        },
        yAxis: {
          name: "开\n发\n团\n队\n转\n化\n数\n量\n(个)",
          nameLocation: "left",
          nameTextStyle: {
            fontSize: 16,
            fontWeight: 700,
            padding: [0, 90, -90, 0],
          },
          type: "value",
        },
        series: [
          {
            data: this.echartsData,
            type: "bar",
            barWidth: 64,
            label: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.percentLabel[params.dataIndex] + "%";
              },
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  const colorList = [
                    "#5470C6",
                    "#90CC75",
                    "#FAC758",
                    "#EE6666",
                    "#9A5FB4",
                    "#73C0DE",
                    "#FC8452",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
          },
        ],
      };
      this.echartsInstance = echarts.init(this.$refs.funnelContentEcharts);
      this.echartsInstance.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.conversion-funnel {
  padding: 30px 0;
  .conversion-funnel-content {
    display: flex;
    justify-content: space-around;

    .funnel-content-echarts {
      width: 70%;
      height: 560px;
      border: 1px solid #333;
    }
    .funnel-content-desc {
      width: 25%;
      height: 560px;
      border: 1px solid #333;
      padding: 20px 10px;
      .desc-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 16px;
      }
      .desc-divider {
        margin: 14px 0;
      }
    }
  }
}
</style>
