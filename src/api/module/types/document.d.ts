export namespace IDocument {
    interface saveDocGroupParams {
        code: string;
        groupName: string;
        seq: string;
        groupType: '1' | '2'; // 1.新手指南,2.技术文档
    }
    interface queryDocGroupListParams {
        groupType: '1' | '2';
        pageNumb: string | number;
        pageSize: string | number;
        groupName?: string;
    }
    interface queryDocGroupListResponse {
        code: string;
        groupName: string;
        id: number;
        seq: string;
        createUser: string;
        createTime: string;
        groupType: number;
        updateUser: string;
        updateTime: string;
    }
    interface updateParams {
        code: string;
        groupType: number;
        seq: number;
        groupName: string;
    }
    interface queryDocListParams {
        pageNumb: string | number;
        pageSize: string | number;
        netType: 1 | 2; // 网络类型(外网：1，内网：2)
        type: string;
        status?: string;
        title?: string;
        docGroupCode: string;
    }
    interface queryDocListResponse {
        docType: number;
        title: string;
        content: string;
        netType: string;
        type: string;
        seq: string;
        status: string;
        createUser: string;
        updateUser: string;
        createTime: string;
        updateTime: string;
        docGroupCode: string;
        id: number;
        contentEnglish: string;
        bizPublish: number;
    }
    interface editDocParams {
        type: number;
        objId: number;
        netType: 1 | 2; //网络类型(外网：1，内网：2)	
        title: string;
        seq: number;
        content: string;
        contentEnglish: string;
        id: number;
        oldTitle?: string
    }
    interface getByIdParams {
        id: number | string;
    }
    interface getByIdResponse {
        id: number;
        bizPublish: number;
        content: string;
        contentEnglish: string;
        netType: number;
        type: number;
        seq: number;
        docGroupCode: string;
    }
    interface publishDocParams {
        type: number;
        objId?: number;
        netType: number;
        title: string;
        bizPublish: number;
    }
    interface deleteDocParams {
        type: number;
        netType: number;
        title: string;
        objId?: number;
    }
    interface downDocParams {
        type: number;
        netType: number;
        title: string;
        objId?: number;
    }


}
export namespace IDocumentRequest {
    export interface request {
        saveDocGroup: (options: IDocument.saveDocGroupParams) => Promise<unknown>;
        queryDocGroupList: (options: IDocument.queryDocGroupListParams) => Promise<IDocument.queryDocGroupListResponse>;
        update: (options: IDocument.updateParams) => Promise<unknown>;
        queryDocList: (options: IDocument.queryDocListParams) => Promise<IDocument.queryDocListResponse>;
        editDoc: (options: IDocument.editDocParams) => Promise<unknown>
        getById: (options: IDocument.getByIdParams) => Promise<IDocument.getByIdResponse>;
        publishDoc: (options: IDocument.publishDocParams) => Promise<unknown>;
        deleteDoc: (options: IDocument.deleteDocParams) => Promise<unknown>;
        downDoc: (options: IDocument.downDocParams) => Promise<unknown>;
    }
}