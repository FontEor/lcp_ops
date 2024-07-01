
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="API相关问题" name="first">
        <Content
          v-if="activeName === 'first'"
          :items="items"
          :type="6"
          :page="page"
          :pageSize="pageSize"
          :total="total"
        ></Content>
      </el-tab-pane>
      <el-tab-pane label="授权相关问题" name="second">
        <Content
          v-if="activeName === 'second'"
          :items="items"
          :type="7"
          :page="page"
          :pageSize="pageSize"
          :total="total"
        ></Content>
      </el-tab-pane>
      <el-tab-pane label="订购相关问题" name="third">
        <Content
          v-if="activeName === 'third'"
          :items="items"
          :type="8"
          :page="page"
          :pageSize="pageSize"
          :total="total"
        ></Content>
      </el-tab-pane>
      <el-tab-pane label="入驻相关问题" name="fourth">
        <Content
          v-if="activeName === 'fourth'"
          :items="items"
          :type="9"
          :page="page"
          :pageSize="pageSize"
          :total="total"
        ></Content>
      </el-tab-pane>
      <el-tab-pane label="其他问题" name="fifth">
        <Content
          v-if="activeName === 'fifth'"
          :items="items"
          :type="10"
          :page="page"
          :pageSize="pageSize"
          :total="total"
        ></Content>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Content from "./content";
import request from "../../utils/request";

export default {
  name: "Question",
  components: {
    Content,
  },
  data() {
    return {
      activeName: "first",
      flag: false,
      items: [],
      netType: 2,
      type: 1,
      pageSize: 10,
      page: 1,
      total: 100,
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.name == "first") {
        this.first();
      } else if (tab.name == "second") {
        this.second();
      } else if (tab.name == "third") {
        this.third();
      } else if (tab.name == "fourth") {
        this.fourth();
      } else if (tab.name == "fifth") {
        this.fifth();
      }
    },
    first() {
      const url = "/question/rest/queryQuestionList";
      request({
        url,
        method: "get",
        params: { type: 6, netType: 2, rows: this.pageSize, page: this.page },
      })
        .then((res) => {
          this.items = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    second() {
      const url = "/question/rest/queryQuestionList";
      request({
        url,
        method: "get",
        params: { type: 7, netType: 2, rows: this.pageSize, page: this.page },
      })
        .then((res) => {
          this.items = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    third() {
      const url = "/question/rest/queryQuestionList";
      request({
        url,
        method: "get",
        params: { type: 8, netType: 2, rows: this.pageSize, page: this.page },
      })
        .then((res) => {
          this.items = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    fourth() {
      const url = "/question/rest/queryQuestionList";
      request({
        url,
        method: "get",
        params: { type: 9, netType: 2, rows: this.pageSize, page: this.page },
      })
        .then((res) => {
          this.items = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    fifth() {
      const url = "/question/rest/queryQuestionList";
      request({
        url,
        method: "get",
        params: { type: 10, netType: 2, rows: this.pageSize, page: this.page },
      })
        .then((res) => {
          this.items = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
  },
  mounted() {
    const url = "/question/rest/queryQuestionList";
    request({
      url,
      method: "get",
      params: { type: 6, netType: 2, rows: this.pageSize, page: this.page },
    })
      .then((res) => {
        this.items = res.data.rows;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.page = res.data.page;
      })
      .catch((e) => {
        console.log("错误", e);
      });
  },
};
</script>
