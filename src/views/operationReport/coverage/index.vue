<template>
  <div class="app-container">
    <!--form表单-->
    <el-form :inline="true">
      <el-form-item label="服务名称">
        <el-input v-model="queryServerName" placeholder="请输入服务名称"></el-input>
      </el-form-item>
      <el-form-item label="服务类别">
        <el-select v-model="queryServerType" placeholder="请选择" clearable >
          <el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryServerStatus" placeholder="请选择" clearable >
          <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="handleSelButton">查 询</el-button>
      <el-button type="primary" @click="handleCreateButton" style="float:right">创 建</el-button>
    </el-form>
    <!--table-->
    <el-table v-loading="table.loading" :data="table.data">
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
       <el-table-column label="服务名称" prop="name" align="center" >
      </el-table-column>
       <el-table-column label="产品线" prop="productLine" align="center" >
           <template slot-scope="scope">
            {{ formatProductLine(scope.row.productLine) }}
        </template>
      </el-table-column>
       <el-table-column label="服务类别" prop="category" align="center" >
        <template slot-scope="scope">
            {{ formatCategory(scope.row.category) }}
        </template>
      </el-table-column>
       <el-table-column label="状态" prop="status" align="center" >
        <template slot-scope="scope">
            {{ formatStatus(scope.row.status) }}
        </template>
      </el-table-column>
       <el-table-column label="更新人" prop="updateUser" align="center" >
      </el-table-column>
       <el-table-column label="更新时间" prop="updateTime" align="center" >
         <template slot-scope="scope">
            {{ formatTime(scope.row.updateTime) }}
         </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEditButton(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="handleDelButton(scope.row.id)" style="color:#b5b5b5">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination v-show="pagination.total" :current-page.sync="pagination.page" :page-size.sync="pagination.pageSize" :total="pagination.total" layout="prev, pager, next, jumper" background @current-change="requestTableData" @size-change="requestTableData" style="text-align:center;margin:15px;"></el-pagination>

    <!--创建,编辑弹出框-->
    <el-dialog :title="showTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <el-form :model="ruleForm" ref="validateForm" :rules="rules" :inline="true" label-width="80px" class="demo-dynamic">
        <el-form-item label="服务名称" prop="serverName">
          <el-input v-model="ruleForm.serverName" placeholder="请输入服务名称" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="产品线" prop="productLine">
          <el-select v-model="ruleForm.productLine" placeholder="请选择" style="width:250px">
            <el-option v-for="item in productlineoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务类别" prop="serverType">
          <el-select v-model="ruleForm.serverType" placeholder="请选择" style="width:250px">
            <el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择" style="width:250px">
            <el-option v-for="item in statusoptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleForm('validateForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('validateForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import gwSmartLog from "@/api/gwSmartLog/index";
import parseTime from "@/utils/parseTime"

export default {
  name: "CoverageComent",
  data() {
    return {
      queryServerName: "", //查询服务名称
      queryServerType: null, //查询服务类别
      queryServerStatus: null, //查询服务状态
      table: {
        loading: true,
        data: []
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      showTitle: "", //标题显示
      dialogVisible: false, //弹出框
      ruleForm: {
        serverName: "", //服务名称
        serverType: '', //服务分类
        status:'',//服务状态
        productLine: '',//产品线
        id:'',//id
      },
      rules: {
        serverName: [{ required: true, message: "请输入服务名称" }],
        serverType: [{ required: true, message: "请选择服务类别" }],
        productLine: [{ required: true, message: "请选择产品线" }],
        status: [{ required: true, message: "请选择状态" }],
      },
      typeoptions: [
        {
          label: "物流产品",
          value: 1,
        },
        {
          label: "行业解决方案",
          value: 2,
        },
      ],
      statusoptions: [
        {
          label: "未覆盖",
          value: 0,
        },
        {
          label: "已覆盖",
          value: 1,
        },
        {
          label: "H5开放",
          value: 2,
        },
        {
          label: "商家工作台开放",
          value: 3,
        },
        {
          label: "停售产品",
          value: 4,
        },
        {
          label: "未开放产品",
          value: 5,
        }
      ],
      productlineoptions:[
        {
          label: "供应链",
          value: 1,
        },
        {
          label: "到仓服务",
          value: 2,
        },
        {
          label: "大件",
          value: 3,
        },
        {
          label: "冷链",
          value: 4,
        },
        {
          label: "医药",
          value: 5,
        },
        {
          label: "快递",
          value: 6,
        },
        {
          label: "快运",
          value: 7,
        },
        {
          label: "京喜达",
          value: 8,
        },
        {
          label: "国际",
          value: 9,
        },
        {
          label: "云仓",
          value: 10,
        },
        {
          label: "京慧",
          value: 11,
        },
        {
          label: "服务+",
          value: 12,
        },
        {
          label: "市场部",
          value: 13,
        },
        {
          label: "大宗",
          value: 14,
        },
        {
          label: "清铢",
          value: 15,
        },
        {
          label: "运力",
          value: 16,
        }
      ],
      editer:false
    };
  },
  methods: {
    formatCategory(category){
      for(let index=0;index<this.typeoptions.length;index++){
        let item=this.typeoptions[index]
        if(item.value==category){
          return item.label
        }
      }
    },
    formatStatus(status){
      for(let index=0;index<this.statusoptions.length;index++){
        let item=this.statusoptions[index]
        if(item.value==status){
          return item.label
        }
      }
      return '-'
    },
    /**
     * 格式化产品线
     */
    formatProductLine(productLine){
       for(let index=0;index<this.productlineoptions.length;index++){
        let item=this.productlineoptions[index]
        if(item.value==productLine){
          return item.label
        }
      }
      return '-'
    },
    formatTime(time) {
         return parseTime.timeInTable(time) || "-";
    },
    requestTableData() {
      this.table.loading = false;
      const page = this.pagination.page;
      const pageSize = this.pagination.pageSize;
      const name = this.queryServerName;
      const category = this.queryServerType;
      const status = this.queryServerStatus;
      const params = [
        { page, pageSize },
        { name, category, status },
      ];
      (async () => {
        const response = await gwSmartLog.service
          .query(params)
          .catch((error) => {
            throw error;
          });
        const {data}=response
        this.table.data=data.rows
        this.pagination.total=data.total
      })();
    },
    /**
     * 编辑
     */
    handleEditButton(id) {
      this.showTitle = "编辑服务";
      this.dialogVisible = true;
      const params=[id];
      (async () => {
        const response = await gwSmartLog.service
          .get(params)
          .catch((error) => {
            throw error;
          });
          const {data}=response
          this.ruleForm.serverName=data.name
          this.ruleForm.serverType=data.category
          this.ruleForm.status=data.status
          if(data.productLine==0){
            this.ruleForm.productLine=""
          }else{
            this.ruleForm.productLine=data.productLine
          }
          this.ruleForm.id=id
          this.editer=true
      })();
    },
    /**
     * 删除
     */
    handleDelButton(id) {
    this.$confirm('确定删除当前内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          const params=[id];
            (async () => {
              const response = await gwSmartLog.service
                .delete(params)
                .catch((error) => {
                  throw error;
                });
                this.requestTableData()
            })();
        }).catch((e) => {
          console.log('错误', e)
        })

      
    },
    /**
     * 创建
     */
    handleCreateButton() {
      this.showTitle = "创建服务";
      this.dialogVisible = true;
      this.ruleForm.serverName=""//服务名称
      this.ruleForm.serverType=""//服务分类
      this.ruleForm.status=""//服务状态
      this.ruleForm.id=""//id
      this.ruleForm.productLine="" //产品线
      this.editer=false
    },
    /**
     * 查询
     */
    handleSelButton() {
      this.requestTableData()
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.editer){
            this.updateServer(formName) //更新
          }else if(!this.editer){
            this.createServer(formName)//插入
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createServer(formName){
      const params=[{
             name:this.ruleForm.serverName,
             productLine:this.ruleForm.productLine,
             category:this.ruleForm.serverType,
             status:this.ruleForm.status
          }];
          (async () => {
            const response = await gwSmartLog.service
              .create(params)
              .catch((error) => {
                throw error;
              });
              this.closeAndResetForm(formName)
              this.requestTableData()
          })();
    },
    updateServer(formName){
         const params=[{
             id:this.ruleForm.id,
             name:this.ruleForm.serverName,
             category:this.ruleForm.serverType,
             productLine:this.ruleForm.productLine,
             status:this.ruleForm.status
          }];
          (async () => {
            const response = await gwSmartLog.service
              .update(params)
              .catch((error) => {
                throw error;
              });
              this.closeAndResetForm(formName)
              this.requestTableData()
          })();
    },
    /**
     * 关闭弹出框
     */
    handleClose() {
      this.closeAndResetForm("validateForm");
    },
    /**
     * 取消按钮
     */
    cancleForm(formName) {
      this.closeAndResetForm(formName);
    },
    /**
     * 关闭并重置
     */
    closeAndResetForm(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
  },
  mounted() {
    this.requestTableData();
  },
};
</script>

<style lang="scss" scoped>
</style>