// type IrequestWrapper = <T>(options: Record<string, unknown>, format?:Function) => Promise<T>;

interface Iresponse {
    code: number,
    data: Record<string | number | symbol, unknown>
}