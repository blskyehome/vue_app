<template>
</template>

<script>
import axios from 'axios'
import config from '../config'

export default {
  name: 'Signout',
  data (router) {
    return {
      section: 'Signout',
      loading: '',
      user_name: '',
      password: '',
      response: ''
    }
  },
  methods: {
    signOut () {
      axios({
        method: 'delete',
        url: config.serverURI + '/token/user',
        params: {
          token: localStorage.token
        }
      })
        .then(response => {
          console.log(response)
          localStorage.removeItem('token')
          this.$router.replace(this.$route.query.redirect || '/login')
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted () {
    this.signOut()
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
