<template>
  <div>
    <h1 class="text-center">Avatar</h1>
    <section class="content">
      <div class="row">
        <div class="col-md-12" >
          <div class="content">
            <div class="show-info">
              <div class="test">
                <vueCropper
                        ref="cropper2"
                        :img="example2.img"
                        :outputSize="example2.size"
                        :outputType="example2.outputType"
                        :info="example2.info"
                        :canScale="example2.canScale"
                        :autoCrop="example2.autoCrop"
                        :autoCropWidth="example2.width"
                        :autoCropHeight="example2.height"
                        :fixed="example2.fixed"
                        :fixedNumber="example2.fixedNumber"
                ></vueCropper>
              </div>
              <label class="btn" for="upload2">选择图片</label>
              <input type="file" id="upload2" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 2)">
              <button @click="finish2('base64')" class="btn">上传</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import vueCropper from 'vue-cropper'
  import axios from 'axios'
  import config from '../../config'
  export default {
    data: function () {
      return {
        crap: false,
        previews: {},
        lists: [
          {
            img: 'https://fengyuanchen.github.io/cropper/images/picture.jpg'
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/touxiang.jpg'
          },
          {
            img: 'https://o90cnn3g2.qnssl.com/0C3ABE8D05322EAC3120DDB11F9D1F72.png'
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg'
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/bg2.jpg'
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/can.jpg'
          },
          {
            img: 'http://ofyaji162.bkt.clouddn.com/nightcat.jpg'
          }
        ],
        option: {
          img: '',
          size: 0.8,
          outputType: 'png'
        },
        example2: {
          img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          width: 300,
          height: 300,
          fixed: true,
          fixedNumber: [4, 4]
        },
        downImg: '#'
      }
    },
    methods: {
      startCrop () {
        // start
        this.crap = true
        this.$refs.cropper.startCrop()
      },
      stopCrop () {
        //  stop
        this.crap = false
        this.$refs.cropper.stopCrop()
      },
      clearCrop () {
        // clear
        this.$refs.cropper.clearCrop()
      },
      finish (type) {
        // 输出
        var test = window.open('about:blank')
        test.document.body.innerHTML = '图片生成中..'
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            var test = window.open('')
            test.location.href = data
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            test.location.href = data
          })
        }
      },
      // 实时预览函数
      realTime (data) {
        this.previews = data
      },
      finish2 (type) {
//        var test = window.open('about:blank')
//        test.document.body.innerHTML = '图片生成中..'
        this.$refs.cropper2.getCropData((data) => {
          axios({
            method: 'post',
            url: config.serverURI + '/avatar',
            data: {
              token: localStorage.token,
              file: data
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
//          test.location.href = data
        })
      },
      down (type) {
        // event.preventDefault()
        var aLink = document.createElement('a')
        aLink.download = 'demo'
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.downImg = data
            aLink.href = data
            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.downImg = data
            aLink.href = data
            aLink.click()
          })
        }
      },
      uploadImg (e, num) {
        // 上传图片
        // this.option.img
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          if (num === 1) {
            this.option.img = e.target.result
          } else if (num === 2) {
            this.example2.img = e.target.result
          }
        }
        reader.readAsDataURL(file)
      }
    },
    components: {
      vueCropper
    },
    mounted () {

    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .content {
    margin: auto;
    max-width: 1200px;
    margin-bottom: 100px;
  }
  .test-button {
    display: flex;
    flex-wrap: wrap;
  }
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin:20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }
  .des {
    line-height: 30px;
  }
  code.language-html {
    padding: 10px 20px;
    margin: 10px 0px;
    display: block;
    background-color: #333;
    color: #fff;
    overflow-x: auto;
    font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo, Lucida, Sans, Type, Writer, Ubuntu, Mono;
    border-radius: 5px;
    white-space: pre;
  }
  .show-info {
    margin-bottom: 50px;
  }
  .show-info h2 {
    line-height: 50px;
  }
  /*.title, .title:hover, .title-focus, .title:visited {
      color: black;
  }*/
  .title {
    display: block;
    text-decoration: none;
    text-align: center;
    line-height: 1.5;
    margin: 20px 0px;
    background-image: -webkit-linear-gradient(left,#3498db,#f47920 10%,#d71345 20%,#f7acbc 30%,#ffd400 40%,#3498db 50%,#f47920 60%,#d71345 70%,#f7acbc 80%,#ffd400 90%,#3498db);
    color: transparent;
    -webkit-background-clip: text;
    background-size: 200% 100%;
    animation: slide 5s infinite linear;
    font-size: 40px;
  }
  .test {
    height: 500px;
  }
  @keyframes slide {
    0%  {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
</style>
