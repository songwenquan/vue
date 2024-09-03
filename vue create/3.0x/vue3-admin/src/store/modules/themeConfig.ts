/*
* @Author: wqsong2
* @Date: 2023/12/5 18:07
* @Desciption:next布局配置
*/
export interface stateThemeConfig {
  themeConfig: {
    isDrawer: boolean;
    primary: string;
    topBar: string;
    topBarColor: string;
    isTopBarColorGradual: boolean;
    menuBar: string;
    menuBarColor: string;
    menuBarActiveColor: string;
    isMenuBarColorGradual: boolean;
    columnsMenuBar: string;
    columnsMenuBarColor: string;
    isColumnsMenuBarColorGradual: boolean;
    isColumnsMenuHoverPreload: boolean;
    isCollapse: boolean;
    isUniqueOpened: boolean;
    isFixedHeader: boolean;
    isFixedHeaderChange: boolean;
    isClassicSplitMenu: boolean;
    isLockScreen: boolean;
    lockScreenTime: number;
    isShowLogo: boolean;
    isShowLogoChange: boolean;
    isBreadcrumb: boolean;
    isTagsview: boolean;
    isBreadcrumbIcon: boolean;
    isTagsviewIcon: boolean;
    isCacheTagsView: boolean;
    isSortableTagsView: boolean;
    isShareTagsView: boolean;
    isFooter: boolean;
    isGrayscale: boolean;
    isInvert: boolean;
    isIsDark: boolean;
    isWartermark: boolean;
    wartermarkText: string;
    tagsStyle: string;
    animation: string;
    columnsAsideStyle: string;
    columnsAsideLayout: string;
    layout: string;
    isRequestRoutes: boolean;
    globalTitle: string;
    globalViceTitle: string;
    globalViceTitleMsg: string;
    globalI18n: string;
    globalComponentSize: string;
  };
}
export default {
  state: () : stateThemeConfig => ({
    themeConfig:{
      isDrawer: false,	// 是否开启布局配置抽屉
      //全局主题
      primary: '#409eff',// 默认 primary主题颜色
      isIsDark: false,// 是否开启深色模式
      //顶栏设置
      topBar: '#ffffff',// 默认顶栏导航背景颜色
      topBarColor: '#606266',// 默认顶栏导航字体颜色
      isTopBarColorGradual: false,// 是否开启顶栏背景颜色渐变
      //菜单设置
      menuBar: '#545c64',// 默认菜单导航背景颜色
      menuBarColor: '#eaeaea',// 默认菜单导航字体颜色
      menuBarActiveColor: 'rgba(0, 0, 0, 0.2)', // 默认菜单高亮背景色
      isMenuBarColorGradual: false,// 是否开启菜单背景颜色渐变
      //分栏设置
      columnsMenuBar: '#545c64', // 默认分栏菜单背景颜色
      columnsMenuBarColor: '#e6e6e6',// 默认分栏菜单字体颜色
      isColumnsMenuBarColorGradual: false, // 是否开启分栏菜单背景颜色渐变
      isColumnsMenuHoverPreload: false, // 是否开启分栏菜单鼠标悬停预加载(预览菜单)
      //界面设置
      isCollapse: false, // 是否开启菜单水平折叠效果
      isUniqueOpened: true,// 是否开启菜单手风琴效果
      isFixedHeader: false,// 是否开启固定 Header
      isFixedHeaderChange: false, // 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
      isClassicSplitMenu: false,// 是否开启经典布局分割菜单（仅经典布局生效）
      isLockScreen: false,// 是否开启自动锁屏
      lockScreenTime: 30, // 开启自动锁屏倒计时(s/秒)
      //界面显示
      isShowLogo: false,// 是否开启侧边栏 Logo
      isShowLogoChange: false, // 初始化变量，用于 el-scrollbar 的高度更新，请勿删除
      isBreadcrumb: true, // 是否开启 Breadcrumb，强制经典、横向布局不显示
      isTagsview: true,  // 是否开启 Tagsview
      isBreadcrumbIcon: false, // 是否开启 Breadcrumb 图标
      isTagsviewIcon: false, // 是否开启 Tagsview 图标
      isCacheTagsView: false, // 是否开启 TagsView 缓存
      isSortableTagsView: true, // 是否开启 TagsView 拖拽
      isShareTagsView: false, // 是否开启 TagsView 共用
      isFooter: false, // 是否开启 Footer 底部版权信息
      isGrayscale: false,// 是否开启灰色模式
      isInvert: false, // 是否开启色弱模式
      isWartermark: true, // 是否开启水印
      wartermarkText: 'vue-next-admin', // 水印文案
      //它设置
      tagsStyle: 'tags-style-five', // Tagsview 风格：可选值"<tags-style-one|tags-style-four|tags-style-five>"，
      // 默认 tags-style-five定义的值与 `/src/layout/navBars/tagsView/tagsView.vue` 中的 class 同名
      animation: 'slide-right', // 主页面切换动画：可选值"<slide-right|slide-left|opacitys>"，默认 slide-right
      columnsAsideStyle: 'columns-round',// 分栏高亮风格：可选值"<columns-round|columns-card>"，默认 columns-round
      columnsAsideLayout: 'columns-vertical',  // 分栏布局风格：可选值"<columns-horizontal|columns-vertical>"，默认 columns-horizontal
      //布局切换
      layout: 'defaults',  // 布局切换：可选值"<defaults|classic|transverse|columns>"，默认 defaults
      //后端控制路由
      isRequestRoutes: false, // 是否开启后端控制路由
      //全局网站标题 / 副标题
      globalTitle: 'vue-next-admin', // 网站主标题（菜单导航、浏览器当前网页标题）
      globalViceTitle: 'vueNextAdmin',// 网站副标题（登录页顶部文字）
      globalViceTitleMsg: '专注、免费、开源、维护、解疑', // 网站副标题（登录页顶部文字）
      globalI18n: 'zh-cn', // 默认初始语言，可选值"<zh-cn|en|zh-tw>"，默认 zh-cn
      globalComponentSize: 'large',  // 默认全局组件大小，可选值"<large|'default'|small>"，默认 'large'
    }
  }),
  actions: {
    setThemeConfig({ state, commit }:{state:any,commit:any}, data:stateThemeConfig) {
      console.log(state,data,commit)
    },
  },
}
