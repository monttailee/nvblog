import fs from 'fs'
let config = {
    app: {
        port: 5050,
        baseApi: '/api'
    },
    mongodb: {
        url: 'mongodb://localhost:27017/vue-blog'
    },
    jwt: {
        secret: 'blog' //默认
    },
    mongodbSecret: { //mongodb用户和密码
        user: 'vue-blog',
        pass: '870810'
    },
    admin: {  //后台初始化的用户名密码
        user: 'admin',
        pwd: 'password'
    }
};

export default config;
