<template>
  <div class="app-container">
    <!--form表单-->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker v-model="queryWeekTime" type="week" format="yyyy 第 WW 周" placeholder="选择周"
        :picker-options="{'firstDayOfWeek': 5}"
        >
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="handleSelButton">查 询</el-button>
      <el-button type="primary" @click="handleCreateButton" style="float:right">创 建</el-button>
    </el-form>
    <!--table-->
    <el-table v-loading="table.loading" :data="table.data">
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column label="时间" prop="scoreTime" align="center">
         <template slot-scope="scope">
            {{ formatScoreTime(scope.row.scoreTime) }}
         </template>
      </el-table-column>
      <el-table-column label="NPS评分" prop="score" align="center">
      </el-table-column>
      <el-table-column label="更新人" prop="updateUser" align="center">
      </el-table-column>
      <el-table-column label="更新时间" prop="udpateTime" align="center">
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
      <el-form :model="ruleForm" ref="validateForm" :rules="rules">
        <el-form-item label="时间" prop="weekTime">
          <el-date-picker v-model="ruleForm.weekTime" type="week" format="yyyy 第 WW 周" placeholder="选择周"
          :picker-options="{'firstDayOfWeek': 5}"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="NPS评分" prop="score">
          <el-input-number v-model="ruleForm.score" :precision="2" :step="0.1" :max="10"></el-input-number>
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
import parseTime from "@/utils/parseTime";
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

export default {
  name: "NpsComent",
  data() {
    return {
      queryWeekTime: null, //查询时间
      table: {
        loading: true,
        data: [],
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      showTitle: "", //标题显示
      dialogVisible: false, //弹出框
      ruleForm: {
        weekTime: "", //时间
        score: 0.0, //nps评分
        id:'' //id
      },
      rules: {
        weekTime: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        score: [{ required: true, message: "请输入nps评分" }],
      },
      editer:false
    };
  },
  methods: {
    formatTime(time) {
         return parseTime.timeInTable(time) || "-";
    },
    formatScoreTime(time){
      let dateNew=new Date(time)
      dayjs.extend(weekOfYear)
      const week = dayjs(dateNew).week()-1
      const year = dateNew.getFullYear()
      return year + '年第 ' + week + ' 周'
    },
    requestTableData() {
      const page = this.pagination.page;
      const pageSize = this.pagination.pageSize;
      const scoreTime =this.queryWeekTime == null ? null : Date.parse(this.queryWeekTime);
      const params = [{ page, pageSize }, { scoreTime }];
      (async () => {
        const response = await gwSmartLog.nps.query(params).catch((error) => {
          throw error;
        });
        const { data } = response;
        this.table.loading = false;
        this.table.data = data.rows;
        this.pagination.total = data.total;
      })();
    },
    /**
     * 编辑
     */
    handleEditButton(id) {
      this.showTitle = "编辑NPS评分";
      this.dialogVisible = true;
      const params=[id];
      (async () => {
        const response = await gwSmartLog.nps
          .get(params)
          .catch((error) => {
            throw error;
          });
          const {data}=response
          this.ruleForm.score=data.score
          this.ruleForm.weekTime=data.scoreTime
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
              const response = await gwSmartLog.nps
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
      this.showTitle = "创建NPS评分"
      this.dialogVisible = true
      this.editer=false
      this.ruleForm.weekTime=''
      this.ruleForm.score=0.0
      this.id=''
    },
    /**
     * 查询
     */
    handleSelButton() {
      console.log(new Date(this.queryWeekTime).getTime())
      this.requestTableData();
    },
    /**
     * 提交表单
     */
    submitForm(formName) {
     this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.editer){
            this.updateNps(formName) //更新
          }else if(!this.editer){
            this.createNps(formName)//插入
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 创建nps
     */
    createNps(formName){
       const params=[{
             score:this.ruleForm.score,
             scoreTime:this.ruleForm.weekTime.getTime()
          }];
          (async () => {
            const response = await gwSmartLog.nps
              .create(params)
              .catch((error) => {
                throw error;
              });
              this.closeAndResetForm(formName)
              this.requestTableData()
          })();
    },
    /**
     * 更新nps
     */
    updateNps(formName){
        const params=[{
             id:this.ruleForm.id,
             score:this.ruleForm.score,
             scoreTime:typeof this.ruleForm.weekTime=== 'number'?this.ruleForm.weekTime:this.ruleForm.weekTime.getTime()
          }];
          (async () => {
            const response = await gwSmartLog.nps
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