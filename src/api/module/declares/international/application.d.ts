interface IQueryAppIinfoListParams {
    pageNumb: string	
    pageSize: string
    type: string
    name: string
    companyName: string
    code: string
}
interface IqueryAppIinfoListItem {
    site: string
    name?: string
    code?: string
    type?: number
    companyName?: string
    createUser?: string
    createTime?: string
}
interface IQueryAppIinfoListResponse {
    total: number
    list: IqueryAppIinfoListItem[]
    
}