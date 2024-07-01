import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store/index'
import { SappState } from '@/store/getters'
// import routeData from '@/router/nav.config'
import Utils from '@/utils/utils'
import request from '@/utils/request.js'
import { Message } from '@lui/lui-ui'

@Module({ dynamic: true, store, name: 'sapp' })

class Sapp extends VuexModule implements SappState {
  public sidebar = {
    opened: true,
    showSidebar: true
  }

  public editableTabsValue = '1'

  public homePage = {
    title: '首页',
    name: 'Home',
    content: ''
  }

  public editableTabs = [this.homePage]

  // 缓存页面的最大数，超过则把缓存最久切没有被访问的销毁
  public maxPageNumber = 10

  // 显隐顶导及菜单
  public showCommonView = false

  // 主题色
  public themeColor = 'blue'

  public menus: any = []

  // 是否显示tab 默认显示
  public showTab = true

  // 用于tab页面刷新
  public isRouterAlive = true

  //运行环境
  public env = 0

  // 允许keepALive缓存的页面
  public keepAliveComponents: string[] = []

  public get currentTab() {
    return this.editableTabs.find(tab => tab.name === this.editableTabsValue)
  }

  @Mutation
  public SET_ENV(env: number) {
    this.env = env
  }

  @Mutation
  public SET_THRME_COLOR(color: string) {
    this.themeColor = color
  }

  @Mutation
  public TOGGLE_ROUTER_ALIVE() {
    this.isRouterAlive = !this.isRouterAlive
  }

  @Mutation
  public INIT_FRAMEWORK() {
    this.showCommonView = JSON.parse(Utils.queryUrl(window.location.href).showCommonView || 1)
    this.sidebar.showSidebar = this.showCommonView
  }

  @Mutation
  public KEEP_ALIVE(componentName: string) {
    if (!this.keepAliveComponents.includes(componentName)) {
      this.keepAliveComponents.push(componentName)
    }
  }

  @Mutation
  public CANCEL_KEEP_ALIVE(componentName: string) {
    const index = this.keepAliveComponents.indexOf(componentName)
    index !== -1 && this.keepAliveComponents.splice(index, 1)
  }

  @Mutation
  public SET_KEEP_ALIVE(aliveArr: string[] = []) {
    this.keepAliveComponents = aliveArr
  }

  @Mutation
  private SET_MENUS(menus: any) {
    this.menus = menus
  }

  @Mutation
  private SHOW_SIDEBAR() {
    this.sidebar.showSidebar = true
  }

  @Mutation
  private HIDE_SIDEBAR() {
    this.sidebar.showSidebar = false
  }

  @Mutation
  private SET_EDITABLETABSVALUE(editableTabsValue: string) {
    this.editableTabsValue = editableTabsValue
  }

  @Mutation
  private SET_EDITABLETABS(editableTabItem: any) {
    this.editableTabs.push(editableTabItem)
  }

  @Mutation
  private DEL_EDITABLETAB(tabIndex: number) {
    this.editableTabs.splice(tabIndex, 1)
  }

  @Mutation
  private SET_EDITABLE_TABS(newTabs: any) {
    this.editableTabs = newTabs
  }

  @Action
  public async getMenus() {
    // const commonConfigRes = await API.getCommonConfig()
    // console.log('commonConfigRes', commonConfigRes)
    //
    const url = '/platform/rest/menus'
    await request({
      url,
      method: 'get'
    })
      .then((res:any) => {
        if (res.data.length === 0) {
          Message.error('您暂无访问权限，请联系管理员')
          console.log(111111)
        } else {
          this.SET_MENUS(res.data || [])
        }
      })
      .catch((e:any) => {
        console.log('错误', e)
      })

    // this.SET_MENUS(routeData || [])
  }

  @Mutation
  private TOGGLE_SIDEBAR() {
    this.sidebar.opened = !this.sidebar.opened
  }

  @Action
  public showSideBar() {
    this.SHOW_SIDEBAR()
  }

  @Action
  public hideSideBar() {
    this.HIDE_SIDEBAR()
  }

  @Action
  public toggleSideBar() {
    this.TOGGLE_SIDEBAR()
  }

  @Action
  public setEditableTabsValue(val: string) {
    this.SET_EDITABLETABSVALUE(val)
  }

  @Action
  private filterEditableTabs(tab: any) {
    let filterRes = null
    this.editableTabs.forEach((item) => {
      if (tab.name === item.name) {
        filterRes = item
      }
    })
    return filterRes
  }

  @Action
  public async addTab(target: any) {
    target && this.SET_EDITABLETABSVALUE(target.name)
    const targetRes: any = await this.filterEditableTabs(target)
    !targetRes && this.SET_EDITABLETABS(target)
  }

  @Action
  public removeTab(targetName: string) {
    let delIndex = -1
    if (this.editableTabsValue === targetName) {
      this.editableTabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          delIndex = index
          const nextTab = this.editableTabs[index + 1] || this.editableTabs[index - 1]
          if (nextTab) {
            this.setEditableTabsValue(nextTab.name)
          }
        }
      })
    } else {
      this.editableTabs.filter((item, index) => {
        if (item.name === targetName) {
          delIndex = index
        }
        return delIndex
      })
    }
    // 取消缓存
    this.CANCEL_KEEP_ALIVE(targetName)
    delIndex > 0 && this.DEL_EDITABLETAB(delIndex)
  }

  @Action
  public removeAllTab() { // 关闭所有tab
    this.SET_EDITABLE_TABS([this.homePage])
    this.setEditableTabsValue('/')
    // 取消缓存
    this.SET_KEEP_ALIVE()
  }

  @Action
  public removeAsideTab(data: any) { // 关闭某一边tab
    let newTabs: any = []
    const len: number = this.editableTabs.length
    const { index, dir } = data
    const oldName = this.editableTabs[index].name
    if (dir === 'right') { // 关闭右边
      newTabs = this.editableTabs.slice(0, index + 1)
    } else { // 关闭左边
      newTabs = this.editableTabs.slice(index, len)
    }
    if (newTabs.length === 0 || newTabs[0].name !== 'Home') {
      newTabs.unshift(this.homePage)
    }
    this.setEditableTabsValue(oldName)
    this.SET_EDITABLE_TABS(newTabs)
    // 取消缓存
    this.SET_KEEP_ALIVE(newTabs.map((item: any) => item.name))
  }

  @Action
  public removeOtherTab(index: any) { // 关闭其他tab
    const oldName = this.editableTabs[index].name
    const newTabs: any = []
    newTabs.push(this.editableTabs[index])
    if (newTabs[0].name !== 'Home') {
      newTabs.unshift(this.homePage)
    }
    this.setEditableTabsValue(oldName)
    this.SET_EDITABLE_TABS(newTabs)
    // 取消缓存
    this.SET_KEEP_ALIVE(newTabs.map((item: any) => item.name))
  }
}

export const SappModule = getModule(Sapp)
