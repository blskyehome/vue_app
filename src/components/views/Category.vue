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
          <div   v-if="categoryItem">
            <div class="col-md-3 col-sm-6 col-xs-12"  v-for="(item,index) in categoryItem">
              <div class="box box-success">
                <div class="box-header with-border">
                  <i class="fa fa-fa fa-hashtag fa-2x"></i>
                  <h3 class="box-title">{{item.name}}</h3>
                    <div class="btn-group pull-right">
                      <button type="button" class="btn btn-link dropdown-toggle btn-no-padding" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-angle-down "></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li><button class="btn  btn-link "  @click="forModify(item)"  data-toggle="modal" data-target="#modifyModel"><span class="fa fa-edit"></span>修改</button></li>
                        <li><button class="btn  btn-link " @click="confirmDelete(item)" data-toggle="modal" data-target="#confirmModel"><span class="fa fa-trash"></span>删除</button></li>
                      </ul>
                    </div>
                </div>
                <div class="box-body">
                  <span class="category-description">{{item.description?item.description:'没有描述'}}</span>
                </div>
              </div>
            </div>
            <div class="col-md-12 col-sm-6 col-xs-12"  v-if="numFlag">
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
            <div class="model-body" v-if="categoryForDelete">
              <div class="modal-body">
                <p >分类名：{{categoryForDelete.name}}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-info" data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger "  data-dismiss="modal" @click="deleteCategory">确定</button>
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
            <div class="model-body" v-if="categoryForModify">
              <div class="modal-body">
                <div class="form-group">
                  <label class="control-label">分类名:</label>
                  <input type="text" class="form-control" v-model="categoryForModify.name">
                </div>

                <div class="form-group">
                  <label  class="control-label">描述:</label>
                  <textarea class="form-control" rows="3" v-model="categoryForModify.description"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-info " data-dismiss="modal">取消</button>
              <button type="button" class="btn btn-danger "  data-dismiss="modal" @click="modifyCategory">确定</button>
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
  name: 'Category',
  data () {
    return {
      githubUrl: config.serverURI + '/user/link',
      error: null,
      color: null,
      page: 2,
      categoryForModify: null,
      categoryForDelete: null,
      categoryItem: {},
      keyword: '',
      numFlag: false
    }
  },
  methods: {
    getCategoryItem () {
      axios({
        method: 'get',
        url: config.serverURI + '/user/category',
        params: {
          token: localStorage.token,
          size: 24
        }
      })
        .then(response => {
          console.log('GitHub Response:', response)
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
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
          this.categoryItem = response.data.data
          if (this.categoryItem.length === 0) {
            this.$toasted.success(
              '<span class="fa fa-bell"></span><span>暂时没有内容~</span>',
              {
                theme: 'bubble',
                position: 'top-center',
                duration: 2000
              })
          }
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
        url: config.serverURI + '/user/category',
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
          this.categoryItem = this.categoryItem.concat(response.data.data)
          this.page = this.page + 1
          console.log(this.categoryItem)
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
//          this.error = error.response.statusText
        })
    },
    confirmDelete: function (item) {
      this.categoryForDelete = item
      console.log(this.categoryForDelete)
    },
    forModify: function (item) {
      this.categoryForModify = item
    },
    deleteCategory: function () {
      axios({
        method: 'delete',
        url: config.serverURI + '/category/' + this.categoryForDelete.id,
        params: {
          token: localStorage.token
        }
      })
        .then(response => {
          let index = this.categoryItem.indexOf(this.categoryForDelete)
          this.categoryItem.splice(index, 1)
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
    modifyCategory: function () {
      axios({
        method: 'put',
        url: config.serverURI + '/category/' + this.categoryForModify.id,
        data: {
          token: localStorage.token,
          name: this.categoryForModify.name,
          description: this.categoryForModify.description
        }
      })
        .then(response => {
          this.$toasted.success('<span class="fa fa-bell"></span>修改成功!', {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })

          console.log(response)
        })
        .catch(error => {
          // Request failed.
          console.log('error', error)
          this.$toasted.error('修改失败!' + error.response.data.msg, {
            theme: 'bubble',
            position: 'top-center',
            duration: 5000
          })
//          this.error = error.response.statusText
        })
    }
  },
  mounted () {
    this.getCategoryItem()
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
  .category-description{
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn-no-padding{
    padding: 0 12px;
  }
</style>
