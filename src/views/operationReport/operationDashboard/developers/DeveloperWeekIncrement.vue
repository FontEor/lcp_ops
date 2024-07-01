<template>
<el-scrollbar>
    <div
        id="developer_week_increment"
        ref="developer_week_increment"
        style="width: 100%; height: 371px"
    />
</el-scrollbar>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    weekNos: Array,
    isv: Array,
    selfDev: Array,
    partner: Array,
    total: Array,
  },
  data() {
    return {
        incrementEchart: null,
    };
  },
  computed: {
      selDevIncrease: function () {
          return getIncreaseList(this.selfDev).slice(1);
        },
      partnerIncrease: function () {
            return getIncreaseList(this.partner).slice(1)
        },
      isvIncrease: function () {
            return getIncreaseList(this.isv).slice(1)          
        },
      totalIncrease: function () {
          return getIncreaseList(this.total);
        },
      totalRose: function () {
            return this.totalIncrease.reduce((res, curVal, curIndex, array) => {
                if (curIndex > 0) {
                    const preVal = array[curIndex - 1]
                    const computedVal = preVal !== 0 ? (((curVal - preVal)/ preVal) * 100).toFixed(1): null;
                    res.push(computedVal);
                }
                return res;
            }, [])
        },
  },
  watch: {
      weekNos: {
      handler: function () {
        this.setUpEchart();
      },
    },
    isv: {
      handler: function () {
        this.setUpEchart();
      },
    },
    selfDev: {
      handler: function () {
        this.setUpEchart();
      },
    },
    partner: {
      handler: function () {
        this.setUpEchart();
      },
    },
    total: {
        handler: function () {
        this.setUpEchart();
      },
    },
  },
  mounted() {
      this.setUpEchart();
  },
  methods: {
    setUpEchart () {
        !this.incrementEchart && this.initEchart();
        this.incrementEchart && this.drawEchart();
    },
    initEchart () {
        this.incrementEchart = echarts.init(
            this.$refs.developer_week_increment
        );
    },
      drawEchart() {
        const totalIncrease = this.totalIncrease.slice(1);
        const totalRose = this.totalRose;
        const option = {
            title: {
                text: "开发团队增量周趋势图",
                left: '0',
            },
            legend: {
                data: ['自研商家', "ISV", '合作伙伴', '周环比增长'],
                show: true,
                x: "center",
                y: "bottom",
            },
            grid: {
                top: "18%",
                left: "0",
                right: "0",
                bottom: "10%",
                containLabel: true,
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
                formatter:function (param) {
                    let res = `
                        <p style="font-weight: 600;">${param[0]['name']}</p>`;
                    param.forEach(item => {
                        const value = item['value'];
                        const seriesName = item['seriesName'];
                        const color = item['color']
                        if (seriesName === '周环比增长') {
                            res+=  `
                                <div>
                                <p style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:transparent"></p>
                                全部：${totalIncrease[param[0]['dataIndex']]}
                                </div>
                            `
                        }
                        res+=  `
                                <div>
                                <p style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${color}"></p>
                                ${seriesName}：${value === undefined ? 'Infinity': value}${seriesName === '周环比增长' && value !== undefined? '%': ''}
                                </div>
                            `
                    })
                    return res;
                }
            },
            xAxis: {
                data: this.weekNos,
                axisLabel: {
                    interval: 0,
                    rotate: this.weekNos.length > 10 ? -45 : 0,
                }
            },
            yAxis:  [
                {
                    name: '新增数量（家）',
                    nameTextStyle: {
                        padding: [0,0,0, 60],
                    },
                    type: 'value',
                     max: value => {
                        return Math.ceil(getAbsMax(value) * 1.2);
                    },
                    minInterval: 1,
                },
                {
                    name: '周环比增长',
                    type: 'value',
                    splitLine:{
                　　　　show:false
                　　},
                    axisLabel: {  
                        show: true,  
                        interval: 'auto',  
                        formatter: '{value} %'  
                    }, 
                    max: value => {
                        return Math.ceil(getAbsMax(value) * 1.2);
                    },
                    min: value => {
                        return Math.floor(-getAbsMax(value) * 1.2);
                    }
                }
            ],
            series: [
                {
                    barMaxWidth: 40,
                    data:this.partnerIncrease,
                    name: "合作伙伴",
                    type: "bar",
                    stack: 'week',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal:{
                            color:'#e9cd25',
                        }
                    },
                    label: {
                            show: true,
                            position: 'inside',//在左边显示
                        },

                },
                {
                    barMaxWidth: 40,
                    data: this.isvIncrease,
                    name: "ISV",
                    type: "bar",
                    stack: 'week',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal:{
                            color:'#5facf2',
                        }
                    },
                    label: {
                            show: true,
                            position: 'inside',//在左边显示
                        },
                    
                },
                {
                    barMaxWidth: 40,
                    data: this.selDevIncrease,
                    name: "自研商家",
                    type: "bar",
                    stack: 'week',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal:{
                            color:'#4eca73',
                        },
                    },
                    label: {
                            show: true,
                            position: 'inside',//在左边显示
                    },
                },
                {
                    name: '周环比增长',
                    data: totalRose,
                    type: 'line',
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: "#f29494"//折线颜色
                            },
                            color: '#f29494',//拐点颜色
                            label: {
                                show: true,
                                formatter: (params) => { return `${params.value}%` },
                            },
                        },
                    },
                }
            ]
        }
        this.incrementEchart.setOption(option);
    }
  },
};
function getIncreaseList (list) {
    const lastItemIndex = list.length - 1;
    return list.reduce((res, curVal, curIndex, array) => {
        if (curIndex < lastItemIndex) {
            res.push(array[curIndex + 1] - curVal)
        }
        return res
    }, [])
}
function getAbsMax (value = {}) {
    const {max, min} = value;
    const absMax = Math.max(Math.abs(max), Math.abs(min));
    return absMax
}
</script>

<style lang="scss" scoped>
</style>
