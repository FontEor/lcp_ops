export namespace IquestionMaintain {
    interface basicParams {
        id: number,
    }
    interface queryQuestionListParams {
        pageNumb: number,
        pageSize: number,
        workOrderTypeCode?: string,
    }
    interface queryQuestionListResponse {
        code: string,
        workOrderTypeCode: string,
        remark: string,
        status: 1 | 2 | 3,
        createUser: string,
        updateUser: string,
        createTime: string,
        updateTime: string,
        views: number,
        top: 0 | 1,
    }
    interface queryWorkOrderTypeListResponse {
        code: string,
        typeName: string,
        createUser: string,
        updateUser: string,
        createTime: string,
        updateTime: string,
        children: queryWorkOrderTypeListResponse[],
        id: number,
        parentId: number,
    }
    interface getQuestionDetailByIdResponse {
        remark: string,
        content: string,
        workOrderTypeCode: string,
    }
    interface editQuestionParams {
        workOrderTypeCode: string,
        id: number,
        remark: string,
        content: string
    }
    interface topQuestionParams {
        id: number,
        top: 1 | 0, // 0：取消置顶;1:置顶
    }
}
export namespace IquestionMaintainRequest {
    export interface request {
        queryQuestionList: (options: IquestionMaintain.queryQuestionListParams) => Promise<IquestionMaintain.queryQuestionListResponse>,
        queryWorkOrderTypeList: (options: unknown) => Promise<IquestionMaintain.queryWorkOrderTypeListResponse>,
        getQuestionDetailById: (options: IquestionMaintain.basicParams) => Promise<IquestionMaintain.getQuestionDetailByIdResponse>,
        editQuestion: (optons: IquestionMaintain.editQuestionParams) => Promise<unknown>,
        topQuestion: (options: IquestionMaintain.topQuestionParams) => Promise<unknown>,
        publishQuestion: (options: IquestionMaintain.basicParams) => Promise<unknown>,
        downQuestion: (options: IquestionMaintain.basicParams) => Promise<unknown>,
        deleteQuestion: (options: IquestionMaintain.basicParams) => Promise<unknown>,
    }
}