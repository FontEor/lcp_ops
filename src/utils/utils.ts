import * as _ from 'lodash'

export default {
  queryUrl: (url: string) => {
    const paramsString = url.split('?').length > 1 ? url.split('?')[1] : null
    if (!paramsString) return {}
    return _.chain(paramsString).split('&').map((i: string) => i.split('=')).fromPairs()
      .value()
  },
  parseTime: (
    time?: object | string | number,
    cFormat?: string
  ): string | null => {
    if (time === undefined) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date: Date
    if (typeof time === 'object') {
      date = time as Date
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
        time = parseInt(time, 10)
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time *= 1000
      }
      date = new Date(time)
    }
    const formatObj: { [key: string]: number } = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      return value.toString().padStart(2, '0')
    })
    return timeStr
  },
  getUserIP() {
    // RTCPeerConnection兼容性较差且较难获取本机真实IP，废弃该方法
    return new Promise((resolve, reject) => {
      // 创建RTCPeerConnection接口
      const conn = new RTCPeerConnection({
        iceServers: []
      })
      const noop = () => {}
      conn.onicecandidate = (ice) => {
        if (ice.candidate) {
          // 使用正则获取ip
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
          let ipAddr = ''
          try {
            const exexRes = ipRegex.exec(ice.candidate.candidate) || []
            ipAddr = exexRes[1] || '127.0.0.1'
          } catch (error) {
            ipAddr = '127.0.0.1'
          }
          resolve(ipAddr)
          conn.onicecandidate = noop
        }
      }
      // 随便创建一个叫狗的通道(channel)
      conn.createDataChannel('dog')
      // 创建一个SDP协议请求
      // @ts-ignore
      conn.createOffer(conn.setLocalDescription.bind(conn), noop)
    })
  }
}
