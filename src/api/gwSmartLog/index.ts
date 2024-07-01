import service from './service'
import nps from './nps'
import merchant from '@/api/gwSmartLog/merchant'
import order from '@/api/gwSmartLog/order'
import cycle from '@/api/gwSmartLog/cycle'
import supplier from '@/api/gwSmartLog/supplier'
import dockingCycle from '@/api/gwSmartLog/dockingCycle'
import conversionFunnel from '@/api/gwSmartLog/conversionFunnel'
import apiHealth from '@/api/gwSmartLog/apiHealth';

// 统一注册API
const gwSmartLog = { service, nps, merchant, order, cycle, supplier, dockingCycle, conversionFunnel, apiHealth }

export default gwSmartLog
