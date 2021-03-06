<template>
    <div class="editor-box">
        <p class="editor-box__title"><i class="fa fa-pencil-square" aria-hidden="true"></i>&nbsp;&nbsp;请开始你的表演</p>
        <div class="editor-box__input-box">
            <label for="title">文章标题:</label>
            <input type="text" placeholder="文章标题" v-model="articleTitle" class="editor-box__input" id="title">
        </div>
        <div class="editor-box__input-box">
            <label for="title">添加标签:</label>
            <input type="text" placeholder="回车添加文章标签" v-model="articleTag" @keyup.enter="AddTag">
        </div>
        <ul class="editor-box__tagList">
            <li v-for="(tag, index) in currentArticle.tags">
                <span>{{tag.name}}</span>&nbsp;&nbsp;
                <i class="fa fa-trash-o" aria-hidden="true" @click="deleteCurrentTag(index)"></i>
            </li>
        </ul>
        <textarea id="editor"></textarea>
        <div class="editor-box__button-box">
            <button @click="createArticleHandle" v-if="currentArticle.id === -1">创建</button>
            <button @click="saveArticleHandle({button: 'true'})" v-else>保存</button>
            <template v-if="currentArticle.id !== -1">
                <button @click="publishArticleHandle" v-if="!currentArticle.publish">发布</button>
                <button @click="notPublishArticleHandle" v-else>撤回发布</button>
            </template>
            <button @click="deleteArticleHandle">删除</button>
        </div>
    </div>
</template>

<script>
    import SimpleMDE from 'simplemde'
    import debounce from 'lib/debounce'
    import marked from 'lib/marked'
    import css from 'simplemde/dist/simplemde.min.css'
    import { mapGetters, mapActions, mapMutations } from 'vuex'

    let simplemde;
    export default {
        name: 'editor',
        data() {
            return {
                articleTag: '',
                tags: [],
                articleTitle: '',
                articleContent: ''
            }
        },
        computed: {
            ...mapGetters([
                'currentArticle',
                'selectTagArr'
            ])
        },
        mounted() {
          // dom渲染完成后置入编辑器当前文章内容
          this.$nextTick(() => {
            this.articleTitle = this.currentArticle.title;
            this.articleContent = this.currentArticle.content;
            simplemde.value(this.articleContent);
          })
          simplemde = new SimpleMDE({
            autoDownloadFontAwesome: false,
            element: document.getElementById("editor"),
            spellChecker: false,
            previewRender: function(plainText) {
                return marked(plainText); // Returns HTML from a custom parser
            }
          });
          simplemde.codemirror.on("change", () => {
            let value = simplemde.value();
            // 如果文章内容相同就不保存了
            if (this.currentArticle.content === value) {
                return;
            }
            // 改变文章状态 => 未保存
            if (this.currentArticle.save) {
              this.changeArticle()
            }
            // 如果不是新建的文章，则保存，这是自动保存，如果不要自动保存可以注释
            if (this.currentArticle.id !== -1) {
                this.saveArticleHandle({
                    content: value
                })
            }
            this.articleContent = value
          })
        },
        methods: {
            ...mapActions([
                'getCurrentArticle',
                'getAllTags',
                'getAllArticles',
                'saveArticle',
                'createArticle',
                'publishArticle',
                'notPublishArticle',
                'deleteArticle',
                'createTag'
            ]),
            ...mapMutations({
                clearSelect: 'CLEAR_SELECT_TAG',
                changeArticle: 'CHANGE_ARTICLE',
                deleteCurTag: 'DELETE_CURRENT_TAG',
            }),
            createArticleHandle() {
                this.createArticle({
                  title: this.articleTitle,
                  content: this.articleContent,
                  publish: false,
                  tags: this.currentArticle.tags
                }).then((res) => {
                  if (res.data.success) {
                    this.$message({
                      message: '创建成功',
                      type: 'success'
                    })

                    this.clearSelect()
                  }
                }).catch((err) => {
                  this.$message.error(err.response.data.error)
                })
            },
            //保存文章引入去抖
            saveArticleHandle: debounce(function({
                    title = this.articleTitle,
                    content = this.articleContent,
                    button = false
            }) {
                let abstract;
                if (content.indexOf("<!--more-->") !== -1) {
                    abstract = content.split("<!--more-->")[0];
                } else {
                    this.$message.error('请填写摘要');
                    return;
                }
                const article = {
                    title: title,
                    content: content,
                    abstract: abstract,
                    tags: this.currentArticle.tags,
                    lastEditTime: new Date()
                }
                this.saveArticle({
                  id: this.currentArticle.id,
                  article
                }).then((res) => {
                  if (res.data.success && button) {
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    })
                  }
                }).catch((err) => {
                  this.$message.error(err.response.data.error)
                })
            }),
            publishArticleHandle() {
                this.publishArticle({id: this.currentArticle.id}).then((res) => {
                  if (res.data.success) {
                    this.$message({
                      message: '发布成功',
                      type: 'success'
                    })
                  }
                }).catch((err) => {
                  this.$message.error(err.response.data.error)
                })
            },
            notPublishArticleHandle() {
                this.notPublishArticle({id: this.currentArticle.id}).then((res) => {
                    if (res.data.success) {
                        this.$message({
                            message: '撤回发布成功',
                            type: 'success'
                        })
                    }
                }).catch((err) => {
                    this.$message.error(err.response.data.error)
                })
            },
            deleteArticleHandle() {
                this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (this.currentArticle.id === -1) {
                        this.getCurrentArticle(0)
                        return;
                    }
                    this.deleteArticle({
                        id: this.currentArticle.id,
                        index: this.currentArticle.index
                    }).then((res) => {
                        if (res.data.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.clearSelect()
                        }
                    }).catch((err) => {
                        this.$message.error(err.response.data.error)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            AddTag() {
                if (this.currentArticle.tags.find(p => p.name === this.articleTag)) {
                    this.$message.error("该标签已存在")
                } else {
                    if (this.currentArticle.tags.length >= 5) {
                        this.$message({
                            type: 'error',
                            message: '不能创建超过5个标签'
                        });
                        return;
                    }
                    this.createTag({name: this.articleTag}).then((res) => {
                        if (res.data.success) {
                            this.$message({
                                message: '创建成功',
                                type: 'success',
                                duration: 500
                            })

                            this.getAllTags()

                            this.articleTag = ''

                            if (this.currentArticle.id !== -1) {
                                this.saveArticleHandle({})
                            }
                        }
                    }).catch((err) => {
                        this.$message.error(err.response.data.error)
                    })
                }
            },
            deleteCurrentTag(index) {
                this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteCurTag({index}).then((res) => {
                        if (this.currentArticle.id !== -1) {
                            this.saveArticleHandle({})
                        }
                        this.getAllTags()
                    }).catch((err) => {
                        this.$message.error(err)
                    })
                })
            }
        },
        watch: {
            currentArticle(val, oldVal) {
                // 监听vuex current变化改变组件data
                this.articleTitle = val.title;
                this.articleContent = val.content;
                this.articleTag = '';
                if(oldVal.id !== val.id && simplemde.isPreviewActive()) {
                    simplemde.togglePreview()
                }
                simplemde.value(this.articleContent)
            },
            articleTitle(val) {
                //监听v-model, 假如变化并且不是新建文章则保存
                if (this.currentArticle.title !== val && this.currentArticle.id !== -1) {
                    this.changeArticle()
                    this.saveArticleHandle({title: val})
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import 'css/preview.styl'
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import 'css/_settings.styl'
    .editor-box
        position relative
        padding 15px
        input
            padding 7px
            background-color $grey-bg
            width 350px
        &__title
            font-size 25px
            color $blue
            padding 10px
        &__input-box
            font-size 17px
            margin 15px 0
        &__tagList
            list-style none
            overflow hidden
            margin-bottom 15px
            li
                float left
                height 30px
                line-height @height
                margin-right 20px
                verticle-align center
                text-algin center
                border-radius 5px
                padding 0 5px
                cursor pointer
            li:hover
                background-color $grey-bg
        &__button-box
            float right
            margin 10px
            button
                width 80px
                padding 5px
                background-color $blue
                color white
                margin-left 15px
</style>
