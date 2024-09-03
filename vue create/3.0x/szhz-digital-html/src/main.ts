import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { installPlugins } from '@/plugins'
const app = createApp(App).use(store).use(router)
// 安装插件
installPlugins(app)
app.mount('#app')
