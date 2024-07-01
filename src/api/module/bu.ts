import Fetch from '@pandora/fetch'
import Axios from '@/lib/request'

const BUAPI = {
  getUserTags: (params: Array<object>) => Fetch.gw('/car/getUserTags', ...params),
  bindUserTag: (params: Array<any>) => Fetch.gw('/car/bindUserTag', ...params),
  unbindUserTag: (params: Array<any>) => Fetch.gw('/car/unbindUserTag', ...params),
  getCommonConfig: () => Axios.get('/api/base/getMenu')
}

export default BUAPI
