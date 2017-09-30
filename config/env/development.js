import fs from 'fs'
let config = {
    app: {
        port: process.env.PORT || 8889,
        baseApi: '/api'
    },
    mongodb: {
        url: 'mongodb://localhost:27017/vue-blog'
    },
    jwt: {
        secret: 'me' //默认
    },
    mongodbSecret: { //mongodb用户和密码
        user: '',
        pass: ''
    },
    admin: {  //后台初始化的用户名密码
        user: 'admin',
        pwd: 'password'
    }
};

export default config;