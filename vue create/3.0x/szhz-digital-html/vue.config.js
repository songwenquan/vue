const { defineConfig } = require('@vue/cli-service')
const { CompressionWebpackPlugin } = require('compression-webpack-plugin') // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 打包分析
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV) //
const path = require('path') // 引入path模块
const resolve = (dir) => path.join(__dirname, dir)

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/', // 配置基本url5+
  outputDir: resolve('dist'), // 输出文件目录
  indexPath: 'index.html', // 相对于打包路径index.html的路径
  assetsDir: 'static', // 静态资源目录 (js, css, img, fonts)
  filenameHashing: false, // 给静态资源添加一个hash，默认为ture添加，，以便更好的控制缓存
  lintOnSave: true, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // 向 PWA 插件传递选项。
  chainWebpack: config => {
    config.resolve.symlinks(true) // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin('html').tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = 'none'
      return args
    })
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'))
      .set('@plugins', resolve('src/plugins'))
      .set('$public', resolve('public'))
    // 压缩图片
    config.module.rule('images')
      .exclude.add(resolve('src/assets/icons'))// 排除icons目录，这些图标已用 svg-sprite-loader 处理，打包成 svg-sprite 了
      .end().use('url-loader')
      .tap(options => ({
        limit: 10240, // 稍微改大了点
        fallback: {
          loader: require.resolve('file-loader'),
          options: { // 在这里修改file-loader的配置直接把outputPath的目录加上，虽然语义没分开清晰但比较简洁
            name: 'static/img/[name].[hash:8].[ext]',
            esModule: false, //低版本默认为false，高版本默认为true 这里为6.2.0为高本版本所以要手动设置为false
          }
        }
      }))
      .end().use('image-webpack-loader').loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 60 }, // JPG 输出的质量 一般60为可接受的
        optipng: { enabled: false },
        pngquant: { quality: [0.5, 0.65], speed: 4 },// PNG 质量范围
        gifsicle: { interlaced: false },// 优化GIF
        webp: { quality: 75 }// 转换为 webp
      })
    // 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
  }
})
