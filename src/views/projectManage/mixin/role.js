/**
 * 获取用户角色
 */
// import common from "@/api/common"
export default {
  data() {
    return {
      access: 1 // 访问权限：1普通角色无tab，2报表角色无tab，3普通+报表:客群管理、他人客群汇总
    }
  },
  created() {
    this.access = this.$route.query.access || 1
  },
  // 进入此页面之前
  beforeRouteEnter(to, from, next) {
    /*    common.queryArea().then((res)=>{
          // console.log('res111', res)
        }) */
    const random = Math.random()
    let access = 1
    if (random <= 0.3) {
      access = 1
    } else if (random <= 0.6) {
      access = 2
    } else {
      access = 3
    }
    to.query.access = access
    next()
  },
  methods: {
  }
}
