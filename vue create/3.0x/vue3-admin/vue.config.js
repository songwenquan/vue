/**
 * @format
 * @Author: wqsong2
 * @Date: 2023/7/12 11:52
 * @Description:配置文件
 */
/* eslint-disable */
const { defineConfig } = require('@vue/cli-service')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Happypack = require('happypack')
const os = require('os')
const happyThreadPool = Happypack.ThreadPool({ size: os.cpus().length })
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
// 根据环境配置相对路径
const baseUrl = process.env.NODE_ENV === 'production' ? '/sqdj/registration' : ''
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true,
  devServer: {
    port: 9090,
    hot: 'only', // 热更新替换，更新页面
    open: false,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    proxy: {
      ...require('./proxy.config')
    },
    devMiddleware: {
      writeToDisk: true
    }
  },
  css: {
    sourceMap: false, // 开启 CSS source maps
    loaderOptions: {
      scss: {
        additionalData: `$baseUrl: "${baseUrl}";`,
        additionalData: '@import "~@/assets/styles/base.scss";'
      },
      less: {
        additionalData: `$baseUrl: "${baseUrl}";`,
        globalVars: {
          hack: 'true; @import "~@/assets/styles/element.less";' // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/assets/styles/color.scss'),
      ]
    }
  },
  chainWebpack: (config) => {
    // 修复HMR
    config.resolve.symlinks(true)
    // 配置别名
    config.resolve.alias
      .set('$public', resolve('public'))
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@store', resolve('src/store'))
    // 引用vue-dompurify-html 代替v-html  防止xss攻击
    config.module.rule('js')
      .test(/\.m?jsx?$/)
      .exclude.clear() // exclude 优先级高于 include,
      .end()
      .include.add(
      path.resolve(__dirname, 'node_modules', 'vue-dompurify-html')
    )
    // 分离源码
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('source-map')
    })
    // 代码压缩
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.devtool(false)
      config.plugin('scmp-compression')
        .use(require('compression-webpack-plugin'), [
          {
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.js$|\.html$|\.json$|\.css$|\.ttf$/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据进行压缩
            minRatio: 0.8, // 压缩率
            deleteOriginalAssets: false // 是否删除源文件
          }
        ])
    })
    // 多线程打包
    config.plugin('happypack').use(Happypack).tap((options) => {
      options[0] = {
        id: 'babel',
        loaders: ['babel-loader?cacheDirectory=true'],
        threadPool: happyThreadPool
      }
      return options
    })
    config.plugin('define').tap((args)=>{
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = JSON.stringify(true)
      return args
    })
    const hRule = config.module.rule('js')
    hRule.test(/\.js$/).include.add(resolve('src')).end()
    hRule.uses.clear()
    hRule.use('happypack/loader?id=babel').loader('happypack/loader?id=babel').end()
  },
  configureWebpack: (config) => {
    // 线上版本
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置
      config.mode = 'production'
      // 移除console
      const plugins = [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              unused: true,  // 是否移除没有引用的代码，默认为`true`
              dead_code: true,  // 是否移除没有执行的代码，默认为`true`
            },
            mangle: true, // 是否混淆代码
            output: {
              beautify: false, // 是否美化代码
              comments: false // 是否删除代码中的注释，默认为`true`
            }
          }
        })
      ]
      config.resolve = {
        ...config.resolve,
        fallback: { path: require.resolve('path-browserify') }
      }
      config.plugins = [...config.plugins, ...plugins]
    }else {
      // 为开发环境修改配置
      config.mode = 'development'
      config.resolve = {
        ...config.resolve,
        fallback: { path: require.resolve('path-browserify') }
      }
      // 多线程优化构建速度
      config.plugins.push(
        new Happypack({
          loaders: ['babel-loader', 'vue-loader'],
          cache: true,
          threads: 3 // 线程数取决于你电脑性能的好坏，好的电脑建议开更多线程
        })
      )
    }
  }
})
