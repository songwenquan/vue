/*
* @Author: wqsong2
* @Date: 2023/7/31 16:59
* @Desciption:公共配置 左侧列表
*/
<template>
  <el-menu ref="ELMENU" class="scmp-menu" :mode="mode" :collapse="isCollapse" :default-active="activeMenu" :collapse-transition="false"
           @select="handleSelect">
    <!-- 使用 url 作为 key值，而不是使用 id， base-path 用于后面拼接 url-->
    <SubMenu :isCollapse="isCollapse" v-for="menuItem in filteredNavs" :key="menuItem.id + menuItem.menuUrl" :sub="menuItem" :base-path="menuItem.menuUrl"></SubMenu>
  </el-menu>
</template>

<script>
export default {
  name: 'ScmpMenuLeft',
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
    // 计算当前激活的叶子节点
    activeMenu() {
      const { meta, path} = this.$route;
      const activePath = path
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return activePath;
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
      if(index === 'collapse') return
      let item = '';
      if (index) {
        item = this.findItemByUrl(this.menuArray, index , {});
      }
      this.activeIndex = index;
      this.$emit('nav-item-select', index, item.openType);
    },
    // 过滤隐藏菜单
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
    },
    findItemByUrl (array, url , matchLast) {
      for (let i = 0; i < array.length; i++) {
        if (url.indexOf(array[i].menuUrl) > -1) {
          if(!matchLast.url || matchLast.url.length < array[i].menuUrl.length){
            matchLast = array[i]
          }
        }
        if (array[i].children && array[i].children.length > 0) {
          const item = this.findItemByUrl(array[i].children, url , matchLast);
          if (!matchLast.url || matchLast.url.length < item.menuUrl.length) {
            matchLast = item;
          }
        }
      }
      return matchLast;
    },
  }
};
</script>

<style scoped lang="less">
.scmp-menu {
  margin-top: 6px;
  border-right: none;
  flex: 1;
  height: 0;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0.1);
    -webkit-border-radius: 0;
  }
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px
  }
  &::-webkit-scrollbar-thumb {
    height: 3px;
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.15);
    -webkit-border-radius: 6px;
    outline-offset: -2px;
    filter: alpha(opacity=50);
    -moz-opacity: 0.5;
    -khtml-opacity: 0.5;
    opacity: 0.5
  }
  &::-webkit-scrollbar-thumb:hover {
    height: 5px;
    background-color: rgba(0, 0, 0, 0.2);
  }
}
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
