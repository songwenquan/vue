/*
* @Author: wqsong2
* @Date: 2023/7/25 18:16
* @Desciption:面包屑
*/
<template>
  <div class="breadCrumb fw-b bf">
    <el-breadcrumb class="app-breadcrumb border-box shadow-box fz15 pl15" separator-class="el-icon-arrow-right">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="`${index}${item.menuName}`">
          <span :class="index === levelList.length - 1 ? '' : 'bread-f'" class="no-redirect">{{
              matched.menuName
            }}</span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as pathToRegexp from 'path-to-regexp'
export default {
  name: 'breadCrumb',
  data() {
    return {};
  },
  computed: {
    ...mapState('auth/menu', ['levelList', 'matched']),
  },
  methods: {
    pathCompile(path) {
      const { params } = this.$route;
      const toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item){
      const { redirect, menuUrl } = item;
      if (redirect) {
        this.$router.push(redirect);
        return
      }
      this.$router.push(this.pathCompile(menuUrl));
    }
  },
};
</script>

<style scoped lang="scss">
.breadCrumb {
  width: 100%;
  height: 50px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-bottom: 16px;
  .app-breadcrumb {
    line-height: 50px;
  }
}
</style>
