# nvblog = koa2.x + vue2.x + vuex2.x + (vue-router2.x) + webpack2.x   ssr
使用vue2、koa2、mongodb实现的spa blog，支持markdown编辑，文章标签分类/发布／撤回，支持Server-Side Rendering

## 项目结构
### src  client端
- **src下每个目录功能都分为`front展示`页面和`admin文章管理`页面**
- **front使用 ssr**
- **admin没有使用ssr，只是普通client编译**
- **编辑器使用simplemde**
- **vue2/vuex2/vue-router2**
- **async-await**

### server node端
- **koa2**
- **使用mongodb的模型对象mongoose**
- **auth验证使用jwt**
- **async-await**

### build
- **webpack配置**

### dist
- **生成资源目录**

## vue-ssr 简述
![Alt text](https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)
```
需要两份webpack打包入口: server-entry && client-entry
server-entry 和 client-entry 需要import你的vue所有组件[app/store/router]
[切记：需要ssr的component ajax请求不能放在vue中的mounted中获取，因为这样和客户端渲染没什么区别]

后端从vuex里面取到数据(调用匹配的路由组件的 preFetch 钩子)之后，对<template>里面的HTML使用vue的语法进渲染，
最终渲染成真正的HTML，对<style>里面的内容，使用loader，抽取成css，所以服务端渲染的成果是HTML+CSS；

前端也是从vuex里面取到数据，前端的渲染主要做2件事：
1.拿到数据，使用virtual-dom进行预渲染，然后和服务端渲染出来的进行比对，比对两边渲染的内容是不是一致的；
2.对DOM元素的事件进行绑定(vue-ssr不能渲染出js)，事件在这块进行的处理
```

## Build Setup
Requires Node.js 7+

```
# install dependencies
npm install

# serve in dev mode, with hot reload at localhost:8080
npm run dev

# build for production
npm run build

# serve in production mode
npm start
```

