<!--
 * @Author: ztwang6
 * @Date: 2024-01-25 15:01:51
 * @email: ztwang6@iflytek.com
 * @LastEditors: ztwang6
 * @LastEditTime: 2024-01-28 16:48:38
 * @Description: 
-->
<template>
  <div class="yjjgjph flex-col">
    <div class="title_content flex-col-center">
      <div class="flex-col-center flex-w-1">
        <p class="lineTitle">预警及告警排行</p>
        <el-select size="mini" v-model="params.type" placeholder="请选择" @change="typeChange">
          <el-option v-for="item in dictGetter.yjgjlx" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="tab">
        <span :class="params.orgType === 'sjbm' ? 'active' : ''" @click="tabClick('sjbm')">市级部门</span>
        <span :class="params.orgType === 'qh' ? 'active' : ''" @click="tabClick('qh')">区划</span>
      </div>
    </div>
    <div class="content flex-h-1">
      <div id="charts"></div>
    </div>
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Yjjgjph',
  computed: {
    ...mapGetters('base/dictList', ['dictGetter']),
  },
  data() {
    return {
      params: {
        type: 'cqslyj',
        orgType: 'sjbm',
      },
    };
  },
  methods: {
    tabClick(val) {
      this.params.orgType = val;
      this.warnAlarmRank();
    },
    typeChange() {
      this.warnAlarmRank();
    },
    /**
     * @description: 预警告警排行
     * @return {*}
     */
    warnAlarmRank() {
      this.$scmp_api.workstand.warnAlarmRank(this.params).then((res) => {
        if (res.data.flag) {
          const xData = [];
          let seriesData = [];
          if (this.params.type === 'cqbjyj' || this.params.type === 'cqslyj') {
            seriesData = [
              {
                name: '红色预警',
                type: 'bar',
                color: '#EF6262',
                data: [],
                barWidth: '8px',
                barGap: 0,
              },
              {
                name: '黄色预警',
                type: 'bar',
                color: '#FFCD6C',
                data: [],
                barWidth: '8px',
                barGap: 0,
              },
            ];
          } else {
            seriesData = [
              {
                name: '告警',
                type: 'bar',
                color: '#DA7AEA',
                data: [],
                barWidth: '16px',
                barGap: 0,
              },
            ];
          }
          res.data.data.forEach((item) => {
            xData.push(item.orgName);
            if (seriesData.length === 2) {
              seriesData[0].data.push(item.red);
              seriesData[1].data.push(item.yellow);
            } else {
              seriesData[0].data.push(item.alarmCount);
            }
          });
          this.initEharts(xData, seriesData);
        } else {
          this.$message.error(res.data.errMsg);
        }
      });
    },
    initEharts(xData, seriesData) {
      this.myChart = this.$Echarts5.init(document.getElementById('charts'));
      this.myChart.clear()
      const option = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data: ['红色预警', '黄色预警', '告警'],
          bottom: 0,
          left: 'center',
          itemWidth: 14,
          itemHeight: 14,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
            },
          },
        ],
        series: seriesData,
      };
      this.myChart.setOption(option);
    },
    resize() {
      this.myChart.resize();
    },
  },
  mounted() {
    this.warnAlarmRank();
  },
};
</script>
  
<style lang="scss" scoped>
.yjjgjph {
  height: 100%;
  .title_content {
    align-items: center;
    /deep/ .el-select {
      width: 120px !important;
      margin-left: 10px;
    }
    .tab {
      span {
        font-size: 14px;
        font-weight: 500;
        color: #666666;
        line-height: 20px;
        padding: 4px 12px;
        cursor: pointer;
        &.active {
          background: rgba(33, 127, 255, 0.1);
          border-radius: 15px;
          color: #217fff;
        }
      }
    }
  }
  .content {
    #charts {
      height: 100%;
    }
  }
}
</style>