/**
 * front准入口(只缺一个挂载了···)
 * */
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from 'front_com/Home'
import router from 'router/frontRouter'
import store from 'front_store/index'

//解决移动端300ms延迟问题
if (typeof window !== "undefined") {
    const Fastclick = require('fastclick')
    Fastclick.attach(document.body)
}

//把router的狀態放進vuex的state中,就可以透過改變state來操作路由
sync(store, router)

//Vue实例没有el属性时,则该实例尚没有挂载到某个dom中;需要延迟挂载
const app = new Vue({
  router,
  store,
  render: h => h(App)
})

export { app, router, store }
