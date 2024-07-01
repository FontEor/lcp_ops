<template>
  <div>
    <div v-if="loading">
      正在加载...
    </div>
    <div v-else class="table-sub-detail">
      <div class="detail-tit">需求状态</div>
      <el-steps :space="200" class="detail-steps" align-center>
        <el-step v-for="(item, index) in dockingItemsList" :key="index" :title="item.title" :description="item.operatingTime"
                 :status="item.type ? 'finish' : ''"
        />
      </el-steps>
      <div class="detail-tit">对接状态</div>
      <el-steps :space="200" class="detail-steps" align-center>
        <el-step v-for="(item, index) in dockingStatusList" :key="index" :title="item.title" :description="item.operatingTime"
                 :status="item.type ? 'finish' : ''"
        />
      </el-steps>
      <div class="detail-tit">已调用接口</div>
      <template v-for="(item, index) in usedApiList">
        <div :key="index">
          <div class="detail-tbl-tit">
            <span>应用名称：{{ item.appName }}</span>
            <span>appkey：{{ item.appKey }}</span>
          </div>
          <el-table class="detail-tbl" size="mini" :data="item.itemsList" style="width: 900px" border>
            <el-table-column prop="name" label="对接方案" width="180" />
            <el-table-column prop="unitName" label="接口/消息中文名" width="200" />
            <el-table-column prop="uri" label="接口URL/消息TOPIC" />
          </el-table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import lcp from '@/api/lcp/index'
const dockingEnum = [
  {
    title: '需求发起'
  },
  {
    title: '需求承接'
  },
  {
    title: '需求完成申请'
  },
  {
    title: '销售审批完成'
  }
]
const StatusEnums = [
  {
    title: '注册账号'
  },
  {
    title: '资质认证'
  },
  {
    title: '创建应用'
  },
  {
    title: '订阅方案'
  },
  {
    title: '首次调用接口'
  },
  {
    title: '7天调用量时间'
  }
]
export default {
  name: 'TableSubDetail',
  props: {
    code: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      dockingItemsList: [],
      dockingStatusList: [

      ],
      usedApiList: []
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const params = {
        code: this.code
      }
      await lcp.kkBoardApi.dockingKk.detail(params)
        .then((res) => {
          if (res.code === 20000) {
            console.log(res)
            const { data } = res
            const { usedApiList, dockingStatusList, dockingItemsList } = data
            this.usedApiList = usedApiList
            this.dockingStatusList = dockingStatusList
            this.dockingItemsList = dockingItemsList
            this.formatData()
            this.loading = false
          }
        })
        .catch((error) => {
          throw new Error(`edit, ${error}`)
        })
    },
    formatData() {
      dockingEnum.forEach((item, index) => {
        this.dockingItemsList[index] = Object.assign((this.dockingItemsList[index] || {}), item)
      })
      StatusEnums.forEach((item, index) => {
        this.dockingStatusList[index] = Object.assign((this.dockingStatusList[index] || {}), item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-sub-detail {
  background-color: #eee;
  padding: 20px 50px;
  border-bottom: 1px solid #ccc;
  /deep/ .el-step__icon-bg {
    background: transparent;
  }

  .detail-tit {
    font-weight: 700;
  }

  .detail-steps {
    margin: 16px 0 20px;
  }

  .detail-tbl-tit {
    font-weight: 700;
    color: #666;
    margin: 12px 0 4px;

    span {
      margin-right: 40px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

}
</style>
