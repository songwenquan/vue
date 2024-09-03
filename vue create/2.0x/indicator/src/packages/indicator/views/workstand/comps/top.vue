<template>
  <div class="top flex-bet">
    <div class="item">
      <p class="lineTitle">指标概况</p>
      <div class="content flex-col-center">
        <template v-for="(item, key, index) in infoList">
          <div v-if="index < 4" class="child flex-col-center" :key="key">
            <img :src="item.icon" alt="" />
            <div class="info flex-col flex-w-1">
              <span class="name ell" :title="item.name">{{ item.name }}</span>
              <span class="count ell"
                >{{ item.count }}<span class="unit">{{ item.unit }}</span></span
              >
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="item">
      <p class="lineTitle">预警概况</p>
      <div class="content flex-col-center">
        <template v-for="(item, key, index) in infoList">
          <div v-if="index > 3" class="child flex-col-center" :key="key">
            <img :src="item.icon" alt="" />
            <div class="info flex-col flex-w-1">
              <span class="name ell" :title="item.name">{{ item.name }}</span>
              <span class="count ell"
                >{{ item.count }}<span class="unit">{{ item.unit }}</span></span
              >
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Top',
  data() {
    return {
      infoList: {
        indexCount: {
          icon: require('@indicator/assets/img/workstand/zbs.png'),
          name: '指标数',
          count: '',
          unit: '个',
        },
        ruleCount: {
          icon: require('@indicator/assets/img/workstand/gzs.png'),
          name: '规则数',
          count: '',
          unit: '个',
        },
        templateCount: {
          icon: require('@indicator/assets/img/workstand/yjmbs.png'),
          name: '预警模板数',
          count: '',
          unit: '个',
        },
        ruleExecuteCount: {
          icon: require('@indicator/assets/img/workstand/gzzxs.png'),
          name: '规则执行数',
          count: '',
          unit: '个',
        },
        alarmCount: {
          icon: require('@indicator/assets/img/workstand/gjs.png'),
          name: '告警数',
          count: '',
          unit: '个',
        },
        greenWarnCount: {
          icon: require('@indicator/assets/img/workstand/green.png'),
          name: '绿色预警',
          count: '',
          unit: '个',
        },
        yellowWarnCount: {
          icon: require('@indicator/assets/img/workstand/yellow.png'),
          name: '黄色预警',
          count: '',
          unit: '个',
        },
        redWarnCount: {
          icon: require('@indicator/assets/img/workstand/red.png'),
          name: '红色预警',
          count: '',
          unit: '个',
        },
      },
    };
  },
  methods: {
    /**
     * @description: z指标概况
     * @return {*}
     */
    indexOverview() {
      this.$scmp_api.workstand.indexOverview().then((res) => {
        if (res.data.flag) {
          for (const key in res.data.data) {
            if (Object.hasOwnProperty.call(this.infoList, key)) {
              this.infoList[key].count = res.data.data[key];
            }
          }
        } else {
          this.$message.error(res.data.errMsg);
        }
      });
    },
    /**
     * @description: 预警概况
     * @return {*}
     */
    warnOverview() {
      this.$scmp_api.workstand.warnOverview().then((res) => {
        if (res.data.flag) {
          for (const key in res.data.data) {
            if (Object.hasOwnProperty.call(this.infoList, key)) {
              this.infoList[key].count = res.data.data[key];
            }
          }
        } else {
          this.$message.error(res.data.errMsg);
        }
      });
    },
  },
  mounted() {
    this.indexOverview();
    this.warnOverview();
  },
};
</script>

<style lang="scss" scoped>
.top {
  .item {
    background: #ffffff;
    width: calc((100% - 16px) / 2);
    padding: 16px;
    box-sizing: border-box;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.04);
    .content {
      margin: 35px 0 15px 0;
      .child {
        width: 25%;
        img {
          width: 44px;
          height: 44px;
          margin-right: 22px;
        }
        .info {
          .name {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 19px;
          }
          .count {
            font-size: 25px;
            font-weight: 700;
            color: #333333;
            line-height: 32px;
            .unit {
              font-size: 12px;
              font-weight: 400;
              color: #333333;
              line-height: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
