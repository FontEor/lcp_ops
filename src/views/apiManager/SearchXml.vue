<template>
  <div class="search-xml">
    <header class="header">
      <el-form :model="formInline.data" :inline="true">
        <el-form-item label="API名称">
          <el-input
            v-model.trim="formInline.inputValue"
            placeholder="请输入API名称"
            @keyup.enter.native="requestTableData"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="requestTableData"
            >查 询</el-button
          >
        </el-form-item>
      </el-form>
    </header>
    <main class="main">
      <codemirror
        ref="cmEditor"
        class="codemirror"
        :value.sync="codeData"
        :options="cmOptions"
        @ready="onCmReady"
        @focus="onCmFocus"
        @input="onCmCodeChange"
      />
    </main>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
// language
import "codemirror/mode/xml/xml.js";
// import "codemirror/mode/java/java.js";
import "codemirror/mode/shell/shell.js";
// theme css
import "codemirror/theme/ttcn.css";
// require active-line.js
import "codemirror/addon/selection/active-line.js";
// closebrackets
import "codemirror/addon/edit/closebrackets.js";
// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";
import api from "@/api/index";

export default {
  name: "SearchXml",
  components: { codemirror },
  data() {
    return {
      formInline: {
        data: {},
        inputValue: "",
      },
      codeData: `<?xml version="1.0" encoding="UTF-8"?>
<lcp:api xmlns:lcp="http:///com/jd/lcp/wuliuyun/api/doc.ecore/1.0.0" name="" comment="">
  <method name="" comment="">
    <params>
      <element elemType="single" type="" name="" comment=""/>
      <element elemType="object" type="" name="" comment=""/>
    </params>
    <result>
      <element elemType="single" type="" name="" comment=""/>
      <element elemType="object" type="" name="" comment=""/>
    </result>
  </method>
</lcp:api>`,
      cmOptions: {
        autoCloseBrackets: true,
        tabSize: 2,
        styleActiveLine: true,
        mode: "xml",
        lineNumbers: true,
        line: true,
        theme: "ttcn",
        lineWrapping: true,
        foldGutter: true,
        readOnly: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      },
    };
  },
  methods: {
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
    },
    onCmFocus(cm) {
      console.log("the editor is focused!", cm);
    },
    onCmCodeChange(newCode) {
      console.log("this is new code", newCode, this.codeData);
    },
    async requestTableData() {
      const qualifiedName = this.formInline.inputValue;
      const params = { qualifiedName };
      const response = await api.apiManager
        .getApiXmlContentData(params)
        .catch((error) => {
          throw error;
        });
      this.codeData = response.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-xml {
  .el-form {
    display: flex;
    justify-content: flex-start;
  }
  ::v-deep .CodeMirror {
    border: 1px solid #eee;
    height: 50vh;
  }
}
</style>