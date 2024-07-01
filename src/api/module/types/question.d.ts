export namespace IQuestion {
    interface queryQuestionListParams {
        pageNumb: number | string;
        pageSize: number | string;
        type: string | number;
        netType: string | number;
    }
    interface queryQuestionListResponse {
        question?: string;
        solution?: string;
        netType?: number;
        id?: number;
        type?: number;
        seq?: number;
        status?: string;
        createUser?: string;
        updateUser?: string;
        createTime?: string;
        updateTime?: string;
        solutionEnglish?: string;
    }
    interface editQuestionPrams {
        oldQuestion: string;
        type: number;
        netType: number;
        question: string;
        solution?: string;
        solutionEnglish?: string;
        seq: number;
        id?: number;
        oldNetType?: number;
    }
    interface getQuestionDetailByIdPrams {
        id: number | string;
    }
    interface getQuestionDetailByIdResponse {
        question: string;
        solution: string;
        netType: number;
        type: number;
        seq: number;
        status: number;
        solutionEnglish?: string;
    }
    interface publishQuestionParams {
        type: number;
        netType: number;
        question: string;
    }
    interface deleteQuestionParams {
        type: number;
        netType: number;
        question: string;
    }
    interface downQuestionParams {
        type?: number;
        netType?: number;
        question?: string;
    }
}
export namespace IQuestionRequest {
    export interface request {
        queryQuestionList: (options: IQuestion.queryQuestionListParams) => Promise<IQuestion.queryQuestionListResponse>;
        editQuestion: (Options: IQuestion.editQuestionPrams) => Promise<unknown>;
        getQuestionDetailById: (options: IQuestion.getQuestionDetailByIdPrams) => Promise<IQuestion.getQuestionDetailByIdResponse>;
        publishQuestion: (options: IQuestion.publishQuestionParams) => Promise<unknown>;
        deleteQuestion: (options: IQuestion.deleteQuestionParams) => Promise<unknown>;
        downQuestion: (options: IQuestion.downQuestionParams) => Promise<unknown>;
    }
}