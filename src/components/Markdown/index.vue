<template>
  <div :id="`vditor${idKey}`" class="vditor"></div>
</template>

<script>
export default {
  name: "Markdown",
  props: {
    value: {
      type: String,
      default: "",
    },
    idKey: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      contentEditor: "",
    };
  },
  mounted() {
    console.log('mounted')
    let self = this;
    this.contentEditor = new Vditor(`vditor${this.idKey}`, {
      mode: "wysiwyg",
      height: 400,
      toolbarConfig: {
        pin: true,
      },
      //  使用cdn访问太慢，因此访问本地离线下载的vditor组件
      cdn: "/vditor",
      cache: {
        enable: false,
      },
      after: () => {
        console.log('setValue')
        this.contentEditor.setValue(this.value);
      },
      upload: {
        accept: "image/*,.mp3, .wav, .rar",
        url: "/doc/rest/imageUpload",
        fieldName: "image",
        format(files, responseText) {
          const response = JSON.parse(responseText);
          const code = response.code;
          const msg = response.message;
          const filename = files[0].name;
          if (code === 20000) {
            const filepath = response.data.url;
            let succMap = {};
            succMap[filename] = filepath;
            return JSON.stringify({
              msg,
              code,
              data: {
                errFiles: [],
                succMap,
              },
            });
          } else {
            self.$message.error("图片上传失败！");
          }
        },
      },
    });
  },
  methods: {
    getValue() {
      return this.contentEditor && this.contentEditor.getValue();
    },
    setValue(value) {
      return this.contentEditor && this.contentEditor.setValue(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.vditor /deep/ {
  ul {
    list-style: disc;
  }
  ol {
    list-style: decimal;
  }
  li {
    list-style: inherit;
  }
  a,
  a:focus,
  a:hover {
    color: #4285f4;
    text-decoration: underline;
  }
  // 表格内容换行展示
  .vditor-reset table td,
  .vditor-reset table th {
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  // 上传图片时不设置透明度
  .vditor-wysiwyg pre.vditor-reset[contenteditable="false"] {
    opacity: 1;
  }
  .vditor-ir pre.vditor-reset[contenteditable="false"] {
    opacity: 1;
  }
  .vditor-sv[contenteditable="false"] {
    opacity: 1;
  }
  .vditor-toolbar--pin {
    padding-left: 133px!important;
  }
  .vditor-wysiwyg pre.vditor-reset {
    padding: 10px 133px!important;
  }
}
</style>