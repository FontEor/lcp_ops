<template>
  <div>
    <!--form表单-->
    <el-form :inline="true">
      <el-form-item label="对接方案">
        <el-input v-model="queryDokingSchemeName" placeholder="输入对接方案名称、对接方案编码"></el-input>
      </el-form-item>
      <el-form-item label="对接方案分类">
        <el-cascader v-model="queryDokingSchemeType" :options="solutionoptions" placeholder="请选择" :props="props" clearable></el-cascader>
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
      <el-table-column label="对接方案名称" prop="name" align="center" min-width="20%" :show-tooltip-when-overflow="true">
      </el-table-column>
      <el-table-column label="对接方案编码" prop="code" align="center" min-width="10%" :show-tooltip-when-overflow="true">
      </el-table-column>
      <el-table-column label="所属分类" prop="businessTypeName" min-width="10%" align="center">
      </el-table-column>
      <el-table-column label="标签" prop="tagName" min-width="12%" align="center">
      </el-table-column>
      <el-table-column label="更新人" prop="updateUser" align="center" min-width="10%" />
      <el-table-column label="更新时间" prop="updateTime" align="center" min-width="12%">
      </el-table-column>
      <el-table-column label="发布时间" prop="publishTime" align="center" min-width="12%">
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
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
          <el-select v-model="tagCode" placeholder="请选择" style="width: 100%" clearable>
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
  name: "DokingSchemeManager",
  data() {
    return {
      props: { multiple: true },
      queryDokingSchemeName: "", //查询对接方案
      queryDokingSchemeType: "", //查询方案类型
      queryTag: "", //查询标签
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
          label: "测试",
          value: "010000",
        },
        {
          label: "非测试",
          value: "020000",
        },
      ],
      dialogVisible: false,
      tagCode:'',
      currentData:''
    };
  },
  methods: {
    /**
     * 获取方案类型
     **/
    fetchSolutionType() {
      request({
        url: "/platform/rest/bizUnit/getBusinessType",
        method: "get",
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            let solutionData = [
              { value: 1, label: "行业对接方案" },
              { value: 2, label: "业务产品对接方案" },
              { value: 3, label: "场景对接方案" },
            ];
            let _this = this;
            solutionData.forEach(function (item) {
              let dataInfo = { value: item.value, label: item.label };
              if (rsp.data[item.value]) {
                let children = [];
                rsp.data[item.value].forEach(function (itemObj) {
                  let obj = { value: itemObj.code, label: itemObj.name };
                  children.push(obj);
                });
                dataInfo.children = children;
              }
              _this.solutionoptions.push(dataInfo);
            });
          }
        })
        .catch((e) => {
          callback();
        });
    },
    /**
     * 查询对接方案列表
     */
    requestTableData() {
      console.log(this.queryDokingSchemeType);
      let queryType = [];
      if (this.queryDokingSchemeType != "") {
        this.queryDokingSchemeType.forEach(function (item) {
          queryType.push(item[1]);
        });
      }
      request({
        url: "/platform/rest/bizUnit/queryBizUnitList",
        method: "get",
        params: {
          queryLike: this.queryDokingSchemeName,
          businessTypeCode: this.queryDokingSchemeType != "" ? queryType.toString() : "",
          tagCode: this.queryTag,
          tagType: this.queryTag != "" ? "2" : "",
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
      url: "/platform/rest/bizUnit/saveBizUnitTag",
      method: "get",
      params: {
        tagType:this.tagCode==null||this.tagCode==''?"":2,
        tagCode:this.tagCode==null?'':this.tagCode,
        updateUser: UserModule.username,
        id:this.currentData.id
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