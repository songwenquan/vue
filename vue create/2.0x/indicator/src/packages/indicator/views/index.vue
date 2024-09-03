/*
* @Author: wqsong2
* @Date: 2023/7/25 18:16
* @Desciption:总路由
*/
<template>
  <div class="index flex-col main-wrap">
    <!--菜单导航-->
    <breadcrumb v-if="!nobread"/>
    <div class="view-wrap border-box flex-h-1">
      <router-view/>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/bread-crumb';
export default {
  name: "index",
  components: {
    breadcrumb,
  },
  data() {
    return {
      nobread: false,
    }
  },
  mounted() {
    if (this.$route.meta && this.$route.meta.nobread === true) {
      this.nobread = true;
    } else {
      this.nobread = false;
    }
  },
  watch: {
    '$route': {
      handler(newVal, oldVal) {
        if (newVal.meta && newVal.meta.nobread === true) {
          this.nobread = true;
        } else {
          this.nobread = false;
        }
      }
    },
    deep: true
  }
}
</script>

<style scoped lang="scss">
.main-wrap{
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
