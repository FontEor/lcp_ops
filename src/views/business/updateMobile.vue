<template>
    <div>
        <div class="title">你可在此更改开发商下管理员的手机号</div>
        <div class="container">
            <el-form :model="form" :rules="rules" label-width="110px" ref="form">
                <el-form-item label="公司名称:" prop="companyName">
                    <el-autocomplete v-model="form.companyName" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" value-key="name" @select="handleSelect"></el-autocomplete>
                </el-form-item>
                <el-form-item label="新手机号:" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请输入内容"></el-input>
                </el-form-item>
                <div class="footer">
                    <el-button type="primary" @click="onUpdate('form')">更改</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import request from "../../utils/request";
    export default {
        data() {
            return {
                restaurants: [],
                state: "",
                timeout: null,
                form: {},
                supplierId: null,
                tenantId: null,
                rules: {
                    companyName: [{
                        required: true,
                        message: "请输入公司名称",
                        trigger: "change"
    
                    }],
                    mobile: [{
                            required: true,
                            message: "请输入新手机号"
                        },
    
                        {
                            pattern: /^1[3456789]\d{9}$/,
                            message: '请输入正确手机号',
                        }
                    ]
                }
            };
        },
        methods: {
            //模糊查询
            querySearchAsync(queryString, cb) {
                const url = "/platformUser/rest/fuzzy/queryIsvBaseInfo";
                request({
                        url,
                        method: "get",
                        params: {
                            companyName: this.form.companyName
                        }
                    })
                    .then(res => {
                        this.restaurants = res.data;
                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(() => {
                            cb(this.restaurants);
                        }, 3000 * Math.random());
                    })
                    .catch(e => {
                        console.log("错误", e);
                    });
            },
            //模糊查询所选择的对象
            handleSelect(item) {
                this.supplierId = item.supplierId;
                this.form.companyName = item.name;
    
            },
    
            //点击更新
            onUpdate(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const url = "/platformUser/rest/updateIdaasManagerMobile";
                        const params = {
                            supplierId: this.supplierId,
                            tenantId: this.tenantId,
                            mobile: this.form.mobile
                        };
                        request({
                                url,
                                method: "post",
                                data: params
                            })
                            .then(res => {
                                this.$message("更新手机号成功");
                            })
                            .catch(e => {});
                    } else {
                        return false;
                    }
                });
    
            }
        }
    };
</script>

<style lang="scss" scoped>
    .title {
        font-size: 18px;
        line-height: 100px;
        margin-left: 30px;
    }
    
    .container {
        width: 380px;
    }
    
    .el-autocomplete {
        position: relative;
        display: inline-block;
        width: 270px;
    }
    
    .footer {
        text-align: right;
    }
</style>
