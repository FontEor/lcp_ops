<template>
  <div v-clickoutside="onBlur" @click.stop="$refs.input.focus();">
    <input
      ref="input"
      v-model="display"
      class="_input"
      v-bind="$attrs"
      @click.stop="open"
      @input="beforeOnSearch"
      @keyup.enter.prevent="onKeypressEnter"
      @keyup.up.prevent="onKeypressUp"
      @keyup.down.prevent="onKeypressDown"
    >
    <!--<span class="el-input__suffix">-->
    <!--<span class="el-input__suffix-inner">-->
    <!--<i-->
    <!--class="el-select__caret el-input__icon"-->
    <!--:class="{'el-icon-arrow-down': !expand, 'el-icon-arrow-up': expand}"-->
    <!--&gt;</i>-->
    <!--</span>-->
    <!--</span>-->
    <div class="dropdown-wrapper">
      <div v-show="expand" class="dropdown">
        <div v-show="!beginSearch" class="dropdown-select">
          <div class="address">
            <div class="header">
              <div
                v-for="(item, index) in addressVO"
                :key="item.assId"
                class="title"
                :class="{active: tab === index}"
                @click="tab = index"
              >
                {{ item.assDis }}
              </div>
              <div v-if="!isMaxLength()" class="title" :class="{active: tab === addressVO.length}" @click="tab = addressVO.length">{{ curText }}</div>
            </div>
            <div style="overflow-y: auto; overflow-x: hidden; height: 110px; padding-top: 10px; padding-bottom: 10px">
              <el-row :gutter="20">
                <el-col
                  v-for="item in curList"
                  :key="item.assId"
                  :span="6"
                  class="city"
                  :class="{active: item.assId === cur}"
                  @click.native="handleSelect(item)"
                >
                  {{ item.assDis }}
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-show="isLoading" class="loading">
            <div class="text">
              <i class="el-icon-loading" /> 加载中...
            </div>
          </div>
        </div>
        <div v-show="beginSearch && !isLoading && searchList.length" class="dropdown-search">
          <div v-for="(item, index) in searchList" :key="item.assId"
               class="city"
               :class="{active: index === cursor}"
               @click="onSearchSelect(item)"
               @mouseenter="cursor = index"
          >
            {{ item.assDis }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clickoutside from './clickoutside'

export default {
  directives: {
    Clickoutside
  },
  model: {
    prop: 'address',
    event: 'setModel'
  },
  props: {
    address: {
      type: Object,
      default() {
        return {}
      }
    },
    max: {
      type: Number,
      default: 4
    },
    requestMethod: {
      type: Function,
      default: () => ([])
    }
  },
  data() {
    return {
      tab: 0,
      expand: false,
      assMap: {
      },
      isLoading: 0,
      display: '',
      searchList: [],
      addressVO: [],
      cursor: 0

    }
  },
  computed: {
    maxLength() {
      //        if (this.addressVO.length) {
      //          let assId = this.addressVO[0].assId;
      //          // 北京 上海 天津 只有两级 其他都是三级
      //          if ([1, 2, 3].indexOf(assId) !== -1) {
      //            return this.max - 1;
      //          }
      //        }
      return this.max
    },

    last() {
      return this.addressVO && this.addressVO.length
        ? this.addressVO[this.addressVO.length - 1].assId
        : -1
    },
    beginSearch() {
      // if (this.display.length < 1) {
      //   return false
      // }
      return this.display !== this.shouldDisplay
    },
    cur() {
      // eslint-disable-next-line no-nested-ternary
      return this.addressVO && this.addressVO.length
        ? this.addressVO[this.tab] ? this.addressVO[this.tab].assId : -1
        : -1
    },
    curList() {
      let pre = 0
      if (this.tab === 0) {
        pre = 0
      } else if (this.tab > this.maxLength) {
        pre = this.addressVO[this.maxLength].assId
      } else if (this.addressVO && this.addressVO.length) {
        if (this.tab - 1 < this.addressVO.length) {
          pre = this.addressVO[this.tab - 1].assId
        } else {
          pre = this.addressVO[this.addressVO.length - 1].assId
        }
      }
      return this.assMap[pre]
    },
    shouldDisplay() {
      return this.addressVO.map(({ assDis }) => assDis).join('')
    },
    curText() {
      switch (this.addressVO && this.addressVO.length) {
        case 0:
          return '请选择省/直辖市'
        case 1:
          return '请选择城市/区'
        case 2:
          return '请选择区/县'
        case 3:
          return '请选择县'
        default:
          return ''
      }
    }
  },
  watch: {
    async addressVO(addressVO) {
      await this.$nextTick()
      if (!this.isMaxLength()) {
        this.tab = addressVO.length
      } else {
        this.tab = addressVO.length - 1
      }
    },

    tab(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.cursor = 0
      }
    },
    address: {
      deep: true,
      immediate: true,
      async handler(newVal, oldVal) {
        if (
          newVal &&
            oldVal &&
            newVal.provinceCode === oldVal.provinceCode &&
            newVal.provinceName === oldVal.provinceName &&
            newVal.cityCode === oldVal.cityCode &&
            newVal.cityName === oldVal.cityName &&
            newVal.districtCode === oldVal.districtCode &&
            newVal.districtName === oldVal.districtName
        ) {
          return
        }
        if (newVal) {
          await this.syncModel(newVal)
          this.updateModel()
        }
      }
    }
  },
  mounted() {
    this.updateMap(0)
  },

  methods: {
    isMaxLength() {
      if (this.addressVO.length === 0) {
        return false
      }
      if (!this.assMap[this.last]) {
        return true
      }
      if (this.assMap[this.last].length === 0) {
        return true
      }
      if (this.addressVO.length < this.maxLength) {
        return false
      }
      return true
    },

    async syncModel(model) {
      const { provinceCode, cityCode, districtCode, townCode } = model
      const promiseList = []
      if (provinceCode) {
        promiseList.push(this.updateMap(0))
        if (cityCode) {
          promiseList.push(this.updateMap(provinceCode))
          if (districtCode) {
            promiseList.push(this.updateMap(cityCode))
            if (townCode) {
              promiseList.push(this.updateMap(districtCode))
            }
          }
        }
      }

      await Promise.all(promiseList)
      if (provinceCode && this.maxLength >= 1) {
        const province =
            this.assMap[0] &&
            this.assMap[0].find(({ assId }) => assId === provinceCode)
        province && (this.addressVO = [province])
        if (cityCode && this.maxLength >= 2) {
          const city =
              this.assMap[provinceCode] &&
              this.assMap[provinceCode].find(
                ({ assId }) => assId === cityCode
              )
          city && (this.addressVO = [...this.addressVO, city])
          if (districtCode && this.maxLength >= 3) {
            const county =
                this.assMap[cityCode] &&
                this.assMap[cityCode].find(
                  ({ assId }) => assId === districtCode
                )
            county && (this.addressVO = [...this.addressVO, county])
            if (townCode && this.maxLength >= 4) {
              const town =
                  this.assMap[districtCode] &&
                  this.assMap[districtCode].find(
                    ({ assId }) => assId === townCode
                  )
              town && (this.addressVO = [...this.addressVO, town])
            }
          }
        }
      }
      this.resetDisplay()
    },
    async open() {
      if (this.expand) {
        return
      }
      // 打开前同步一下, 防止网络问题
      await this.syncModel(this.address || {})
      this.expand = true
    },
    async handleSelect(assInfo) {
      if (this.isLoading) {
        return
      }
      if (this.tab < this.addressVO.length - 1) {
        await this.updateMap(assInfo.assId)
      } else if (this.addressVO.length === 0) {
        await this.updateMap(assInfo.assId)
      } else if (this.addressVO.length < this.maxLength - 1) {
        await this.updateMap(assInfo.assId)
      }
      this.addressVO.length = this.tab
      this.addressVO = [...this.addressVO, assInfo]
      this.resetDisplay()
      this.updateModel()
    },
    updateModel() {
      if (!this.isMaxLength()) {
        return
      }

      this.expand = false
      let model = Object.assign({}, this.address, {
        provinceCode: this.addressVO[0] ? this.addressVO[0].assId : '',
        provinceName: this.addressVO[0] ? this.addressVO[0].assDis : '',
        cityCode: this.addressVO[1] ? this.addressVO[1].assId : '',
        cityName: this.addressVO[1] ? this.addressVO[1].assDis : ''
      })

      if (this.maxLength === 2 && this.address && this.addressVO[1] && this.address.cityCode === this.addressVO[1].assId) {
        this.$emit('setModel', model)
        if (this.address.cityName !== this.addressVO[1].assDis) {
          this.$nextTick(() => this.$emit('change', model))
        }
        return
      }
      model = Object.assign(model, {
        districtCode: this.addressVO[2] ? this.addressVO[2].assId : '',
        districtName: this.addressVO[2] ? this.addressVO[2].assDis : ''
      })

      if (this.maxLength === 3 && this.address && this.addressVO[2] && this.address.districtCode === this.addressVO[2].assId) {
        this.$emit('setModel', model)
        if (this.address.districtName !== this.addressVO[2].assDis) {
          this.$nextTick(() => this.$emit('change', model))
        }
        return
      }
      // 有改动的情况
      model = Object.assign(model, {
        townCode: this.addressVO[3] ? this.addressVO[3].assId : '',
        townName: this.addressVO[3] ? this.addressVO[3].assDis : ''
      })

      if (this.maxLength === 4 && this.address && this.addressVO[3] && this.address.townCode === this.addressVO[3].assId) {
        this.$emit('setModel', model)
        if (this.address.townName !== this.addressVO[3].assDis) {
          this.$nextTick(() => this.$emit('change', model))
        }
        return
      }

      this.$emit('setModel', model)
      this.$nextTick(() => this.$emit('change', model))
    },
    async updateMap(parentId = 0) {
      if (this.assMap[parentId] && this.assMap[parentId].length) {
        return
      }
      this.$set(this.assMap, parentId, [])
      try {
        // eslint-disable-next-line no-plusplus
        this.isLoading++
        const assInfos = await this.requestMethod(parentId)
        // 空的时候要判断已选择完毕
        this.$set(this.assMap, parentId, assInfos)
      } finally {
        // eslint-disable-next-line no-plusplus
        this.isLoading--
      }
    },

    // async getAddressInfoByParentId (parentId) {
    //   let { data: { code, message, data } } = await request({ method: 'post',
    //     url: '/site/getAddressInfoByParentId',
    //     data: [parentId] })
    //   if (code === 1) {
    //     return data
    //   }
    // },
    resetDisplay() {
      this.display = this.shouldDisplay
    },
    async onSearchSelect(assInfo) {
      this.$refs.input.focus()
      if (this.addressVO.length === this.maxLength) {
        this.resetDisplay()
        this.expand = false
      } else if (this.addressVO.length === this.maxLength - 1) {
        this.addressVO = [...this.addressVO, assInfo]
        this.resetDisplay()
        this.updateModel()
      } else {
        await this.updateMap(assInfo.assId)
        this.addressVO = [...this.addressVO, assInfo]
        this.resetDisplay()
        this.updateModel()
      }
    },

    async onSearch($event) {
      let val = $event.target.value
      this.display = val
      if (this.beginSearch) {
        // debugger
        const addressVO = [...this.addressVO]
        while (!val.startsWith(addressVO.map(({ assDis }) => assDis).join(''))) {
          addressVO.pop()
        }
        this.addressVO = [...addressVO]
        val = val.slice(this.shouldDisplay.length)
        await this.$nextTick()

        let list = this.assMap[0]

        if (this.addressVO.length) {
          list = this.assMap[this.last]
        }

        this.searchList = list.filter(item => item.assDis.includes(val))
        if (this.searchList.length) {
          this.expand = true
        }
      }
    },
    beforeOnSearch($event) {
      this.searchList = []
      this.onSearch($event)
    },
    onKeypressEnter() {
      const assInfo = this.searchList[this.cursor]
      this.onSearchSelect(assInfo)
    },

    onKeypressUp() {
      // eslint-disable-next-line no-plusplus
      this.cursor && this.cursor--
    },

    onKeypressDown() {
      // eslint-disable-next-line no-plusplus
      this.cursor < this.searchList.length - 1 && this.cursor++
    },
    async onBlur() {
      if (this.expand) {
        this.expand = false
        this.$emit('blur')
        this.syncModel(this.address || {})
      }
    }
  }
}

</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixins.scss";
  .holder {
    text-align: center;
    line-height: 70px;
  }
  .dropdown-wrapper {
    position: relative;
  }
  .dropdown {
    overflow: hidden;
    top: 2px;
    left: 0;
    position: absolute;
    z-index: 2;
    background: #FFFFFF;
    line-height: 1;

    .dropdown-select {
      padding: 30px;
      border: 1px solid #DDDDDD;
      width: 680px;

    }
    .dropdown-search {
      padding: 5px 15px;
      line-height: 2;
      width: 400px;
      border: 1px solid #DDDDDD;
    }
  }
  .hot-city {
    .title {
      font-size: 14px;
      color: #666666;
      font-weight: 600;
      margin-bottom: 16px;
    }
  }
  .address {
    position: relative;
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    background: rgba(255, 255, 255, 0.85);
    .text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }
  }

  .city {
    line-height: 32px;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &.active, &:hover {
      @include font_color("main-color");
    }
  }

  .header {
    height: 32px;
    border-bottom: 1px solid #E4E4E4;
    line-height: 31px;

    font-size: 14px;
    margin-bottom: 10px;
    @include font_color("main-color");
    white-space: nowrap;
    > .title {
      display: inline-block;
      min-width: 12%;
      max-width: 30%;
      cursor: pointer;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: center;
      padding: 0 15px;
      + .title {
        margin-left: 10px;
      }
    }
    >.active {
        @include background_color("main-color");
        color: #FFFFFF;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
  }
  ._input {
    background: #FFFFFF;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    width: 100%;
    height: 32px;
    line-height: 30px;
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
