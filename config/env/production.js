import fs from 'fs'
let config = {
    app: {
        port: 5510,
        baseApi: '/routers'
    },
    mongodb: {
        url: 'mongodb://localhost:27017/vue-blog'
    },
    jwt: {
        secret: 'blog' //默认
    },
    mongodbSecret: { //mongodb用户和密码
        user: 'blog01',
        pass: '870810'
    },
    admin: {  //后台初始化的用户名密码
        user: 'admin',
        pwd: 'password'
    }
};

/*if (fs.existsSync(__dirname + '/private.js')) {
    config = Object.assign(config, require('./private.js'));
}
console.log(config);*/

export default config;