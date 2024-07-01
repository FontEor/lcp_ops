<template>
  <div>
    <!--form表单-->
    <el-form :inline="true">
      <el-form-item label="API名称">
        <el-input v-model="queryApiName" placeholder="输入API中文名称"></el-input>
      </el-form-item>
      <el-form-item label="所属对接方案">
        <el-select v-model="querySolution" placeholder="请选择">
          <el-option v-for="item in solutionData" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="queryTag" placeholder="请选择" clearable >
          <el-option v-for="item in tagoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="handleSelButton">查 询</el-button>
    </el-form>
    <!--table-->
    <el-table v-loading="table.loading" :data="table.data">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="API名称" prop="apiName" align="center">
      </el-table-column>
      <el-table-column label="所属对接方案" prop="unitName" >
      </el-table-column>
      <el-table-column label="标签" prop="tagName" align="center">
      </el-table-column>
      <el-table-column label="更新人" prop="updateUser" align="center" >
         <template slot-scope="scope">
            <span v-if="scope.row.updateUser">{{scope.row.updateUser}}</span>
            <span v-else>-</span>
          </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center" >
        <template slot-scope="scope">
            <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
            <span v-else>-</span>
          </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="createTime" align="center" >
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
            <span v-else>-</span>
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope" style="white-space: nowrap">
         <el-button type="text" @click="handleTagButton(scope.row)">打标</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination v-show="pagination.total" :current-page.sync="pagination.page" :page-size.sync="pagination.pageSize" :total="pagination.total" layout="prev, pager, next, jumper" background @current-change="requestTableData" @size-change="requestTableData" style="text-align:center;margin:15px;"></el-pagination>

    <!--dialog-->
    <el-dialog title="对接方案打标" :visible.sync="dialogVisible" :close-on-click-modal="false" width="400px">
      <el-form>
        <el-form-item label="标签" label-width="60px">
          <el-select v-model="tagCode" placeholder="请选择" style="width: 100%" clearable >
            <el-option v-for="item in tagoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import { UserModule } from '@/store/modules/user';

export default {
  name: "DokingSchemeApi",
  data() {
    return {
      props: { multiple: true },
      queryApiName: "", //查询api名称
      queryTag: "", //查询标签
      querySolution:"",//所属对接方案
      table: {
        loading: false,
        data: [],
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      solutionoptions: [],
      tagoptions: [
        {
          label: "纯配下单",
          value: "010000",
        },
        {
          label: "仓配下单",
          value: "020000",
        }, 
        {
          label: "C2C下单",
          value: "030000",
        },
      ],
      dialogVisible: false,
      tagCode:'',
      currentData:'',
      solutionData:[]//解决方案数据
    };
  },
  methods: {
    /**
     * 获取方案类型
     **/
    fetchSolutionType() {
      let _this=this
      request({
        url: "/platform/rest/bizApi/queryBizUnitList",
        method: "get",
      }).then((rsp) => {
          if (rsp.code === 20000) {
            if(rsp.data&&rsp.data.length>0){
              for(let i=0;i<rsp.data.length;i++){
                  let item=rsp.data[i]
                  _this.solutionData.push({value:item.id,label:item.name})
              }
            }
          }
        }).catch((e) => {
          callback();
        });
    },
    /**
     * 查询对接方案列表
     */
    requestTableData() {
      request({
        url: "/platform/rest/bizApi/queryBizApiList",
        method: "get",
        params: {
          apiName: this.queryApiName,
          tagCode: this.queryTag,
          unitId:this.querySolution,
          tagType: this.queryTag != "" ? "1" : "",
          pageNumb: this.pagination.page,
          pageSize: this.pagination.pageSize,
        },
      }).then((rsp) => {
          if (rsp.code === 20000) {
            this.table.data = rsp.data.list;
            this.pagination.total = rsp.data.total;
          }
        })
        .catch((e) => {
          callback();
        });
    },
    /**
     * 查询
     */
    handleSelButton() {
      this.requestTableData();
    },
    /**
     * 打标
     */
    handleTagButton(row) {
      this.dialogVisible = true
      this.currentData=row
      this.tagCode=row.tagCode
    },
    /**
     * 保存
     */
    onSubmit() {
      this.dialogVisible=false
      request({
        url: "/platform/rest/bizApi/saveBizApiTag",
        method: "get",
        params: {
          tagCode: this.tagCode==null?'':this.tagCode,
          tagType: this.tagCode==null||this.tagCode==''?'':1,
          id: this.currentData.id,
          updateUser: UserModule.username
        },
      }).then((rsp) => {
          if (rsp.code === 20000) {
              this.requestTableData();
          }else{
              this.$message.error('保存错误')
          }
        })
      .catch((e) => {
        callback();
      });
      
    },
  },
  created() {
    this.fetchSolutionType();
    this.requestTableData();
  },
};
</script>