/*
* @Author: wqsong2
* @Date: 2023/7/25 16:59
* @Desciption:公共配置 左侧列表 右侧内容
*/
<template>
  <el-container class="main_container">
    <el-header class="main_header">
      <ScmpHeader>
        <i slot="icon" class="title_icon mr10"></i>
        <span slot="text" class="title_text fz18 cf">杭州政务服务一网通办监测预警平台</span>
      </ScmpHeader>
      <ScmpUserPanel @loginOut="actLogout"></ScmpUserPanel>
    </el-header>
    <el-container class="main_content flex flex-h-1">
      <el-aside :width="isCollapse ? '64px' : '220px'" v-if="isAside">
        <ScmpMenuLeft :menu-array="menuArray" @nav-item-select="menuItemSelect" :isCollapse="isCollapse"></ScmpMenuLeft>
        <div
          class="collapse fz14 c3 cursor-p pl20"
          :style="{ width: isCollapse ? '64px' : '220px' }"
          @click="isCollapse = !isCollapse"
        >
          <i :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
          <span class="tl ml10" v-show="!isCollapse">收起菜单</span>
        </div>
      </el-aside>
      <el-main v-if="showFlag" class="main_primary">
        <!--需要缓存的页面-->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <!--不需要缓存的页面-->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
export default {
  name: 'BLTCB',
  components: {
    ScmpUserPanel: () => import('../comps/scmp-user-panel'),
    ScmpHeader: () => import('../comps/scmp-header'),
    ScmpMenuLeft: () => import('../comps/scmp-menu-left'),
  },
  data() {
    return {
      isCollapse: false,
      activeIdx: '',
      subMenuClassName: 'clear-top-drop-dowm',
      levelList: [],
      showFlag:false
    };
  },
  computed: {
    isAside() {
      return !this.$route.meta.isHideAside;
    },
    ...mapState('auth/menu', {
      menuArray: 'menu',
    }),
    ...mapGetters('auth/user', ['userNameGetter', 'userLoginNameGetter', 'userMobilePhoneGetter', 'userPhotoGetter']),
    key() {
      return new Date().getTime();
    },
  },
  async created() {
    await this.getDicList();
    this.showFlag = true;
  },
  methods: {
    ...mapActions('base/dictList', ['getDicList']),
    ...mapActions('auth/user', {
      actLogout: 'ACT_Logout',
    }),
    ...mapActions('auth/menu', {
      selectMenuItem: 'ACT_SelectMenuItem',
    }),
    ...mapActions('auth/menu', ['ACT_SetlevelList', 'ACT_SetMatched']),
    menuItemSelect(val, openType) {
      if (openType === '2') {
        window.open(val);
      } else {
        this.$router.push(val);
      }
    },
    // 存储面包屑导航数据
    levelListFunc() {
      const { path } = this.$route;
      this.menuArray.map((item) => {
        if (item.menuUrl === path) {
          this.levelList = item;
          item.show = true;
          // 存储当前节点名称
          this.ACT_SetMatched({ menuName: item.menuName, menuUrl: item.menuUrl });
        } else {
          item.show = '';
          this.menuArrayChildren(item, item.children, path);
        }
      });
      // 数据处理  如果多级菜单 递归获取父级
      if (this.levelList.show !== true) {
        const parentDirectory = this.levelListChild(this.menuArray, path);
        // 根据url匹配  重新赋值name以及赋值路由中部分字段
        parentDirectory.map((item) => {
          this.$route.matched.map((items) => {
            if (item.menuUrl === items.path) {
              item.redirect = items.redirect;
            } else {
              this.menuNameChild(item, items.children, 'path', 'redirect');
            }
          });
          // 因菜单和路由名称可能存在变差  故取菜单数据进行赋值
          this.menuArray.map((items) => {
            if (items.menuUrl === item.menuUrl) {
              item.menuName = items.menuName;
            } else {
              this.menuNameChild(item, items.children, 'menuUrl', 'menuName');
            }
          });
        });
        this.ACT_SetlevelList(parentDirectory);
      } else {
        this.ACT_SetlevelList([{ menuUrl: this.levelList.menuUrl, menuName: this.levelList.menuName }]);
      }
    },
    menuArrayChildren(item, children, path) {
      children.map((items) => {
        if (items.menuUrl === path) {
          items.show = true;
          this.levelList = item;
          // 存储当前节点名称
          this.ACT_SetMatched({ menuName: items.menuName, menuUrl: items.menuUrl });
        } else {
          items.show = '';
          this.menuArrayChildren(item, items.children, path);
        }
      });
    },
    levelListChild(tree, nodeId) {
      if (tree) {
        const { childList = 'children', menuUrl = 'menuUrl' } = {};
        const toFlatArray = (tree, parentId) => {
          return tree.reduce((t, _) => {
            const child = _[childList];
            return [
              ...t,
              parentId ? { ..._, parentId } : _,
              ...(child && child.length ? toFlatArray(child, _[menuUrl]) : []),
            ];
          }, []);
        };
        const getIds = (flatArray) => {
          let ids = [{ menuUrl: nodeId }];
          let child = flatArray.find((_) => _[menuUrl] === nodeId);
          while (child && child.parentId) {
            ids = [{ menuUrl: child.parentId }, ...ids];
            child = flatArray.find((_) => _[menuUrl] === child.parentId);
          }
          return ids;
        };
        return getIds(toFlatArray(tree));
      }
    },
    menuNameChild(item, children, key, code) {
      if (children && children.length) {
        children.map((items) => {
          if (item.menuUrl === items[key]) {
            item[code] = items[code];
          } else {
            this.menuNameChild(item, items.children, key, code);
          }
        });
      }
    },
  },
  watch: {
    $route: {
      handler(val) {
        this.levelListFunc();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.main_container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .main_header {
    display: -webkit-box;
    padding: 0 !important;
    background: #1558c9 url('~@indicator/assets/img/banner.png') no-repeat right center;
    width: 100%;
    justify-content: space-between;
  }
  .title_icon {
    width: 30px;
    height: 30px;
    background: url('~@indicator/assets/img/logo.png') no-repeat;
    background-size: 100% 100%;
  }
  .el-aside {
    display: flex;
    flex-direction: column;
    margin-right: 3px;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    .collapse {
      position: fixed;
      bottom: 0;
      line-height: 48px;
      background-color: #f7f8f9;
      box-sizing: border-box;
      span {
        width: 100%;
      }
    }
  }
  .main_primary {
    padding: 15px;
    background-color: #eef4fb;
    display: flex;
    flex-direction: column;
  }
}
</style>
