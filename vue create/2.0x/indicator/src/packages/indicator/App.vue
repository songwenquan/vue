/*
* @Author: wqsong2
* @Date: 2023/7/25 16:59
* @Desciption:主入口
*/
<template>
  <div v-cloak id="app">
    <component :is="'BL-' + layout"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    'BL-TCB': () => import('./layouts/BL-TCB'),
    'BL-FULL': () => import('./layouts/BL-FULL')
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('auth/menu', ['GTT_MenuFirstLeaf']),
    ...mapState('auth/user', ['userInfo']),
    ...mapState('layout/ly', ['layout']),
  },
  mounted() {
    if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
      if (window.addEventListener) {
        window.addEventListener(
            'hashchange',
            () => {
              const currentPath = window.location.hash.slice(1);
              if (this.$route.path !== currentPath) {
                this.$router.push(currentPath);
              }
            },
            false
        );
      } else if (window.attachEvent) {
        window.attachEvent('onhashchange', () => {
          const currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        });
      }
    }
  },
  watch: {
    '$route' (to, from) {
      // 路由发生变化页面刷新
      if(!this.userInfo.employeeCode && process.env.NODE_ENV !== 'development'){
        this.$router.push('/login');
      }
    }
  },
};
</script>

<style scoped lang="scss"></style>
