/**
 * admin 路由封装
 * 常用方法：http://blog.csdn.net/sinat_17775997/article/details/54915211
 * */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'admin_store/store'
import Login from 'admin_com/Login'
import Admin from 'admin_com/Admin'

Vue.use(VueRouter);//全局注册

const router = new VueRouter({
    mode: 'history',// 两种类型history 还有 hash
    routes: [
        {
            path: '/admin/login',
            component: Login,
            meta: { requireAuth: true }
        },
        {
            path: '/admin',
            component: Admin,
            /*beforeEnter: (to, from, next) => {
                // ...某个路由独享钩子
            },
            beforeLeave: (to, from, next) => {
                // ...某个路由独享钩子
            }*/
        },
        {
            path: '*',
            redirect: '/admin' //输入其他不存在的地址重定向跳回首页
        }
    ]
});

//全局钩子全局用
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) { //login
        if (store.state.auth.token) {
            next('/admin')
        }
        next()
    } else {//admin
        if (!store.state.auth.token) {
            next('/admin/login')
        }
        next()
    }
});

export default router;

//http://blog.csdn.net/CatieCarter/article/details/76178590?locationNum=6&fps=1    vue路由
//https://www.cnblogs.com/heioray/p/7193841.html  vue-router模式/钩子函数
//https://github.com/superman66/vue-axios-github/blob/master/src/router.js
