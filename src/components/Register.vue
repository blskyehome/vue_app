<template>
  <div class="container container-table">
      <div class="row vertical-10p">
        <div class="container">
          <img src="/static/img/logo.png" class="center-block logo">
          <div class="text-center col-md-4 col-sm-offset-4">
            <!-- login form -->
            <form class="ui form loginForm"  @submit.prevent="checkCreds">

              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-envelope fa-fw"></i></span>
                <input class="form-control" name="email" placeholder="邮箱" type="text" v-model="email">
              </div>
              <div class="input-group">
                <span class="input-group-addon">
                  <button type="button" class="btn btn-primary" @click="getCaptcha">获取验证码</button></span>
                <input class="form-control" name="captcha" placeholder="验证码" type="text" v-model="captcha">
              </div>
              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-user-circle fa-fw"></i></span>
                <input class="form-control" name="user_name" placeholder="昵称" type="text" v-model="user_name">
              </div>

              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-lock fa-fw"></i></span>
                <input class="form-control" name="password" placeholder="密码" type="password" v-model="password">
              </div>
              <button type="button" v-bind:class="'btn btn-primary btn-lg btn-block  ' + loading" @click="userRegister">注册</button>
            </form>

            <!-- errors -->
            <div v-if=response class="text-red"><p>{{response}}</p></div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import api from '../api'
import axios from 'axios'
import config from '../config'

export default {
  name: 'Login',
  data (router) {
    return {
      section: 'Login',
      loading: '',
      user_name: '',
      password: '',
      email: '',
      captcha: '',
      response: ''
    }
  },
  methods: {
    checkCreds () {
      const {user_name, password} = this

      this.toggleLoading()
      this.resetResponse()
      this.$store.commit('TOGGLE_LOADING')

      /* Making API call to authenticate a user */
      api.request('post', '/token/user', {user_name, password})
      .then(response => {
        this.toggleLoading()
        console.log(response)
        var data = response.data
        /* Checking if error object was returned from the server */

        /* Setting user in the state and caching record to the localStorage */
        if (data.token) {
          var token = data.token

          this.$store.commit('SET_TOKEN', token)

          if (window.localStorage) {
            window.localStorage.setItem('token', token)
          }
          this.$router.replace(this.$route.query.redirect || '/')
        }
      })
      .catch(error => {
        this.$store.commit('TOGGLE_LOADING')
        console.log(error.response)

        this.response = error.response.data.msg
        this.toggleLoading()
      })
    },
    toggleLoading () {
      this.loading = (this.loading === '') ? 'loading' : ''
    },
    resetResponse () {
      this.response = ''
    },
    getCaptcha () {
      axios({
        method: 'post',
        url: config.serverURI + '/user/captcha',
        data: {
          email: this.email
        }
      })
        .then(response => {
          console.log('Response:', response)
          this.$toasted.success('邮件已发送至' + this.email, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
          this.$toasted.error('邮件发送失败!' + error.response.statusText, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
        })
    },
    userRegister () {
      axios.post(config.serverURI + '/user?XDEBUG_SESSION_START=18657',
        {
          email: this.email,
          user_name: this.user_name,
          password: this.password,
          captcha: this.captcha
        }
      )
        .then(response => {
          console.log('Response:', response)
          this.$toasted.success('用户注册成功' + this.email, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
          var token = response.data.msg[1]
          if (window.localStorage) {
            window.localStorage.setItem('token', token)
          }
          this.$router.replace(this.$route.query.redirect || '/')
        })
      .catch(error => {
        // Request failed.
        console.log('error', error)
        this.$toasted.error('用户注册失败!' + error.response.data.msg, {
          theme: 'bubble',
          position: 'top-center',
          duration: 5000
        })
      })
    }
  }
}
</script>

<style>
html, body, .container-table {
  height: 100%;
  background-color: #282B30 !important;
}
.container-table {
    display: table;
    color: white;
}
.vertical-center-row {
    display: table-cell;
    vertical-align: middle;
}
.vertical-20p {
  padding-top: 20%;
}
.vertical-10p {
  padding-top: 10%;
}
.logo {
  width: 15em;
  padding: 3em;
}
.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
}
.input-group input {
  height: 4em;
}
</style>
