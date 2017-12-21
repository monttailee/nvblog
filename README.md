# nvblog = koa2.x + vue2.x + vuex2.x + (vue-router2.x) + webpack2.x
使用vue2、koa2、mongodb实现的spa blog，支持markdown编辑，文章标签分类/发布／撤回，支持 热更新 及 Server-Side Rendering

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
[切记：需要ssr的component ajax请求不能放在vue中的mounted中获取，因为这样和客户端渲染没什么区别]


客户端发起请求，服务器根据请求地址获得匹配的组件，再调用匹配到的组件返回 Promise (官方是preFetch方法)来拿到需要的数据,
将<script>window.__initial_state=data</script>写入网页，最后将服务端渲染好的网页返回回去,服务端渲染的成果是HTML+CSS

客户端将vuex写入的 __initial_state__ 替换为当前的全局状态树：
 1⃣ 再用这个状态树去检查服务端渲染好的数据有没有问题。遇到没被服务端渲染的组件，再去发异步请求拿数据
 2⃣ 对DOM元素的事件进行绑定，事件在这块进行处理
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

