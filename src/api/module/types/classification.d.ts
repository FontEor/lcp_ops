export namespace IClassification {
    interface IQueryBussinessTypeListParams {
        pageNumb: string;
        pageSize: string;
        solutionType: string;
        queryName?: string;
    }
    interface IQueryBussinessTypeListResponse {
        name: string;
        id: number;
        updateUser: string;
        updateTime: string;
        code: string;
    }

    interface ISaveBusinessTypeParams {
        name?: string;
        id?: number;
        code?: string;
        seq?:number;
        solutionType?:number
    }
    interface IGetBusinessTypeParams {
        id: number | string
    } 
    interface IGetBusinessTypeResponse {
        name?:string;
        code?:string;
        seq?:number;
    }  
    interface IDeleteBusinessTypeCheckParams {
        code?:string;
    }
    interface IDeleteBusinessTypeParams {
        code: string;
    }

}
export namespace IClassificationRequest {
    export interface request {
        queryBusinessTypeList: (options: IClassification.IQueryBussinessTypeListParams) => Promise<IClassification.IQueryBussinessTypeListResponse>;
        saveBusinessType: (options: IClassification.ISaveBusinessTypeParams) => Promise<unknown>;
        getBusinessType: (options: IClassification.IGetBusinessTypeParams) => Promise<IClassification.IGetBusinessTypeResponse>;
        deleteBusinessTypeCheck: (options: IClassification.IDeleteBusinessTypeCheckParams) => Promise<unknown>;
        deleteBusinessType: (options: IClassification.IDeleteBusinessTypeParams) => Promise<unknown>;
        

    }
}