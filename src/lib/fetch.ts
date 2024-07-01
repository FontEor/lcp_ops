import Vue from 'vue'
import Fetch from '@pandora/fetch'
import Gateway from '@jdwlfe/fetch-gw'
import { Message } from '@lui/lui-ui'

Fetch.use(Gateway, {
  env: 'development',
  domain: 'express-car.jd.com',
  appid: 158,
  clientInfo: {
    appName: 'cx_mobile',
    client: 'm'
  }
  // loginDomain: process.env.NODE_ENV === 'production'
  //   ? 'plogin.m.jd.com'
  //   : 'beta-plogin.m.jd.com'
})

// 返回数据结构
interface Response {
  data: {
    code: number,
    message: string
  }
}

// 不需要拦截响应错误的url白名单
const urlWhiteList: any[] = []

// Loading拦截器
Fetch.interceptors.push((request: {url: string, options: any}, next: any) => {
  const { url, options } = request
  const inWhiteList = urlWhiteList.findIndex((item: any) => (item) === url.replace(options.root, '')) >= 0
  next((response: Response) => {
    if (inWhiteList) {
      return false
    }
    const { code = 0, message = '系统开小差了' } = response.data || {}

    if (code) {
      switch (code) {
        case 2:
        case 65:
          Message('网络拥挤，请稍候再试~')
          break
        case 120:
          Message('您的账号存在安全风险，请联系客服~')
          break
        default:
          // 条件 code !== 142 && code !== 143
          Message('系统开小差了，请稍候再试~')
          break
      }
      return Promise.reject(new Error('Error'))
    }

    return response.data
  })
})

Vue.config.productionTip = false
