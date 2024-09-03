/*
* @Author: wqsong2
* @Date: 2023/12/5 18:04
* @Desciption:defaults布局
*/
<template>
  <el-container class="layout-container">
    <LayoutAside />
    <el-container class="layout-container-view h100">
      <el-scrollbar ref="layoutScrollbarRef" class="layout-backtop">
        <LayoutHeader />
        <LayoutMain ref="layoutMainRef" />
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.defaults{

}
</style>
