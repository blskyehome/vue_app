<template>
  <div>
    <!--<h1 class="text-center">Link</h1>-->
    <!--<h4 class="text-center">User Link</h4>-->
    <section class="content">
      <div class="row">
        <!-- search form (Optional) -->

        <div class="col-md-6 col-sm-8 col-xs-12">
          <div class="input-group search-link">
            <input class="form-control input-sm" v-model="keyword" type="text">
            <span class="input-group-addon"><i class="fa  fa-search"></i></span>
          </div>
        </div>
        <div class="col-md-6 col-sm-4 col-xs-12">
          <div class="input-group">
            <button class="btn btn-info"   data-toggle="modal" data-target="#newLinkModel">新建</button>
          </div>
        </div>
        <hr>

        <!-- /.search form -->
      </div>
      <div class="row">
        <div v-if="error">
          Found an error
        </div>
        <div v-else>
          <div   v-if="response">
            <div class="col-md-3 col-sm-6 col-xs-12"  v-for="(item,index) in response">
              <div class="info-box">
                  <a class="info-box-icon bg-aqua" v-bind:href="item.url" target="_blank">
                  <img class="img-circle" v-bind:src="item.icon" alt="icon" onerror="this.src='/static/img/favicon.ico'"/>
                </a>
                <div class="info-box-content">
                  <span class="info-box-text">{{item.title }}</span>
                  <span class="info-box-number"><small>{{item.clicks}}</small> <small v-if="item.category">{{item.category.name}} </small> <small v-else="item.category">未分类</small></span>
                  <div class="btn-group pull-right">
                    <button type="button" class="btn btn-lg btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="fa fa-angle-down "></i>
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
            <div class="col-md-12 col-sm-6 col-xs-12" v-if="numFlag">
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
              <button type="button" class="btn btn-danger "  data-dismiss="modal" @click="deleteLink">确定</button>
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
              <button type="button" class="btn btn-danger "  data-dismiss="modal" @click="modifyLink">确定</button>
            </div>
          </div>
        </div>
      </div>

      <!-- New Link Modal -->
      <div class="modal fade"
           id="newLinkModel" tabindex="-1" role="dialog" aria-labelledby="modifyModelLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" >新建</h4>
            </div>
            <div class="model-body">
              <div class="modal-body">

                <div class="form-group">
                  <label  class="control-label">链接:</label>
                  <input type="text" class="form-control"  v-model="newLink.url">
                </div>
                <div class="form-group">
                  <label class="control-label">标题:</label>
                  <input type="text" class="form-control" v-model="newLink.title">
                </div>
                <div class="form-group"  v-if="categoryItem" >
                  <label  class="control-label">分类:</label>
                  <select class="form-control" v-model="newLink.category_id">
                    <option  v-for="item in categoryItem" v-bind:value="item.id" >{{item.name}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label  class="control-label">是否公开:</label>
                  <label class="radio-inline">
                    <input type="radio" name="openness" value="1" v-model="newLink.openness"> 公开
                  </label>
                  <label class="radio-inline">
                    <input type="radio" name="openness"  value="2" v-model="newLink.openness" checked> 私有
                  </label>

                </div>
                <div class="form-group">
                  <label  class="control-label">备注:</label>
                  <textarea class="form-control" rows="3" v-model="newLink.comment"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-info " data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger "  data-dismiss="modal" @click="newLinkPost">确定</button>
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
      categoryItem: null,
      keyword: '',
      numFlag: false,
      newLink: {

      }
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
          category_id: this.$route.params.category_id,
          keyword: this.keyword
        }
      })
        .then(response => {
          console.log('GitHub Response:', response)
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          this.response = response.data.data
          if (response.data.data.length >= 24) {
            this.numFlag = true
          }
          if (response.data.data === 0) {
            this.$toasted.success('已经加载完所有的链接', {
              theme: 'bubble',
              position: 'top-center',
              duration: 2000
            })
          }
          if (this.response.length === 0) {
            this.$toasted.success('暂时没有内容', {
              theme: 'bubble',
              position: 'top-center',
              duration: 2000
            })
          }
          console.log('链接', this.response.length)
        })
        .catch(error => {
            // Request failed.
          console.log('error', error)
          this.error = error
        })
    },
    loadMore: function () {
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
          page: this.page,
          category_id: this.$route.params.category_id
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
          if (response.data.data.length < 24) {
            this.numFlag = false
          }
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
    },
    deleteLink: function () {
      axios({
        method: 'delete',
        url: config.serverURI + '/link/' + this.linkForDelete.id,
        params: {
          token: localStorage.token
        }
      })
        .then(response => {
          let index = this.response.indexOf(this.linkForDelete)
          this.response.splice(index, 1)
          this.$toasted.success('删除成功!', {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
          console.log(response)
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
//          this.error = error.response.statusText
        })
    },
    modifyLink: function () {
      axios({
        method: 'put',
        url: config.serverURI + '/link/' + this.linkForModify.id,
        data: {
          token: localStorage.token,
          openness: 1,
          category_id: this.linkForModify.category_id,
          title: this.linkForModify.title,
          url: this.linkForModify.url,
          comment: this.linkForModify.comment
        }
      })
        .then(response => {
          this.$toasted.success('修改成功!', {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
          console.log(response)
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
          this.$toasted.error('修改失败!' + error.response.statusText, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
//          this.error = error.response.statusText
        })
    },
    newLinkPost () {
      axios({
        method: 'post',
        url: config.serverURI + '/link',
        data: {
          token: localStorage.token,
          url: this.newLink.url,
          title: this.newLink.title,
          openness: this.newLink.openness,
          category_id: this.newLink.category_id,
          comment: this.newLink.comment
        }
      })
        .then(response => {
          this.$toasted.success('添加成功!', {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
          console.log(response)
          this.response.unshift(this.newLink)
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
          this.$toasted.error('添加失败!' + error.response.statusText, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
//          this.error = error.response.statusText
        })
    }
  },
  mounted () {
    this.callGitHub()
    this.getCategoryItem()
  },
  watch: {
//    当route有变化是重新请求
    '$route': 'callGitHub',
    'keyword': 'callGitHub'
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
</style>
