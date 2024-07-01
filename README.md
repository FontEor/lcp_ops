# pc-template-vue

## 项目开始安装依赖

```
推荐使用 npm ci ，该指令会根据package-lock.json来安装确切的依赖版本
```
```
也可以使用 npm install --registry=http://registry.m.jd.com，该指令安装的不是一个确切的版本，可能会更新package-lock.json文件
```
### 本地运行（先配host，后启服务）
```
本地配置host 
127.0.0.1 test.jdl.com
```
```
执行 npm run serve:dev 启动本地服务
```
```
erp登录：请使用19年9月份以前入职的erp账号登录，密码是xinxibu456
```
### 打包
```
执行 npm run build ，文件会打包到dist目录下
```
### 项目检查和部分问题自动修复
```
执行 npm run lint
```
### 红蓝主题切换注意事项
```
如果你升级了lui，请按以下步骤更新红色主题:
1. 全局安装gulp（如已安装，直接执行步骤3） gulp -g --registry=http://registry.m.jd.com
2. gulp -v， 查看gulp版本，确认安装成功
3. 在项目根目录下执行 gulp， 会在 src/assets/styles/theme-red/ 目录下生成新的红色主题
```
