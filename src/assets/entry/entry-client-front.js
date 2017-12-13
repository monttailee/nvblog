/**
 * front入口文件(client-render)
 * */
import { createApp } from './front'

const { app, router, store } = createApp()

//replaceState的作用是替换整个 rootState
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
