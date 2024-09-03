<template>
  <el-menu
      ref="ELMENU"
      class="scmp-menu"
      :mode="mode"
      :background-color="bc"
      :text-color="tc"
      :active-text-color="atc"
      :collapse="isCollapse"
      :default-active="activeMenu"
      :hover-background="hbc"
      @select="handleSelect"
  >
    <!-- 使用 url 作为 key值，而不是使用 id， base-path 用于后面拼接 url-->
    <SubMenu v-for="menuItem in filteredNavs" :key="menuItem.menuUrl" :sub="menuItem" ></SubMenu>
  </el-menu>
</template>

<script>
import { handleAuthMenu, pathSlashFindActiveItem } from '@utils/arithmetic';
export default {
  name: 'ScmpMenu',
  components: {
    SubMenu: () => import('./subMenu')
  },
  props: {
    menuArray: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'vertical'
    },
    isRoute: {
      type: Boolean,
      default: false
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    bc: {
      type: String,
      default: '#1558C9'
    },
    hbc: {
      type: String,
      default: '#1558C9'
    },
    tc: {
      type: String,
      default: '#fff'
    },
    atc: {
      type: String,
      default: '#ffd04b'
    },

    activeIdx: {
      type: String,
      default: ''
    },
    clearTop: {
      type: Boolean,
      default: false
    },
    subMenuClassName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeIndex: {
        type: String,
        default: ''
      }
    };
  },
  computed: {
    filteredNavs() {
      return this.filterNavs(this.menuArray);
    },
    // 查看当前路由变化
    routes() {
      return this.$router.options.routes;
    },
    /*
     * 计算当前激活的叶子节点
     * pengliu9<pengliu9@iflytek.com>
     * 2020-06-18  22:27:11
     * */
    activeMenu() {
      const { meta, path } = this.$route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      if (this.menuArray.length) {
        const menuArr = this.menuArray.map(item => handleAuthMenu(item, '/'));
        const activeItems = pathSlashFindActiveItem({ url: '', items: menuArr }, path);
        /*
         * 1. 找不到匹配的 item
         * 2. 找到的 item 为 非叶子节点
         * */
        if (!activeItems || (activeItems.children && activeItems.children.length > 0)) {
          return '';
        }
        return activeItems.url;
      }
      return '';
    }
  },
  watch: {
    activeIdx(value) {
      this.activeIndex = value;
      this.$refs.ELMENU.activeIndex = this.activeIndex;
    }
  },
  methods: {
    // indexPath, item
    handleSelect(index) {
      this.activeIndex = index;
      this.$emit('nav-item-select', index);
    },
    filterNavs(menuArray) {
      return menuArray.filter(nav => {
        const children = nav.children;
        if (children && children.length) {
          nav.children = this.filterNavs(children);
        }
        if (nav.meta) {
          return !nav.meta.hidden;
        } else {
          return true;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
::v-deep .el-menu--collapse .el-tooltip {
  line-height: 56px;
}
// IE 闪
::v-deep .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  /*transform: rotate(100deg)*/
  transform: none;
}
::v-deep .el-menu--popup-bottom-start {
  margin-top: 0px;
}
::v-deep .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: #065caf !important;
}
</style>
