<template>
  <div class="logoutConnection">
    <div class="app-container">
      <el-tabs>
        <el-tab-pane label="注销连接">
          <div class="el-icon-info">
            &nbsp;WebSocket
            server实例下线或重启，注销全部长连接，实例置为不可用。
          </div>
          <el-form
            :model="formLogout.data"
            :rules="formLogout.rules"
            :inline="true"
            ref="formLogout"
            class="formLogout"
          >
            <el-form-item label="别名" prop="alias">
              <el-input
                v-model="formLogout.data.alias"
                placeholder="请输入server别名"
                @keyup.native.enter="handleLogout"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogout">注 销</el-button>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>

          <div class="el-icon-info">
            &nbsp;WebSocket server实例异常，注销全部长连接。
          </div>
          <el-form
            :model="formLogoutUnusual.data"
            :rules="formLogoutUnusual.rules"
            :inline="true"
            ref="formLogoutUnusual"
            class="formLogoutUnusual"
          >
            <el-form-item label="别名" prop="alias">
              <el-input
                v-model="formLogoutUnusual.data.alias"
                placeholder="请输入server别名"
                @keyup.native.enter="handleLogoutUnusual"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogoutUnusual"
                >注 销</el-button
              >
            </el-form-item>
          </el-form>
          <el-divider></el-divider>

          <div class="el-icon-info">&nbsp;注销指定应用的连接。</div>
          <el-form
            :model="formLogoutByAppkey.data"
            :rules="formLogoutByAppkey.rules"
            :inline="true"
            ref="formLogoutByAppkey"
            class="formLogoutByAppkey"
          >
            <el-form-item label="应用KEY" prop="appKey">
              <el-input
                v-model="formLogoutByAppkey.data.appKey"
                placeholder="请输入应用KEY"
                @keyup.native.enter="handleLogoutByAppKey"
              ></el-input>
            </el-form-item>
            <el-form-item label="分组">
              <el-input
                v-model="formLogoutByAppkey.data.group"
                placeholder="请输入分组"
                @keyup.native.enter="handleLogoutByAppKey"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogoutByAppKey"
                >注 销</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.ts";

export default {
  name: "LogoutConnection",
  data() {
    return {
      formLogout: {
        data: {
          alias: "",
        },
        rules: {
          alias: [{ required: true, message: "server别名不能为空" }],
        },
      },
      formLogoutUnusual: {
        data: {
          alias: "",
        },
        rules: {
          alias: [{ required: true, message: "server别名不能为空" }],
        },
      },
      formLogoutByAppkey: {
        data: {
          appKey: "",
          group: "",
        },
        rules: {
          appKey: [{ required: true, message: "appKey不能为空" }],
        },
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

    // 根据服务别名注销全部长连接
    handleLogout() {
      const alias = this.formLogout.data.alias;
      const data = { alias };
      this.submitForm("formLogout", () => {
        api.webSocket
          .postLogoutData(data)
          .then((response) => {
            console.log("postLogoutData 正确响应", response);
            this.$message.success("操作成功");
          })
          .catch((error) => {
            console.log("postLogoutData 错误响应", error);
          });
      });
    },
    // 根据服务别名注销全部长连接（异常）
    handleLogoutUnusual() {
      const alias = this.formLogoutUnusual.data.alias;
      const data = { alias };
      this.submitForm("formLogoutUnusual", () => {
        api.webSocket
          .postLogoutUnusualData(data)
          .then((response) => {
            console.log("postLogoutUnusualData 正确响应", response);
            this.$message.success("操作成功");
          })
          .catch((error) => {
            console.log("postLogoutUnusualData 错误响应", error);
          });
      });
    },
    // 根据应用KEY与分组注销连接
    handleLogoutByAppKey() {
      const appKey = this.formLogoutByAppkey.data.appKey;
      const group = this.formLogoutByAppkey.data.group;
      const data = { appKey, group };
      this.submitForm("formLogoutByAppkey", () => {
        api.webSocket
          .postLogoutByAppData(data)
          .then((response) => {
            console.log("postLogoutByAppData 正确响应", response);
            this.$message.success("操作成功");
          })
          .catch((error) => {
            console.log("postLogoutByAppData 错误响应", error);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logoutConnection {
}
.el-icon-info {
  margin-bottom: 10px;
  color: #666;
  font-size: 12px;
}
</style>