import request from "@/utils/request.js";

const qualification = {
    supplierIsv: {
        /**
         * 资质认证isv查看脱敏数据
         *
         * @typedef {Object} Response 响应参数
         * @property {Object[]} Response.data - 返回数据
         * @property {string} Response.data[].value - 对应敏感数据-脱敏展示数据，图片jsonString格式有两个属性 ：filePath 和 imageJss
         *
         * @param {Object} data 请求参数
         * @param {number} data.id - 资质ID
         * @param {number} data.property - 1=姓名;2=手机号;3=邮箱;4=营业执照;5=企业图标;6=法人代表身份证件号;7=身份证正;8=身份证反面
         * @returns {Promise.<Response>} 
         */
        decryptDesensitization: (data: object): Promise<Response> => request.post("/supplierIsv/rest/decryptDesensitization", data)
    }
};

export default qualification;