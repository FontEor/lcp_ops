import axios from 'axios'
import { Message, MessageBox } from '@lui/lui-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '/', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Account-Type'] = 'erp'
    let url = config.url
    // 替换URL参数
    if (config.replacements) {
      for (const [key, value] of Object.entries(config.replacements)) {
        url = url.replace(`{${key}}`, value)
      }
      config.url = url
    }
    // 允许接口差异化定制超时时间
    if (config.headers.timeout) {
      service.defaults.timeout = config.headers.timeout
    } else {
      service.defaults.timeout = 10000
    }
    console.log('config', config)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const {
      config: { url },
      status
    } = response
    const whiteUrlList = ['/platform/rest/dockingPeriod/exportDockingPeriod', '/platform/rest/workOrderRecord/export', '/platform/rest/kk/docking/export']
    const data = response.data

    if (whiteUrlList.includes(url)) {
      return status >= 200 && status < 400 ? response : Promise.reject(new Error(data || 'Error'))
    }

    // if the custom code is not 20000, it is judged as an error.
    if (data.code === 20058) {
      data.message = '社会信用代码被占用'
      return data
    }
    if (data.code !== 20000) {
      if (data.code === 1001) {
        return data
      }
      Message({
        message: data.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (data.code === 50008 || data.code === 50012 || data.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(data || 'Error'))
    } else {
      return data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
