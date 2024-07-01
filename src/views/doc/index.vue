<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClickNetWork">
      <el-tab-pane label="外网" name="first">
        <el-tabs v-model="first_active_name" @tab-click="handleClick">
          <el-tab-pane label="新手指南" name="first_extranet">
            <GroupContent v-if="firstExtranetShowContent" :group-type="1" :items="items" :page="page" :page-size="pageSize" :total="total" @returnClick="returnClick" />
            <ExtranetContent v-if="!firstExtranetShowContent" :items="items" :type="1" :page="page" :net-type="1" :doc-group="docGroup" :page-size="pageSize" :total="total" @returnBack="returnBack" />
          </el-tab-pane>
          <el-tab-pane label="技术文档" name="second_extranet">
            <GroupContent v-if="secondExtranetShowContent" :group-type="2" :items="items" :page="page" :page-size="pageSize"
                          :total="total" @returnClick="returnClick"
            />
            <ExtranetContent v-if="!secondExtranetShowContent" :items="items" :type="2" :page="page" :net-type="1" :doc-group="docGroup" :page-size="pageSize" :total="total" @returnBack="returnBack" />
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="内网" name="second" @tab-click="handleClickNetWork">
        <el-tabs v-model="second_active_name" @tab-click="handleClick">
          <el-tab-pane label="新手指南" name="five_intranet">
            <IntranetContent :items="items" :type="5" :page="page" :net-type="2" :page-size="pageSize" :total="total" />
          </el-tab-pane>
          <el-tab-pane label="开发支持" name="six_intranet">
            <IntranetContent :items="items" :type="6" :page="page" :net-type="2" :page-size="pageSize" :total="total" />
          </el-tab-pane>
          <el-tab-pane label="api文档" name="seven_intranet">
            <IntranetContent :items="items" :type="7" :page="page" :net-type="2" :page-size="pageSize" :total="total" />
          </el-tab-pane>
          <el-tab-pane label="开发指南" name="nine_intranet">
            <IntranetContent :items="items" :type="9" :page="page" :net-type="2" :page-size="pageSize" :total="total" />
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import IntranetContent from './intranetcontent'
import ExtranetContent from './extranetcontent'
import GroupContent from './groupcontent'
import request from '../../utils/request'
export default {
  name: 'Doc',
  components: {
    IntranetContent,
    GroupContent,
    ExtranetContent
  },
  data() {
    return {
      activeName: 'first',
      first_active_name: 'first_extranet',
      second_active_name: 'five_intranet',
      flag: false,
      items: [],
      firstExtranetShowContent: true,
      secondExtranetShowContent: true,
      type: 1, // 1：新手指南(外) 2：开发支持(外) 3:业务单元文档(外) 4:产品(外) 5：新手指南(内) 6：开发支持(内) 7:API文档(内) 8:产品(内) 9:开发指南(内)
      pageSize: 10,
      page: 1,
      total: 100,
      docIntranetType: {
        five_intranet: 5, // 5：新手指南(内)
        six_intranet: 6, // 6：开发支持(内
        seven_intranet: 7, // 7:API文档(内)
        nine_intranet: 9// 9:开发指南(内)
      },
      docExtranetType: {
        first_extranet: 1, // 新手指南分组
        second_extranet: 2// 技术文档分组
      },
      docGroup: {}
    }
  },
  mounted() {
    this.queryGroupList(1, '')
  },
  methods: {
    handleClickNetWork(tab, event) {
      this.page = 1
      if (tab.name == 'first') { // 外网
        this.first_active_name = 'first_extranet'
        this.firstExtranetShowContent = true
        this.queryGroupList(1, '')
      } else if (tab.name == 'second') { // 内网
        this.second_active_name = 'five_intranet'
        this.queryList(5, 2)
      }
    },
    handleClick(tab, event) {
      this.page = 1
      if (this.docIntranetType[tab.name]) { // 内网
        this.queryList(this.docIntranetType[tab.name], 2)
      } else if (this.docExtranetType[tab.name]) { // 外网
        this.queryGroupList(this.docExtranetType[tab.name], '')
        if (this.docExtranetType[tab.name] == 1) {
          this.firstExtranetShowContent = true
        } else if (this.docExtranetType[tab.name] == 2) {
          this.secondExtranetShowContent = true
        }
      }
    },
    /**
     * queryType: 查询文档类型  1：新手指南(外) 2：开发支持(外) 3:业务单元文档(外) 4:产品(外) 5：新手指南(内) 6：开发支持(内) 7:API文档(内) 8:产品(内) 9:开发指南(内)
     * queryNetType: 查询内外网类型  1：外网 2：内网
     */
    queryList(queryType, queryNetType) {
      const url = '/doc/rest/queryDocList'
      this.items = []
      console.log(this.docGroup)
      request({
        url,
        method: 'get',
        params: {
          type: queryType,
          netType: queryNetType,
          rows: this.pageSize,
          page: this.page,
          docGroupCode: queryNetType == 1 ? this.docGroup.code : null
        }
      }).then((res) => {
        this.items = res.data.rows
        this.total = res.data.total
        this.pageSize = res.data.pageSize
        this.page = res.data.page
      })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    /**
     * 查询分组list
     */
    queryGroupList(groupType, groupName) {
      const url = '/docgroup/rest/queryDocGroupList'
      this.items = []
      request({
        url,
        method: 'get',
        params: {
          groupName: groupName,
          groupType: groupType,
          rows: this.pageSize,
          page: this.page
        }
      }).then((res) => {
        this.items = res.data.rows
        this.total = res.data.total
        this.pageSize = res.data.pageSize
        this.page = res.data.page
      })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    returnClick(params) {
      this.docGroup = params
      if (this.docGroup.groupType == 1) {
        this.queryList(1, 1)
        this.firstExtranetShowContent = false
      } else if (this.docGroup.groupType == 2) {
        this.queryList(2, 1)
        this.secondExtranetShowContent = false
      }
    },
    returnBack(params) {
      if (this.docGroup.groupType == 1) {
        this.firstExtranetShowContent = true
      } else if (this.docGroup.groupType == 2) {
        this.secondExtranetShowContent = true
      }
      this.items = []
      this.page = 1
      this.queryGroupList(params.groupType, '')
    }
  }
}
</script>
