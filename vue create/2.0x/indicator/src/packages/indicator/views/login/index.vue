<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-09-12 09:33:02
 * @LastEditors: ztwang6
 * @LastEditTime: 2024-02-19 16:40:30
 * @FilePath: \szys-business-environment\src\packages\business\views\login\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
/*
* @Author: wqsong2
* @Date: 2023/7/25 18:23
* @Desciption:扫码登录
*/
<template>
  <div v-if="show" class="login">
    <iframe ref="iframe" class="iframe" :src="src" />
  </div>
</template>

<script>
import baseForm from '$public/config.json';
import store from '@indicator/stores';
import dd from 'gdt-jsapi';
export default {
  name: 'login',
  data() {
    return {
      show: false,
    };
  },
  computed: {
    src() {
      if (process.env.NODE_ENV === 'production') {
        if (window.location.href.includes('10.54.38.156:8801') || window.location.href.includes('10.54.21.201:8801')) {
          return baseForm.zyddSrc;
        } else {
          return baseForm.zzdSrc;
        }
      } else {
        return baseForm.zyddSrc;
      }
    },
  },
  watch: {
    $route(to, from) {
      // 路由发生变化页面刷新
      this.$router.go(0);
    },
  },
  methods: {
    // 判断是否存在子集url
    async children(menus) {
      return menus[0].children.length > 0 ? this.children(menus[0].children) : menus[0].menuUrl;
    },
  },
  mounted() {
    dd.getAuthCode({})
      .then(async () => {
        if(this.$route.query.showQrCode){
          throw new Error("获取用户失败显示扫码页面")
        }
        const menus = await store.dispatch('auth/menu/ACT_GetMenu');
        if (menus.flag === true) {
          if (menus.menu.length > 0) {
            const url = await this.children(menus.menu);
            this.$router.push({
              path: url,
            });
          } else {
            this.$message.warning('暂无菜单权限', 3000);
          }
        }
      })
      .catch(() => {
        this.show = true;
        const that = this;
        window.addEventListener('message', function (event) {
          if (event.data.code) {
            that.$scmp_api.auth
              .callback({ code: event.data.code })
              .then(async (res) => {
                if (res.data.flag) {
                  const menus = await store.dispatch('auth/menu/ACT_GetMenu');
                  if (menus.flag === true) {
                    if (menus.menu.length > 0) {
                      const url = await that.children(menus.menu);
                      that.$router.push({
                        path: url,
                      });
                    } else {
                      that.$message.warning('暂无菜单权限', 3000);
                    }
                  } else {
                    that.$refs.iframe.contentWindow.location.href = that.$refs.iframe.src;
                    that.$message.warning(menus.msg, 3000);
                  }
                } else {
                  that.$message.warning(res.data.errMsg, 3000);
                }
              })
              .catch(() => {
                that.$message.error('数据获取失败', 3000);
              });
          }
        });
      });
  },
};
</script>

<style scoped lang="scss">
.login {
  background: url('~@indicator/assets/img/login/login.png') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  display: flex;
  .iframe {
    padding: 24px;
    border: none;
    background-color: #ffffff;
    box-shadow: 0px 2px 20px rgba(159, 177, 200, 0.24);
    height: 350px;
    width: 380px;
    margin-right: 200px;
    border-radius: 20px;
  }
}
</style>
