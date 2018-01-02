<template lang="pug">
el-card.login
  el-form(@submit.prevent.native="onSubmit", ref="form", :model="credentials", :rules="rules")
    el-alert(v-if="error", :title="error", type="error", :closable="false", style="margin-bottom: 20px")
    el-form-item(prop="username")
      el-input(v-model="credentials.username", placeholder="username", autofocus)
    el-form-item(prop="password")
      el-input(v-model="credentials.password", placeholder="password", type="password")
    el-button(native-type="submit", type="primary") Login
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      rules: {
        username: {required: true},
        password: {required: true}
      },
      error: ''
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$auth.login({
            data: {
              username: this.credentials.username,
              password: this.credentials.password
            },
            rememberMe: true,
            redirect: '/',
            success: (response) => {
              // console.log(response);
            },
            error: (error) => {
              console.log(error.response)
              this.error = error.response.data.error ? error.response.data.error : error.response.data
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.login
  width 20%
  min-width 300px
  margin 20px auto 0 auto
</style>