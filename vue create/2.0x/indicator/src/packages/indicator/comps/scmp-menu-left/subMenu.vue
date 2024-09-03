/*
* @Author: wqsong2
* @Date: 2023/7/31 16:59
* @Desciption:列表组件
*/
<template>
  <div id="SubMenu" class="SubMenu">
    <el-submenu v-if="sub.children && sub.children.length" ref="subMenuRef" :popper-append-to-body="false" :index="sub.menuUrl">
      <template slot="title">
        <!--  添加  sub-el-icon 类收缩时，图标居中 -->
        <i v-if="sub.icons && sub.icons" :class="'sub-el-icon ' + sub.icons"></i>
        <img v-if="!this.$route.path.includes(sub.menuUrl) && sub.icon !== ''" :src="sub.icon" alt=""/>
        <img v-else-if="this.$route.path.includes(sub.menuUrl) && sub.iconActive !== ''" :src="sub.iconActive" alt=""/>
        <span v-if="!isCollapse" slot="title" class="fz15 ml5">{{ sub.menuName && sub.menuName }}</span>
      </template>
      <subMenu v-for="ch in sub.children" :key="ch.id" :sub="ch"></subMenu>
    </el-submenu>
    <!-- 注意 :index ‘’ 多级情况下可能有问题   -->
    <el-menu-item v-else :index="sub.menuUrl" class="scmp-menu-item">
      <!--  添加  sub-el-icon 类收缩时，图标居中      -->
      <img v-if="this.$route.path !== sub.menuUrl && sub.icon !== ''" :src="sub.icon" alt=""/>
      <img v-else-if="this.$route.path === sub.menuUrl && sub.iconActive !== ''" :src="sub.iconActive" alt=""/>
      <i v-if="sub.icons && sub.icons" :class="'sub-el-icon ' + sub.icons"></i>
      <span v-if="!isCollapse" slot="title" class="fz14 ml5">{{ sub.menuName && sub.menuName }}</span>
    </el-menu-item>
  </div>
</template>

<script>
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
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapState('layout/lr', ['device'])
  },
  mounted(){
    // 由于这种错误只发生在template下只有一个el-submenu这种情况，因此this.$children[0]就是该el-submenu
    this.$children[0].$parent = this.$parent
  }
};
</script>

<style scoped lang="scss">
::v-deep .is-active {
  & > .el-submenu__title {
    background: rgba(4, 98, 240, 0.1);
    color: #0462F0;
  }
}
//修改箭头指向
// 菜单关闭
::v-deep .el-submenu>.el-submenu__title .el-submenu__icon-arrow{
  -webkit-transform: rotateZ(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotateZ(-90deg);
}
// 菜单展开
::v-deep .el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow{
  -webkit-transform: rotateZ(0deg);
  -ms-transform: rotate(0deg);
  transform: rotateZ(0deg);
}
.SubMenu {
  i {
    color: #555;
  }
  .el-submenu__title {
    img{
      width: 25px;
    }
    &:hover {
      color: #0462F0;
      background: rgba(4, 98, 240, 0.1);
      i {
        color: #0462F0;
      }
    }
  }
  .el-menu{
    .el-menu-item {
      &:hover {
        color: #0462F0;
        background: rgba(4, 98, 240, 0.1);
      }
    }
  }
  .el-menu-item.is-active {
    background-color: #eaf0fd;
  }
}
</style>
