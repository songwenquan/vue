<!--
 * @Author: ztwang6
 * @Date: 2024-01-25 15:01:44
 * @email: ztwang6@iflytek.com
 * @LastEditors: ztwang6
 * @LastEditTime: 2024-01-28 16:47:10
 * @Description: 
-->
<template>
  <div class="zblb flex-col">
    <p class="lineTitle">指标类别</p>
    <div class="content flex-h-1 flex-bet">
      <div id="zblb"></div>
      <div class="lengnd flex-col">
        <div v-for="(item, index) in lengndData" :key="index" class="item flex-col">
          <span class="label">
            <i :style="{ backgroundColor: color[index] }"></i>
            {{ item.indexTypeName }}
          </span>
          <span class="value">{{ item.indexCount }}&nbsp;&nbsp;{{ item.indexPercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <script>
export default {
  name: 'Zblb',
  data() {
    return {
      myChart: '',
      color: [
        '#4881F1',
        '#50DFB2',
        '#F7AF00',
        '#F87E7E',
        '#DA7AEA',
        '#71DCE9',
        '#8BE44F',
        '#96ABCD',
        '#93D2D2',
        '#2CBCFF',
      ],
      lengndData: [],
    };
  },
  methods: {
    /**
     * @description: 指标类别
     * @return {*}
     */
    indexType() {
      this.$scmp_api.workstand.indexType().then((res) => {
        if (res.data.flag) {
          const array = [];
          this.lengndData = res.data.data;
          res.data.data.forEach((item) => {
            array.push({
              name: item.indexTypeName,
              value: item.indexCount,
            });
          });
          this.initEharts(array);
        } else {
          this.$message.error(res.data.errMsg);
        }
      });
    },
    initEharts(echartData) {
      this.myChart = this.$Echarts5.init(document.getElementById('zblb'));
      const formatNumber = function (num) {
        const reg = /(?=(\B)(\d{3})+$)/g;
        return num.toString().replace(reg, ',');
      };
      const total = echartData.reduce((a, b) => {
        return a + b.value * 1;
      }, 0);

      const option = {
        backgroundColor: '#fff',
        color: this.color,
        // tooltip: {
        //     trigger: 'item'
        // },
        title: [
          {
            text: formatNumber(total),
            top: 'center',
            left: 'center',
            textStyle: {
              align: 'center',
              fontSize: 32,
              fontWeight: 'bold',
              color: '#333333',
            },
          },
          {
            top: 'center',
            left: 'center',
            subtext: '事件总数(个)',
            itemGap: 30,
            subTextStyle: {
              align: 'center',
              fontSize: 14,
              fontWeight: 'normal',
              color: '#666666',
              width: '200',
            },
          },
        ],
        legend: {
          show: false,
        },
        series: [
          {
            type: 'pie',
            radius: ['65%', '80%'],
            center: ['50%', '50%'],
            data: echartData,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                borderColor: '#ffffff',
                borderWidth: 2,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
          },
        ],
      };
      this.myChart.setOption(option);
    },
    resize() {
      this.myChart.resize();
    },
  },
  mounted() {
    this.indexType();
  },
};
</script>
    
<style lang="scss" scoped>
.zblb {
  height: 100%;
  .content {
    overflow: hidden;
    align-items: center;
    #zblb {
      height: 100%;
      width: 60%;
    }
    .lengnd {
      width: 40%;
      max-height: 100%;
      overflow: auto;
      padding-left: 20px;
      .item {
        margin-bottom: 10px;
        .label {
          font-size: 14px;
          color: #333333;
          line-height: 19px;
          i {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
          }
        }
        .value {
          font-size: 20px;
          font-weight: 700;
          color: #333333;
          line-height: 26px;
        }
      }
    }
  }
}
</style>