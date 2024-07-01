<template>
  <div class="navbar">
    <logo class="hidden-xs-only" />
    <div class="right-menu">
      <div class="change-theme" @click="changeTheme">
        <!-- <ul>
          <li data-theme="red" class="red" />
          <li data-theme="blue" class="blue" />
        </ul>-->
      </div>
      <!-- <a href="javascript:;" class="navbar-ico">
        <i class="el-icon-message" />
      </a>-->
      <el-dropdown class="avatar-container">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <span class="user-name">{{ name || '用户名' }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { UserModule } from '@/store/modules/user'
import { SappModule } from '@/store/modules/app'
import WaterMark from 'watermark-dom'
import Logo from './Logo.vue'

// 主题存储的key
const THEME_KEY = 'jdwl-admin-theme'
export default {
  components: {
    Logo,
  },
  data() {
    return {
      activeIndex: '2',
    }
  },

  computed: {
    name() {
      return UserModule.fullname
    },
    ename() {
      return UserModule.username
    },
    avatar: () =>
      UserModule.avatar || require('@/assets/img/framework/avatar.png'),
  },
  watch: {
    ename(newVal, oldVal) {
      if (newVal === oldVal) return
      // 添加水印
      this.addWaterMark(newVal)
    },
  },
  created() {
    this.initTheme()
    //添加水印
    if (this.ename) {
      this.addWaterMark(this.ename)
    }
  },
  methods: {
    addWaterMark(txt) {
      WaterMark.load({
        watermark_fontsize: '12px',
        watermark_alpha: '0.1',
        watermark_angle: 30,
        watermark_txt: txt
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    toggleSideBar() {},
    goUserCenter() {
      console.log(UserModule)
      this.$router.push('/').catch((err) => err)
    },
    logout() {
      UserModule.logOut()
    },
    changeTheme(e) {
      const themeColor = e.target.dataset.theme

      // 兼容点击边缘主题问题
      if (!themeColor) {
        return
      }
      localStorage.setItem(THEME_KEY, themeColor)
      this.changeThemeCore(themeColor)
    },
    // 初始化主题：从存储中
    initTheme() {
      const themeColor = localStorage.getItem(THEME_KEY)
      if (themeColor) {
        this.changeThemeCore(themeColor)
      }
    },
    changeThemeCore(themeColor = 'blue') {
      if (themeColor === 'red') {
        document.body.classList.add('jdwl-admin-red')
      } else {
        document.body.classList.remove('jdwl-admin-red')
      }
      SappModule.SET_THRME_COLOR(themeColor)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixins.scss';
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  @include background_color('main-color');
  transition: width 0.28s;
  height: $navHeight;
}
.right-menu {
  display: flex;
  align-items: center;
  float: right;
  height: 100%;
  line-height: $navHeight;
  .change-theme {
    margin-right: 10px;
    ul {
      display: flex;
      justify-content: center;
      align-items: center;
      li {
        width: 18px;
        height: 18px;
        background: rgba(44, 101, 250, 1);
        border: 1px solid rgba(255, 255, 255, 1);
        border-radius: 2px;
        margin-right: 10px;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
      }
      .red {
        background: #e1251b;
      }
      .blue {
        background: #2c65fa;
      }
    }
  }
  .navbar-ico {
    height: 100%;
    padding: 0 12px;
    font-size: 16px;
    i {
      color: #fff;
    }
  }
  .avatar-container {
    padding: 0 30px 0 12px;
    .avatar-wrapper {
      cursor: pointer;
      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 100px;
        vertical-align: middle;
      }
      .user-name {
        display: inline-block;
        color: #fff;
        padding: 0 8px;
      }
      .el-icon-arrow-down {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        color: #fff;
      }
    }
  }
}
</style>
