# nvblog = koa2.x + vue2.x + vuex2.x + vue-router2.x ssr
使用vue2、koa2、mongodb实现的spa blog，支持markdown编辑，文章标签分类/发布／撤回，支持Server-Side Rendering

# 项目结构
## src  client端
- **src下每个目录功能都分为`front展示`页面和`admin文章管理`页面**
- **front使用 ssr**
- **admin没有使用ssr，只是普通client编译**
- **编辑器使用simplemde**
- **引入async-await**

## server node端
- **使用mongodb的模型对象mongoose**
- **auth验证使用jwt**
- **引入async-await**

## build
- **webpack配置**

## dist
- **生成资源目录**

# ssr 科普

