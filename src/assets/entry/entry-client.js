/**
 * front入口文件(client-render)
 * */
import { app, router, store } from './front'

//如果在服务端渲染时已经写入状态，则将vuex的状态进行替换
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

//延迟挂载#app
router.onReady(() => {
    app.$mount('#app')
});

// service worker
/*if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}*/
