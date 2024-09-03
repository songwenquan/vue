/*
* @Author: wqsong2
* @Date: 2023/7/25 16:59
* @Desciption:主页面结构配置无头部 侧边栏
*/
<template>
  <div class="FULL">
    <el-main class="main">
      <router-view :key="key" />
    </el-main>
  </div>
</template>

<script>
export default {
  name: 'BLFULL',
  components: {},
  data() {
    return {};
  },
  computed: {
    key() {
      return new Date().getTime();
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
::v-deep .el-main{
  padding: 0px;
  height: 100%;
}
.FULL{
  height: 100vh;
}
</style>
