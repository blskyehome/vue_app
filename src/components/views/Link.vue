<template>
  <div>
    <h1 class="text-center">Link</h1>
    <h4 class="text-center">User Link</h4>

    <section class="content">
      <div class="row">
        <div v-if="error">
          Found an error
        </div>
        <div v-else>
          <div   v-if="response">
            <div class="col-md-3 col-sm-6 col-xs-12"  v-for="(item,index) in response">
              <div class="info-box">
                <span class="info-box-icon bg-aqua">
                  <img class="img-circle" v-bind:src="item.icon" alt="icon" onerror="this.src='/static/img/favicon.ico'"/>
                </span>

                <div class="info-box-content">
                  <span class="info-box-text">{{item.title }}</span>
                  <span class="info-box-number"><small>{{item.clicks}}</small> <small>{{item.category.name}} </small></span>
                  <div class="btn-group pull-right">
                    <button type="button" class="btn btn-lg btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {{color}} ···
                    </button>
                    <ul class="dropdown-menu">
                      <li><button class="btn  btn-link "  @click="forModify(item)"  data-toggle="modal" data-target="#modifyModel"><span class="fa fa-edit"></span>修改</button></li>
                      <li><button class="btn  btn-link " @click="confirmDelete(item)" data-toggle="modal" data-target="#confirmModel"><span class="fa fa-trash"></span>删除</button></li>
                    </ul>
                  </div>
                  </div>
                <!-- /.info-box-content -->
              </div>
              <!-- /.info-box -->
            </div>
            <div class="col-md-12">
              <button class="btn  btn-info btn-block" @click="loadMore">loadMore</button>
            </div>
          </div>
          </div>
      </div>

      <!-- Confirm Modal -->
      <div class="modal fade"
           id="confirmModel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">确定要删除吗？</h4>
            </div>
            <div class="model-body" v-if="linkForDelete">
              <div class="modal-body">
                <p >标题：{{linkForDelete.title}}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-info" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger "  data-dismiss="modal">确定</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modify Modal -->
      <div class="modal fade"
           id="modifyModel" tabindex="-1" role="dialog" aria-labelledby="modifyModelLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="modifyModelLabel">修改</h4>
            </div>
            <div class="model-body" v-if="linkForModify">
              <div class="modal-body">
                <div class="form-group">
                  <label class="control-label">标题:</label>
                  <input type="text" class="form-control" v-model="linkForModify.title">
                </div>
                <div class="form-group">
                  <label  class="control-label">链接:</label>
                  <input type="text" class="form-control"  v-model="linkForModify.url">
                </div>
                <div class="form-group"  v-if="categoryItem" >
                  <label  class="control-label">分类:</label>
                  <select class="form-control" v-model="linkForModify.category_id">
                    <option  v-for="item in categoryItem" v-bind:value="item.id" v-if="item.id==linkForModify.category_id " selected="selected">{{item.name}}</option>
                    <option  v-for="item in categoryItem" v-bind:value="item.id" v-if="item.id!=linkForModify.category_id ">{{item.name}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label  class="control-label">是否公开:</label>
                  <label class="radio-inline">
                    <input type="radio" name="openness" value="1" v-model="linkForModify.openness"> 公开
                  </label>
                  <label class="radio-inline">
                    <input type="radio" name="openness"  value="2" v-model="linkForModify.openness"> 私有
                  </label>

                </div>
                <div class="form-group">
                  <label  class="control-label">备注:</label>
                  <textarea class="form-control" rows="3" v-model="linkForModify.comment"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-info " data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger "  data-dismiss="modal">确定</button>
            </div>
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
  name: 'Repository',
  data () {
    return {
      githubUrl: config.serverURI + '/user/link',
      response: {},
      error: null,
      color: null,
      page: 2,
      linkForModify: null,
      linkForDelete: null,
      categoryItem: null
    }
  },
  methods: {
    getCategoryItem () {
      axios({
        method: 'get',
        url: config.serverURI + '/user/category',
        params: {
          token: localStorage.token
        }
      })
        .then(response => {
          console.log('GitHub Response:', response)
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          this.categoryItem = response.data.data
        })
        .catch(error => {
          // Request failed.
          console.log('error', error.response)
          this.error = error.response.statusText
        })
    },
    callGitHub () {
      let url = config.serverURI + '/user/link'
      console.log(this.$route.params.category_id)
      if (this.$route.params.category_id) {
        url = config.serverURI + '/user/category/' + this.$route.params.category_id + '/link'
      }
      axios({
        method: 'get',
        url: url,
        params: {
          token: localStorage.token,
          size: 24,
          category_id: this.$route.params.category_id
        }
      })
        .then(response => {
          console.log('GitHub Response:', response)
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          this.response = response.data.data
        })
        .catch(error => {
            // Request failed.
          console.log('error', error.response)
          this.error = error.response.statusText
        })
    },
    loadMore: function () {
      axios({
        method: 'get',
        url: config.serverURI + '/user/link',
        params: {
          token: localStorage.token,
          size: 24,
          page: this.page
        }
      })
        .then(response => {
          console.log('GitHub Response:', response)
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
//          this.$set(this, 'response', response.data.data)
          this.response = this.response.concat(response.data.data)
          this.page = this.page + 1
          console.log(this.response)
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
//          this.error = error.response.statusText
        })
    },
    confirmDelete: function (item) {
      this.linkForDelete = item
      console.log(this.linkForDelete)
    },
    forModify: function (item) {
      this.linkForModify = item
    }
  },
  mounted () {
    this.callGitHub()
    this.getCategoryItem()
  },
  watch: {
//    当route有变化是重新请求
    '$route': 'callGitHub'
  }
}
</script>

<style>
  .hide{
    display: none;
  }
  .show{
    display: block;
  }
  .bg{
    background-color: red;
  }
</style>
