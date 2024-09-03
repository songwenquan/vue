/*
* @Author: wqsong2
* @Date: 2023/12/5 16:10
* @Desciption:左侧菜单右侧主体布局
*/
<template>
  <div class="BL-NEXT">
    <component :is="layouts[themeConfig.layout]" />
  </div>
</template>
<script lang="ts" setup name="layout">
import { onBeforeMount, onUnmounted, defineAsyncComponent, reactive, toRefs} from 'vue';
import {useStoreState} from '@/store/vuex'
import { Local } from '@/utils/cookies';
import mittBus from "@/utils/utils";
const layouts: any = {
  defaults: defineAsyncComponent(() => import('@/layouts/main/defaults.vue')),
  classic: defineAsyncComponent(() => import('@/layouts/main/classic.vue')),
  transverse: defineAsyncComponent(() => import('@/layouts/main/transverse.vue')),
  columns: defineAsyncComponent(() => import('@/layouts/main/columns.vue')),
};
// 定义变量内容
// 获取themeConfig store-state-themeConfig
const {themeConfig} = toRefs(reactive(useStoreState('themeConfig',['themeConfig'])))

// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
  if(!Local.get('oldLayout')){
    Local.set('oldLayout', themeConfig.value.layout);
  }
  const clientWidth = document.body.clientWidth;
  if (clientWidth < 1000) {
    themeConfig.value.isCollapse = false;
    mittBus.emit('layoutMobileResize', {
      layout: 'defaults',
      clientWidth,
    });
  }else {
    mittBus.emit('layoutMobileResize', {
      layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
      clientWidth,
    });
  }
}
// 页面加载前
onBeforeMount(() => {
  onLayoutResize();
  window.addEventListener('resize', onLayoutResize);
});
// 页面卸载时
onUnmounted(() => {
  window.removeEventListener('resize', onLayoutResize);
});
</script>
<style scoped lang="scss">
.BL-NEXT{

}
</style>
