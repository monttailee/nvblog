# nvblog = koa2.x + vue2.x + vuex2.x + (vue-router2.x) ssr
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
需要两份webpack打包入口，一份client，一份server
client打包入口是new一个vue的实例 然后将其挂载到dom
server打包入口返回一个promise(调用匹配的路由组件的 preFetch 钩子，拿到所需要的server端渲染的数据并返回，
将数据暴露给client[切记：所有的数据不能放在vue中的mounted中获取，因为这样和客户端渲染没什么区别])
`client打包入口` 和 `server打包入口` 需要`import`你的vue所有组件[app/store/router]

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

