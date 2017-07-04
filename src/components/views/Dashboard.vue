<template>
  <!-- Main content -->
  <section class="content">
    <!-- Info boxes -->
    <div class="row">
      <div class="alert alert-success alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        <h4><i class="icon fa fa-check"></i> CoPilot is open source!</h4>
        Click on icon to check it out on github. <a href="https://github.com/misterGF/CoPilot" target="_blank"><i class="fa fa-github fa-2x"></i></a>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-aqua"><i class="fa fa-hashtag"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">分类</span>
            <span class="info-box-number" v-text="categoryNum"></span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <div class="info-box">
          <span class="info-box-icon bg-red"><i class="fa fa-link"></i></span>

          <div class="info-box-content">
            <span class="info-box-text">链接</span>
            <span class="info-box-number" v-text="linkNum"></span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->

      <!-- fix for small devices only -->
      <div class="clearfix visible-sm-block"></div>
    </div>
    <!-- /.row -->

    <div class="col-xs-12">
      <div class="box">
        <div class="box-header with-border">
          <h3 class="box-title"></h3>
          <div class="box-body">
            <div class="col-sm-6 col-xs-12">
              <p class="text-center">
                <strong>增长数量</strong>
              </p>
              <canvas id="trafficBar" ></canvas>
            </div>
            <hr class="visible-xs-block">
            <div class="col-sm-6 col-xs-12">
              <p class="text-center">
                <strong>链接比例</strong>
              </p>
              <canvas id="languagePie"></canvas>
            </div>
          </div>
        </div>
        <small class="space"><b>Pro Tip</b> Don"t forget to star us on github!</small>
      </div>
    </div>
    <!-- /.row -->

    <!-- Main row -->
    <div class="row">

    </div>
    <!-- /.row -->
  </section>
  <!-- /.content -->
</template>

<script>
import Chart from 'chart.js'
import config from '../../config'
import axios from 'axios'

export default {
  data () {
    return {
      linkNum: 0,
      categoryNum: 0,
      generateRandomNumbers (numbers, max, min) {
        var a = []
        for (var i = 0; i < numbers; i++) {
          a.push(Math.floor(Math.random() * (max - min + 1)) + max)
        }
        return a
      }
    }
  },
  computed: {
    coPilotNumbers () {
      return this.generateRandomNumbers(12, 1000000, 10000)
    },
    personalNumbers () {
      return this.generateRandomNumbers(12, 1000000, 10000)
    },
    isMobile () {
      return (window.innerWidth <= 800 && window.innerHeight <= 600)
    }
  },
  methods: {
    buildPieChart () {
      axios({
        method: 'get',
        url: config.serverURI + '/user',
        params: {
          token: localStorage.token
        }
      })
        .then(response => {
          console.log('Response:', response)
          var categoryList = response.data.category_list
          console.log('category list', categoryList)
          this.categoryNum = response.data.category_num
          this.linkNum = response.data.link_num
          if (categoryList) {
            var pieLabels = []
            var pieData = []
            var pieColor = []
            for (var k = 0, length = categoryList.length; k < length; k++) {
              pieLabels[k] = categoryList[k].name
              pieData[k] = categoryList[k].link_num
              pieColor[k] = categoryList[k].color
            }
            var pieChartCanvas = document.getElementById('languagePie').getContext('2d')

            var pieConfig = {
              type: 'pie',
              data: {
                labels: pieLabels,
                datasets: [{
                  data: pieData,
                  backgroundColor: pieColor,
                  hoverBackgroundColor: pieColor
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: !this.isMobile,
                legend: {
                  position: 'bottom',
                  display: true
                }
              }
            }
            new Chart(pieChartCanvas, pieConfig) // eslint-disable-line no-new
          }
          var monthNum = response.data.month_sum

          if (monthNum) {
            var lineLabel = []
            var lineDate = []

            for (var j = 0, lineLength = monthNum.length; j < lineLength; j++) {
              lineLabel[j] = monthNum[j].month
              lineDate[j] = monthNum[j].sum
            }
            var ctx = document.getElementById('trafficBar').getContext('2d')
            var config = {
              type: 'line',
              data: {
                labels: lineLabel,
                datasets: [{
                  label: '链接',
                  fill: false,
                  borderColor: '#284184',
                  pointBackgroundColor: '#284184',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  data: lineDate
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: !this.isMobile,
                legend: {
                  position: 'bottom',
                  display: true
                },
                tooltips: {
                  mode: 'label',
                  xPadding: 10,
                  yPadding: 10,
                  bodySpacing: 10
                }
              }
            }

            new Chart(ctx, config) // eslint-disable-line no-new
          }
        })
        .catch(error => {
          // Request failed.
          console.log('error', error.response)
          this.error = error.response.statusText
        })
    }
  },
  mounted () {
    this.$nextTick(() => {

    })
    this.buildPieChart()
  }
}
</script>
<style>
.info-box {
  cursor: pointer;
}
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
.fullCanvas {
  width: 100%;
}
</style>
