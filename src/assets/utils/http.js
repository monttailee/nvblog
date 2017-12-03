/**
 * ajax配置[仅用于admin发布端]
 * http://blog.csdn.net/sjn0503/article/details/74729300  axios拦截设置和错误处理
 */
import axios from 'axios'
import store from '../../store/admin/store'
import router from '../../router/adminRouter'
import { DELETE_TOKEN } from '../../store/admin/mutationTypes'

/**
 * axios配置
 * */
axios.defaults.timeout = 5000;
//axios.defaults.baseURL = 'https://api.github.com';

/**
 * http request 拦截器
 * */
axios.interceptors.request.use(
    config => {
        if (store.state.auth.token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.state.auth.token; //设定header的token验证
            next()
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });

/**
 * http response 拦截器
 * */
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.data.error.indexOf("token") !== -1) {
            store.commit(DELETE_TOKEN);
            router.replace({
                path: '/admin/login',
                query: {redirect: router.currentRoute.fullPath}
            })
        }
        return Promise.reject(error)
    });

export default axios;