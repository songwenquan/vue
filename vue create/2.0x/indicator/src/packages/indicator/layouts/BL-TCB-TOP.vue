/*
* @Author: wqsong2
* @Date: 2023/7/25 16:59
* @Desciption:公共配置 头部列表 右侧内容
*/
<template>
  <el-container class="main_container">
    <el-header class="main_header">
      <ScmpHeader>
        <i slot="icon" class="title_icon"></i>
        <span slot="text" class="title_text">杭州政务服务一网通办监测预警平台</span>
      </ScmpHeader>
      <div class="nav">
        <ScmpMenu
          class="menu"
          :menu-array="menuArray"
          mode="horizontal"
          bc="#1558C9"
          atc="#fff"
          tc="#fff"
          :sub-menu-class-name="subMenuClassName"
          @nav-item-select="selectMenuItem"
        ></ScmpMenu>
      </div>
      <ScmpUserPanel  @loginOut="actLogout"></ScmpUserPanel>
    </el-header>
    <el-container class="main_content">
      <el-main class="main_primary">
        <router-view :key="key" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
export default {
  name: 'BLTCBTOP',
  components: {
    ScmpUserPanel: () => import('../comps/scmp-user-panel'),
    ScmpHeader: () => import('../comps/scmp-header'),
    ScmpMenu: () => import('../comps/scmp-menu')
  },
  data() {
    return {
      activeIdx: '',
      subMenuClassName: 'clear-top-drop-dowm'
    };
  },
  computed: {
    ...mapState('auth/menu', {
      menuArray: 'menu'
    }),
    ...mapGetters('auth/user', ['userNameGetter', 'userLoginNameGetter', 'userMobilePhoneGetter', 'userPhotoGetter']),
    key() {
      return new Date().getTime();
    }
  },
  methods: {
    ...mapActions('auth/user', {
      actLogout: 'ACT_Logout'
    }),
    ...mapActions('auth/menu', {
      selectMenuItem: 'ACT_SelectMenuItem'
    })
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-submenu__title i{
  color: #ffffff;
}
.main_container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.main_header {
  display: flex;
  z-index: 2;
  padding: 0 !important;
  background: #1558C9 url('~@indicator/assets/img/banner.png') no-repeat right center;
  position: fixed;
  width: 100%;
}
.main_content {
  flex: 1;
  overflow-y: auto;
}
.main_primary {
  padding: 0;
  //FIXME: 临时
  padding-top: 60px;
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;
}
.title_icon {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  width: 30px;
  height: 30px;
  background: url('~@indicator/assets/img/logo.png') no-repeat;
  background-size: 100% 100%;
}
.title_text {
  color: #fff;
  font-size: 18px;
}

.nav {
  width: calc(100% - 460px);
  .scrollbar {
    width: 100%;
  }
  .menu {
    display: flex;
  }
}
</style>
