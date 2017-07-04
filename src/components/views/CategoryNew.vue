<template>
  <div>
    <!--<h1 class="text-center">Link</h1>-->
    <!--<h4 class="text-center">User Link</h4>-->
    <section class="content">
      <div class="row">
        <div v-if="error">
          Found an error
        </div>
          <div v-else>
              <div class="col-md-12">
                  <form class="form-horizontal">
                      <div class="form-group">
                          <label for="inputEmail3" class="col-sm-2 control-label">分类名</label>
                          <div class="col-sm-10">
                              <input type="email" class="form-control" id="inputEmail3" v-model="name" placeholder="">
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="" class="col-sm-2 control-label">描述</label>
                          <div class="col-sm-10">
                              <textarea class="form-control" rows="3" v-model="description"></textarea>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="col-sm-offset-2 col-sm-10">
                              <button type="button" @click="newCategory" class="btn btn-default">保存</button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from 'axios'
import config from '../../config'

export default {
  name: 'CategoryNew',
  data () {
    return {
      githubUrl: config.serverURI + '/user/link',
      response: {},
      error: null,
      color: null,
      page: 2,
      name: null,
      description: null
    }
  },
  methods: {
    newCategory: function () {
      axios({
        method: 'post',
        url: config.serverURI + '/category',
        data: {
          token: localStorage.token,
          name: this.name,
          description: this.description
        }
      })
        .then(response => {
          this.$toasted.success('保存成功!', {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
          console.log(response)
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
          this.$toasted.error('保存失败!' + error.response.data.msg, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
//          this.error = error.response.statusText
        })
    }
  }
}
</script>

<style>
  .con{
    max-width: 500px;
    margin: 0 auto;
  }
 .search-link input{
   height: 3em;
 }
</style>
