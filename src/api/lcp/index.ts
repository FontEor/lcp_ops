import platform from '@/api/lcp/platform'
import biz from '@/api/lcp/biz'
import supplier from '@/api/lcp/supplier'
import qualification from '@/api/lcp/qualification'
import i18n from '@/api/lcp/i18n'
import workOrder from '@/api/lcp/workOrder'
import whiteList from '@/api/lcp/whiteList'
import statistics from '@/api/lcp/statistics'
import certificate from '@/api/lcp/certificate'
import sandbox from '@/api/lcp/sandbox'
import kkBoardApi from '@/api/lcp/kkBoard'

const lcp = { platform, biz, supplier, qualification, i18n, workOrder, whiteList, sandbox, statistics, certificate, kkBoardApi }

export default lcp
