import Vue from 'vue'
import { sync } from 'vuex-router-sync'//把router的狀態放進vuex的state中,就可以透過改變state來操作路由
import App from 'front_com/Home'
import router from 'router/frontRouter'
import store from 'front_store/index'

//解决移动端300ms延迟问题
if (typeof window !== "undefined") {
    const Fastclick = require('fastclick');
    Fastclick.attach(document.body)
}

//每次服务端请求渲染时会重新createApp，初始化这些store、router
//不然会出现数据还是原来的数据没有变化的问题
export function createApp(ssrContext) {
    sync(store, router);

    const app = new Vue({
        router,
        store,
        ssrContext,
        render: h => h(App)
    });

    return { app, router, store }
}
