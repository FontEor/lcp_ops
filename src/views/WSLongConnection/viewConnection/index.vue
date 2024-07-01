<template>
  <div class="viewConnection">
    <div class="app-container">
      <el-tabs>
        <el-tab-pane label="查看连接">
          <el-form
            :model="formSearchByApp.data"
            :rules="formSearchByApp.rules"
            :inline="true"
            ref="formSearchByApp"
            class="formSearchByApp"
          >
            <el-form-item label="应用KEY" prop="appKey">
              <el-input
                v-model="formSearchByApp.data.appKey"
                placeholder="请输入应用KEY"
                @keyup.native.enter="handleSearchByApp"
              ></el-input>
            </el-form-item>
            <el-form-item label="分组">
              <el-input
                v-model="formSearchByApp.data.group"
                placeholder="请输入分组"
                @keyup.native.enter="handleSearchByApp"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearchByApp"
                >查 询</el-button
              >
            </el-form-item>
          </el-form>

          <el-table :data="table.data">
            <el-table-column
              label="序号"
              type="index"
              align="center"
            ></el-table-column>
            <el-table-column
              v-for="(column, index) in table.columnList"
              :key="index"
              :label="column.label"
              :prop="column.prop"
              :show-overflow-tooltip="column['show-overflow-tooltip']"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-button
                  v-if="column.prop === 'handle'"
                  type="text"
                  @click="handleLogoutById(row)"
                  >注销</el-button
                >
                <span v-else>{{ formatTableText(row, column.prop) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.ts";

export default {
  name: "ViewConnection",
  data() {
    return {
      formSearchByApp: {
        data: {
          appKey: "",
          group: "",
        },
        rules: {
          appKey: [{ required: true, message: "appKey不能为空" }],
        },
      },
      table: {
        data: [],
        columnList: [
          { label: "应用", prop: "appKey" },
          { label: "分组", prop: "group" },
          { label: "WebSocket server别名", prop: "alias" },
          { label: "客户端ip", prop: "clientIp" },
          { label: "连接ID", prop: "sessionId", "show-overflow-tooltip": true },
          { label: "是否存活", prop: "active" },
          { label: "注册时间", prop: "registerTime" },
          { label: "操作", prop: "handle" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName, callback) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          callback();
        } else {
          return false;
        }
      });
    },
    formatTableText(row, prop) {
      if (prop === "active") {
        return row[prop] ? "是" : "否";
      } else {
        return row[prop];
      }
    },

    // 根据应用KEY与分组查询所有长连接
    handleSearchByApp() {
      const appKey = this.formSearchByApp.data.appKey;
      const group = this.formSearchByApp.data.group;
      const params = { appKey, group };
      this.submitForm("formSearchByApp", () => {
        api.webSocket
          .getSearchByAppData(params)
          .then((response) => {
            console.log("getSearchByAppData 正确响应", response);
            this.table.data = response.body;
          })
          .catch((error) => {
            console.log("getSearchByAppData 错误响应", error);
            this.table.data = []
          });
      });
    },
    // 根据应用KEY、分组、别名、长连接ID注销指定连接
    handleLogoutById(row) {
      const appKey = row.appKey;
      const group = row.group;
      const alias = row.alias;
      const sessionId = row.sessionId;
      const data = { appKey, group, alias, sessionId };
      api.webSocket
        .postLogoutByIdData(data)
        .then((response) => {
          console.log("postLogoutByIdData 正确响应", response);
          this.$message.success("操作成功");
          this.handleSearchByApp();
        })
        .catch((error) => {
          console.log("postLogoutByIdData 错误响应", error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>