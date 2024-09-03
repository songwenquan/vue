
<template>
  <fragment>
    <el-submenu v-if="sub.children && sub.children.length" ref="subMenuRef" :popper-append-to-body="false" :index="sub.menuUrl">
      <template slot="title">
        <!--  添加  sub-el-icon 类收缩时，图标居中 -->
        <i v-if="sub.icon && sub.icon" :class="'sub-el-icon ' + sub.icon"></i>
        <span slot="title" class="fz16">{{ sub.menuName && sub.menuName }}</span>
      </template>
      <subMenu v-for="ch in sub.children" :key="resolvePath(ch.menuUrl)" :sub="ch" :base-path="resolvePath(ch.menuUrl)"></subMenu>
    </el-submenu>
    <!-- 注意 :index ‘’ 多级情况下可能有问题   -->
    <el-menu-item v-else :index="resolvePath('')" class="scmp-menu-item">
      <!--  添加  sub-el-icon 类收缩时，图标居中      -->
      <i v-if="sub.icon && sub.icon" :class="'sub-el-icon ' + sub.icon"></i>
      <span slot="title">{{ sub.menuName && sub.menuName }}</span>
    </el-menu-item>
  </fragment>
</template>

<script>
import { resolve } from 'path';
import { url } from '@utils/regexp';
import { mapState } from 'vuex';

export default {
  name: 'SubMenu',
  props: {
    sub: {
      type: Object,
      default() {
        return {};
      }
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('layout/lr', ['device'])
  },
  methods: {
    isUrl(str) {
      return url.test(str);
    },
    resolvePath(routePath) {
      if (this.isUrl(routePath)) {
        return routePath;
      }
      if (this.isUrl(this.basePath)) {
        return this.basePath;
      }
      routePath = routePath.match(/^\/(.*)/) ? routePath.match(/^\/(.*)/)[1] : routePath;
      return resolve(this.basePath, routePath);
    }
  }
};
</script>

<style scoped lang="scss"></style>
