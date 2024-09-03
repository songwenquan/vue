/*
* @Author: wqsong2
* @Date: 2023/7/25 18:16
* @Desciption:总路由
*/
<template>
  <div class="workstand flex-col">
    <Top></Top>
    <div class="content flex-h-1 flex-bet">
      <div class="item flex-col flex-bet">
        <div class="child">
          <Zblb ref="zblb"></Zblb>
        </div>
        <div class="child">
          <Cpph></Cpph>
        </div>
      </div>
      <div class="item flex-col flex-bet">
        <div class="child">
          <Yjjgjph ref="yjjgjph"></Yjjgjph>
        </div>
        <div class="child">
          <Fzcbjlph></Fzcbjlph>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Workstand',
  components: {
    Top: () => import('./comps/top.vue'),
    Cpph: () => import('./comps/cplph.vue'),
    Fzcbjlph: () => import('./comps/fzcbjlph.vue'),
    Zblb: () => import('./comps/zblb.vue'),
    Yjjgjph: () => import('./comps/yjjgjph.vue'),
  },
  data() {
    return {};
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.$refs.zblb.myChart.resize();
      this.$refs.yjjgjph.myChart.resize();
    });
  },
};
</script>

<style lang="scss" scoped>
.workstand {
  height: 100%;
  overflow: hidden;
  .content {
    margin-top: 16px;
    .item {
      width: calc((100% - 16px) / 2);
      .child {
        height: calc((100% - 16px) / 2);
        background: #ffffff;
        padding: 16px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
