/*
* @Author: wqsong2
* @Date: 2023/8/4 18:15
* @Desciption:列表公共头部
*/
<template>
  <div class="tableTitle mb10">
    <span class="table-title">{{matched.menuName}}列表</span>
    <div v-if="showRightBtn" class="right-btn" @click="$emit('rightBtnClick')">
      <slot name="rightBtn"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "tableTitle",
  props:{
    matched: {
      // 附加入参
      type: Object,
      default: () => {
        return {};
      },
    },
    showRightBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.tableTitle {
  display: flex;
  justify-content: space-between;
  line-height: 30px;
}
</style>
