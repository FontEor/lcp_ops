import Vue from "vue";
// import { DirectiveOptions } from "vue";
// import * as directives from "@/directives";
import * as filters from "@/filters";
import ElementUI from "@lui/lui-ui";
// 默认蓝色主题
import "@lui/lui-ui/lib/theme-chalk/index.css";
// 引入gulp生成的红色主题
import "@/assets/styles/theme-red/index.css";
import "@lui/lui-ui/lib/theme-chalk/display.css";
import App from "pages/international/App.vue";
import store from "@/store";
import router from "@/router";
// import VueCodeMirror from 'vue-codemirror'
import "codemirror/lib/codemirror.css";
// Vue.use(VueCodeMirror)
import Axios from "@/lib/request";
import dayjs from "dayjs";

Vue.use(ElementUI);

// 注册自定义标签 [如按钮权限控制]
// Object.keys(directives).forEach((key) => {
//   Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
// })

// 注册拦截器
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string]: Function })[key]);
});

Vue.config.productionTip = false;

Vue.config.devtools = true;

window.eventHub = new Vue();

Vue.prototype.$dayjs = dayjs;

Axios.get("/config/env.json").then(env => {
  window.env = env;
  new Vue({
    router,
    store,
    render: (h: (arg0: any) => any) => h(App)
  }).$mount("#app");
});
