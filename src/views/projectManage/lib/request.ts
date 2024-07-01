import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
import { Message, MessageBox } from '@lui/lui-ui'
// import { UserModule } from '@/store/modules/user'
// @ts-ignore
import qs from 'qs'

const service = axios.create({
  baseURL: '/', // url = base url + request url
  timeout: 5000
  // withCredentials: true // 跨域时需要带上cookie需要开启
})

// Request 拦截
service.interceptors.request.use(
  (config) => {
    /*    if (UserModule.token) {
      config.headers['X-Access-Token'] = UserModule.token
    } */
    /*    if (config.method === 'post') {
      config.headers = {
        // 'Content-Type': 'application/json;charset=UTF-8'
        // 'Content-Type': 'x-www-form-urlencoded;charset=UTF-8'
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    } */
    const type = Object.prototype.toString.call(config.data).slice(8, -1)
    if (type === 'Object') { // 去掉请求主体(对象类型)中的空字符串
      const oldData = Object.assign({}, config.data)
      const newData = {}
      Object.keys(oldData).forEach((key) => {
        if (oldData[key] !== '') {
          // @ts-ignore
          newData[key] = oldData[key]
        }
      })
      config.data = newData
    }
    config.data = qs.stringify(config.data)
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response 拦截
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== '200') {
      switch (res.code) {
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
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return response.data
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
