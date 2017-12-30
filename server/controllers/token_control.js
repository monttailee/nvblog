const User = require('../models/user.js')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

exports.initUser = async() => {
  let user = await User.find().exec().catch(err => {
    console.log(err);
  });
  if (user.length === 0) {
    // 目前还没做修改密码的功能，因为是单用户系统觉得需求不大
    // 如果想更换用户名／密码，先将数据库原有user删除(drop)
    // 配置中加入用户名密码，重启服务即可
    user = new User({
      name: 'hjm',
      username: ENV_CONFIG.admin.user,
      password: md5(ENV_CONFIG.admin.pwd).toUpperCase(),
      avatar: '',
      createTime: new Date()
    });
    await user.save().catch(err => {
      console.log(err);
    });
  }
}

exports.login = async(ctx) => {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;
  let user = await User.findOne({
    username,
  }).exec();
  if (user !== null) {
    if (user.password === password) {
      const token = jwt.sign({
        uid: user._id,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 //1 hours
      }, ENV_CONFIG.jwt.secret);
      ctx.body = {
        success: true,
        uid: user._id,
        name: user.name,
        token: token
      }
    } else {
      ctx.throw(401, '密码错误')
    }
  } else {
    ctx.throw(401, '用户名错误')
  }
}
