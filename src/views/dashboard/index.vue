<template>
  <div class="content">
    <div class="top">
      <div v-for="(item, index) in count" :key="index" class="box">
        <div class="total">{{ item.total }}</div>
        <div class="xian" />
        <div class="text">{{ item.text }}</div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="textbottom"><span>社区年龄分布</span></div>
        <div id="container" />
      </div>
      <div class="right">
        <div class="textbottom"><span>近七天预约情况</span></div>
        <div id="c1" />
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  mounted() {
    this.getData().then(() => {
      this.initComponent()
      this.initbing()
    })
  },

  data() {
    return {
      msg: '',
      chart: null,
      chart1: null,
      count: [],
      data: [],
      data2: []
    }
  },
  methods: {
    async getData() {
      const res = await request
        .get('/home')
        .then(res => {
          this.data = res.data
          this.count = res.count
          this.data2 = res.people
        })
        .catch(err => {
          console.log(err)
        })
      return res
    },
    initComponent() {
      const chart = new this.$G2.Chart({
        container: 'c1',
        width: 800,
        height: 300
      })

      chart.source(this.data)
      chart.interval().position('type*value').color('#063d8a')
      this.chart = chart
      this.chart.render()
    },
    initbing() {
      const chart = new this.$G2.Chart({
        container: 'container',
        width: 500,
        height: 300
      })
      chart.source(this.data2)
      chart.coordinate('theta')

      chart
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', ['#063d8a', '#1770d6', '#47abfc', '#38c060', 'green'])
        .label('type', val => {
          return {
            offset: -30,
            content: obj => {
              return obj.type + '\n' + obj.value
            }
          }
        })
      this.chart1 = chart
      chart.render()
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  width: 100%;
  .top {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: space-around;
    .box {
      width: 20%;
      height: 100%;
      background-image: url('../../../public/bj.png');
      background-size: 100% 100%;
      border-radius: 10px;
      .total {
        height: 45px;
        padding: 20px;
        color: white;
        font-weight: 800;
        font-size: 18px;
        padding-bottom: 0;
      }
      .xian {
        width: 40px;
        height: 3px;
        background: #1e87f0;
        margin-left: 20px;
      }
      .text {
        margin-top: 20px;
        height: 60px;
        padding: 10px;
        color: white;
        font-weight: 800;
        font-size: 16px;
      }
    }
  }
  .bottom {
    margin-top: 80px;
    width: 100%;
    height: 300px;
    display: flex;
    .left {
      width: 40%;
      height: 100%;
    }
  }
  .textbottom {
    text-align: center;
    margin-bottom: 20px;
    font-weight: 800;
    font-size: 16px;
  }
}
</style>
