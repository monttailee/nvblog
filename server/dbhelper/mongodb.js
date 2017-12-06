/**
 * mongodb数据库管理模块
 * module.exports才是真正的接口，exports只不过是它的一个辅助工具。　最终返回给调用的是module.exports而不是exports
 * 开发者建议导出对象用module.exports,导出多个方法和变量用exports
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

exports.mongoose = mongoose;

exports.connect = () => {
    mongoose.connect(ENV_CONFIG.mongodb.url, ENV_CONFIG.mongodbSecret);

    // 连接成功
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connection open to ' + ENV_CONFIG.mongodb.url)
    });

    // 连接失败
    mongoose.connection.on('error', (err) => {
        console.log('Mongoose connection error: ' + err)
    });

    // 断开连接
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection disconnected')
    });

    return mongoose
};