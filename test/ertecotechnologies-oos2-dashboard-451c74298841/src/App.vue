<template lang="pug">
#app(v-if="$auth.ready()")
  el-menu.nav(v-if="$auth.check()", :default-active="activeMenuIndex", mode="horizontal", :router="true")
    el-menu-item(index="/", style="border-bottom: 0")
      .logo-text(v-if="logoText") {{ logoText }}
      img.logo(v-else, src="./assets/logo.png", alt="Cloudeo")
    el-menu-item(index="/") Dashboard
    el-menu-item(index="/orders") Orders
    el-menu-item(v-if="$auth.check('admin')", index="/merchants") Merchants
    el-menu-item(v-if="$auth.check('admin')", index="/products") Products
    el-menu-item(v-if="$auth.check('admin')", index="/plugins") Plugins
    el-menu-item(v-if="$auth.check('admin')", index="/logs") Logs
    el-menu-item(v-if="$auth.check('admin')", index="/unknown-orders") Unknown
    el-menu-item(v-if="$auth.check('admin')", index="/reports") Reports

    el-submenu(index="right-submenu", style="float: right")
      template(slot="title") Hi, {{ $auth.user().username }}
      el-menu-item(index="logout", @click.native="logout") Log out

  //- transition(name="slide", mode="out-in", appear)
  keep-alive(include="OrderList,MerchantList,ProductList,SubmoduleList,OrderPartList,PluginList,LogList,UnknownOrderList")
    router-view

</template>

<script>
export default {
  name: 'app',
  computed: {
    logoText () {
      if (window.location.hostname.startsWith('localhost')) {
        return 'OOS LOCAL'
      }
      if (window.location.hostname.startsWith('dev')) {
        return 'OOS DEV'
      }
      return ''
    },
    activeMenuIndex () {
      return '/' + this.$route.path.split('/')[1]
    }
  },
  methods: {
    logout () {
      this.$auth.logout({
        makeRequest: false,
        redirect: '/login'
      })
    }
  }
}
</script>

<style lang="stylus">
body
  padding 80px 10px 10px 10px
  margin 0
  font-family Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
a
  color #4078c0
  text-decoration none
h1, h2
  font-weight normal
.cf:after
  content ""
  display block
  clear both
.fl
  float left
.fr
  float right

.nav
  z-index 1000
  position absolute
  top 0
  left 0
  right 0
  .logo-text
    width 176px
    text-align center
    background #fee
    color #fa5555
    font-weight bold
    font-size 20px

.el-col
  padding-left 10px
  padding-right 10px
  min-height 1px
.el-input, .el-select, .el-autocomplete, .el-date-editor.el-input
  width 100%
.el-table .cell, .el-table th>div
  padding-left 10px
  padding-right 10px
.el-pagination
  padding 10px 0

.el-card__header
  background #E5E9F2
  h2
    margin 0
.form-actions
  position relative
  margin 0 -20px -10px -20px
  padding 10px 30px 0 30px
  border-top 1px solid #D3DCE6
  button
    display block
  // background red

.list
  .action-buttons
    .el-button
      margin-left 2px

  .list-header
    h1
      margin 0
    .el-form-item
      margin-bottom 0

.order-json
  overflow-x auto
  min-height 100px

// SLIDE TRANSITION
.slide-enter-active, .slide-enter
  transition all .2s ease

.slide-enter, .slide-leave-to
  opacity 0

.slide-enter
  transform translateX(-3rem)

.slide-leave, .slide-leave-active
  transition all .25s ease

.slide-leave-to
  transform translateX(3rem)

// FADE TRANSITION
.fade-enter-active, .fade-leave-active
  transition opacity .2s
.fade-enter, .fade-leave-to
  opacity 0
</style>

</style>
