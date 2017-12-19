<template>
    <div class="admin">
        <div class="admin__list">
            <list></list>
        </div>
        <div class="admin__editor">
            <editor></editor>
        </div>
        <div class="admin__logout">
            <i class="fa fa-power-off" aria-hidden="true" @click="logout"></i>
        </div>
    </div>
</template>

<script>
    /**
     * commit与dispatch的区别：
     * commit => mutations,用来触发同步操作的方法,由mapMutations映射
     * dispatch => actions,用来触发异步操作的方法（比如向后台发送请求获取数据,其他使用commit即可）,由mapActions映射
     * */
    import editor from './Editor'
    import list from './List'
    import { mapMutations } from 'vuex'

    export default {
        name: 'admin',
        components: { editor, list },
        data() {
            return {}
        },
        created() {
        },
        methods: {
            ...mapMutations(['DELETE_TOKEN']),
            logout() {
                this.$confirm('此操作将退出系统, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.DELETE_TOKEN()
                    this.$router.replace({path: '/admin/login'})
                }).catch(() => {
                })
            }
        },
        computed: {}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import 'css/_settings.styl'
    .admin
        &__list
            position fixed
            left 0
            top 0
            bottom 0
            width 500px
            overflow-y auto
            overflow-x hidden
        &__editor
            margin-left 500px
        &__logout
            position absolute
            top 22px
            right 30px
            font-size 28px
            cursor pointer
            color $blue
</style>
