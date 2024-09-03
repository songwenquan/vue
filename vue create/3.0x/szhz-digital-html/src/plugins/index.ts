/*
* @Author: wqsong2
* @Date: 2023/6/19 12:04
* @Description:安装插件
*/
import ElementPlus from 'element-plus'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import * as icons from '@element-plus/icons-vue'

export function installPlugins (app:any) {
  app.use(ElementPlus, {
    locale: zhLocale,
    size: 'small'
  })
  // 安装图标库
  for (const icon in icons) {
    app.component(icon, (icons as any)[icon])
  }
}
