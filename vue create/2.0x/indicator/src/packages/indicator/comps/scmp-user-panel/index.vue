<template>
  <div class="scmp_user_panel">
    <el-dropdown class="scmp_user_option" @command="handleCommand">
      <span class="el-dropdown-link">
        <el-image class="scmp_user_photo" :src="txSrc" fit="fill" :size="36" @error="txOnError" />
        <span class="scmp_user_name">{{userInfo.name }}</span>
        <span>({{userInfo.roleName}})</span>
        <div class="ml20 tuichu cursor-p" @click="loginOut">
          <img src="~@indicator/assets/img/tuichu.png" alt="" />
          <span>退出</span>
        </div>
        <el-dropdown-menu></el-dropdown-menu>
      </span>
    </el-dropdown>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import {mapState} from 'vuex';
// import { config } from '../../configs/index';
export default {
  name: 'ScmpUserPanel',
  data() {
    return {
      // 根据情况处理
      txSrc: require('../../assets/img/user-icon.png')
      // txSrc: `${config.baseUrl}/getUserPhoto.do` // 头像地址
    };
  },
  computed: {
    ...mapState('auth/user', ['userInfo']),
  },
  methods: {
    // 加载错误时的默认头像
    txOnError() {
      const src = require('../../assets/img/user-icon.png');
      this.txSrc = src;
    },
    /* 登出事件 */
    loginOut() {
      MessageBox.confirm('确认退出？')
          .then(() => {
            this.$emit('loginOut');
          })
          .catch(() => {});
    },
    /* 菜单选择事件 */
    handleCommand(command) {
      switch (command) {
        case 'loginOut':
          this.loginOut();
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.scmp_user_panel {
  color: #fff;
  line-height: 60px;
  text-align: right;
  margin-right: 30px;
  .scmp_user_photo {
    display: inline-block;
    margin-right: 15px;
    height: 32px;
  }
  .scmp_user_name {
    display: inline-block;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .scmp_user_option {
    display: flex;
    justify-content: flex-end;
    margin-left: 40px;
    img {
      vertical-align: middle;
    }
  }
  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      color: #fff;
    }
    .tuichu{
      img{
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
