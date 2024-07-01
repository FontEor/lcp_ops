<template>
  <!--选择创建客群方式-->
  <el-dialog
    title="选择创建方式"
    :visible.sync="dialogTableVisible"
    width="440px"
    custom-class="customers-way-dialog"
  >
    <ul>
      <li>
        <div class="link cf" @click="link('labelSelect')">
          <img src="@/assets/views/ico-cus1.png">
          <div>
            <h3>标签筛选</h3>
            <p>通过标签组合筛选客群</p>
          </div>
          <i class="el-icon-arrow-right arrow-ico" />
        </div>
      </li>
      <li>
        <div class="link cf" @click="link('fileImport')">
          <img src="@/assets/views/ico-cus2.png">
          <div>
            <h3>文件导入</h3>
            <p>支持本地上传pin包、手机号</p>
          </div>
          <i class="el-icon-arrow-right arrow-ico" />
        </div>
      </li>
      <li>
        <div class="link cf" @click="link('labelSelect')">
          <img src="@/assets/views/ico-cus3.png">
          <div>
            <h3>系统对接</h3>
            <p>支持其他系统下传客群，目前只支持pin</p>
          </div>
          <i class="el-icon-arrow-right arrow-ico" />
        </div>
      </li>
      <li>
        <div class="link cf" @click="link('labelSelect')">
          <img src="@/assets/views/ico-cus4.png">
          <div>
            <h3>智能筛选</h3>
            <p>根据不同营销场景，算法推荐客群</p>
          </div>
          <i class="el-icon-arrow-right arrow-ico" />
        </div>
      </li>
    </ul>
  </el-dialog>
</template>

<script type="text/babel">
export default {
  name: 'CreateType',
  props: {
  },
  data() {
    return {
      dialogTableVisible: false
    }
  },

  mounted() {
  },
  methods: {
    showDialog() {
      this.dialogTableVisible = true
    },
    link(name) { // 跳转
      this.$router.push({ name }).catch(err => err)
    }
  }
}
</script>

<style lang="scss" scoped>
  .customers-way-dialog{
    ul{
      li{
        background: #FFFFFF;
        box-shadow: 0 2px 8px 0 rgba(71,71,71,0.10);
        border-radius: 4px;
        margin-bottom:15px;
        .link{
          display:block;
          padding:20px;
          position:relative;
          cursor: pointer;
          img{
            float:left;
            width:48px;
            height:48px;
          }
          div{
            margin-left:64px;
            h3{
              font-size: 14px;
              color: #333333;
            }
            p{
              font-size:12px;
              color:#999;
            }
          }
          .arrow-ico{
            position:absolute;
            top:50%;
            transform:translateY(-50%);
            right:20px;
            font-size:24px;
            color:#d8d8d8;
          }
        }
      }
    }
  }
</style>
