/**
 * front准入口(只缺一个挂载了···)
 * */
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from 'front_com/Home'
import { createRouter } from 'router/frontRouter'
import { createStore } from 'front_store/index'

//解决移动端300ms延迟问题
if (typeof window !== "undefined") {
    const Fastclick = require('fastclick')
    Fastclick.attach(document.body)
}

/**
 * 每次服务端请求渲染时会重新createApp，初始化这些store、router
 * 不然会出现数据还是原来的数据没有变化的问题
 * */
export function createApp(ssrContext) {
    const store = createStore()
    const router = createRouter()

    //把router的狀態放進vuex的state中,就可以透過改變state來操作路由
    sync(store, router)

    //Vue实例没有el属性时,则该实例尚没有挂载到某个dom中;需要延迟挂载
    const app = new Vue({
        router,
        store,
        ssrContext,
        render: h => h(App)
    })

    //这里延迟挂载到app上。这里和浏览器渲染不一样
    return { app, router, store }
}
