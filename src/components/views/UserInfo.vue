<template>
  <div>
    <!--<h1 class="text-center">Link</h1>-->
    <!--<h4 class="text-center">User Link</h4>-->
    <section class="content">
      <div class="row">
        <div class="col-lg-4 col-md-5">
            <div class="card card-user">
          <div class="image"><img src="/static/img/background.jpg" alt="..."></div>
          <div class="content">
            <div class="author">
              <router-link to="/user/avatar" alt="点击修改头像">
              <img v-bind:src="user.avatar_image.url" alt="..." class="avatar border-white">
              </router-link>
              <h4 class="title">{{user.user_name}}
                <br> <a href="#">
                  <small>{{user.email}}</small>
                </a></h4>
            </div>
            <p class="description text-center">
              "I like the way you work it
              <br> No diggity
              <br> I wanna bag it up"
            </p></div>
          <hr>
          <div class="text-center">
            <div class="row">
              <div class="col-md-3 col-md-offset-1">
                <h5>12
                  <br>
                  <small>Files</small>
                </h5>
              </div>
              <div class="col-md-3">
                <h5>2GB
                  <br>
                  <small>Used</small>
                </h5>
              </div>
              <div class="col-md-4">
                <h5>24,6$
                  <br>
                  <small>Spent</small>
                </h5>
              </div>
            </div>
          </div>
        </div>
        </div>
          <div class="col-lg-8  col-md-7">
              <!-- Success/Error heads up input -->
              <h4>昵称</h4>
              <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-fw fa-user-circle"></i>
                </span>
                  <input class="form-control" v-model="user.user_name" type="text">
                  <span class="input-group-addon">
                     <button class=" btn btn-info" @click="updateUsername">确定</button>
                </span>
              </div>
              <br>
              <h4>邮箱</h4>
              <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-fw fa-envelope"></i>
                </span>
                  <input class="form-control" v-model="user.email" type="text">
                  <span class="input-group-addon">
                     <button class=" btn btn-default">验证</button>
                  </span>
              </div>
              <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-fw fa-bullhorn"></i>
                </span>
                  <input class="form-control" placeholder="验证码" type="text">
                  <span class="input-group-addon">
                     <button class=" btn btn-info">确定</button>
                  </span>
              </div>
              <h4>密码</h4>
              <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-fw fa-bullhorn"></i>
                </span>
                  <input class="form-control" v-model="captcha" type="text" placeholder="输入验证码">
                  <span class="input-group-addon">
                     <button class=" btn btn-info" @click="getCaptcha">验证</button>
                  </span>
              </div>
              <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-fw fa-lock"></i>
                </span>
                  <input class="form-control"  type="password" v-model="password" placeholder="输入要设置的密码">
                  <span class="input-group-addon">
                     <button class=" btn btn-info" @click="updatePassword">确定</button>
                  </span>
              </div>
              <br />
          </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from 'axios'
import {mapState} from 'vuex'
import config from '../../config'

export default {
  name: 'UserInfo',
  data: function () {
    return {
      // section: 'Dash',
      year: new Date().getFullYear(),
      classes: {
        fixed_layout: config.fixedLayout,
        hide_logo: config.hideLogoOnMobile
      },
      error: '',
      user: {
        avatar_image: {
          url: ''
        },
        email: 'user@blskye.com',
        user_name: 'User Name'
      },
      captcha: null,
      password: null
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    demo () {
      return {
        displayName: 'Wanghaotian',
        avatar: 'https://avatars2.githubusercontent.com/u/10495380?v=3&s=460',
        email: '',
        randomCard: ''
      }
    }
  },
  methods: {
    changeloading () {
      this.$store.commit('TOGGLE_SEARCHING')
    },
    getUserInfo () {
      axios({
        method: 'get',
        url: config.serverURI + '/user',
        params: {
          token: localStorage.token
        }
      })
        .then(response => {
          console.log('Response:', response)
          this.user = response.data.user
          console.log(this.user.avatar_image)
          if (this.user.avatar_image === null) {
            this.user.avatar_image = {url: config.baseURI + '/avatar/f72af3a670d5d56ead98684b409b941f.jpeg'}
          }
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
          this.error = error.response.statusText
        })
    },
    updateUsername () {
      axios({
        method: 'put',
        url: config.serverURI + '/user/profile',
        data: {
          token: localStorage.token,
          user_name: this.user.user_name
        }
      })
        .then(response => {
          console.log('Response:', response)
          this.$toasted.success('用户名更新成功!', {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
          this.$toasted.error('修改失败!' + error.response.statusText, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
        })
    },
    getCaptcha () {
      axios({
        method: 'post',
        url: config.serverURI + '/user/captcha/base',
        data: {
          email: this.user.email
        }
      })
        .then(response => {
          console.log('Response:', response)
          this.$toasted.success('邮件已发送至' + this.user.email, {
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
    updatePassword () {
      axios({
        method: 'put',
        url: config.serverURI + '/user/password',
        data: {
          email: this.user.email,
          captcha: this.captcha,
          password: this.password
        }
      })
        .then(response => {
          console.log('Response:', response)
          this.$toasted.success('密码更新成功!', {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
          this.$toasted.error('修改失败!' + error.response.statusText, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
        })
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style>
  /*.search-link{*/
    /*max-width: 320px;*/
    /*margin: 0 auto;*/
  /*}*/
 .search-link input{
   height: 3em;
 }
  .avatar img{
      width: 200px;
    border-radius: 50%;
  }
  .avatar a {
    display: block;
  }
  .user-info{
    max-width: 480px;
  }
  .card-user .image img {
    width: 100%;
  }

  .card {
    border-radius: 6px;
    box-shadow: 0 2px 2px rgba(204, 197, 185, 0.5);
    background-color: #FFFFFF;
    color: #252422;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }
  .card-user .image {
    border-radius: 8px 8px 0 0;
    height: 150px;
    position: relative;
    overflow: hidden;
  }

  .card .image {
     width: 100%;
     overflow: hidden;
     height: 260px;
     border-radius: 6px 6px 0 0;
     position: relative;
     -webkit-transform-style: preserve-3d;
     -moz-transform-style: preserve-3d;
     transform-style: preserve-3d;
   }
  .card-user .content {
    min-height: 200px;
  }
.card .content {
padding: 15px 15px 10px 15px;
}.card-user .author {
   text-align: center;
   text-transform: none;
   margin-top: -65px;
 }
.card .author {
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
}

  .card-user .avatar.border-white {
    border: 5px solid #FFFFFF;
  }
.card-user .avatar {
width: 100px;
height: 100px;
border-radius: 50%;
position: relative;
margin-bottom: 15px;
}
.card .avatar {
width: 100px;
height: 100px;
overflow: hidden;
border-radius: 50%;
margin-right: 5px;
}
img {
vertical-align: middle;
}
  .card-user .author .title {
    color: #403D39;
  }
.card-user .title {
font-weight: 600;
line-height: 24px;
}
.card .title {
margin: 0;
color: #252422;
font-weight: 300;
}
  h5 {
    font-size: 1.25em;
    font-weight: 400;
    line-height: 1.4em;
    margin-bottom: 15px;
  }
</style>
