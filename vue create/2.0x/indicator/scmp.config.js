const path = require('path')

module.exports = {
    pluginOptions: {
        scmp: {
            entries: [
                'indicator',
            ],
            buildOptions: {
                isTargetToZip: true, // 是否打包为zip
                cleanDist: true,// 构建时是否清空 outputDir
                // 默认publicPath前缀，构建时 publicPath 会被计算为 defaultPublicPrefix + entryName
                // 如当 defaultPublicPrefix为'scmp-ds', 入口为'chu-zhou/city-health-insurance'，则 publicPath 为 scmp-ds/chu-zhou/city-health-insurance
                defaultPublicPrefix: 'scmp-ds',
                // 适用于特殊场景，用于指定特定服务的 publicPath
                // 如为 'chu-zhou/city-health-insurance' 服务项指定 publicPath 为， /city-health-insurance/rest
                specialPublicPath:{
                    'indicator': '/indicator/',
                },
                // scmp 构建时 OutputPath 会被计算为 cli配置的 outputDir + entryName, 如当入口为'chu-zhou/city-health-insurance'，则 OutputPath 为 dist/chu-zhou/city-health-insurance
                // 使用 specialOutputPath，为特定服务指定 outputPath, 以根目录为基准
                specialOutputPath: {
                    'indicator': 'dist/indicator'
                },
                prodSourceMap: false      // production 模式开启 sourcemap ，方便调试
            }
        }
    },
    css: {
        sourceMap: true,  // 开启 CSS source maps?
        //  less 脚本编译
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true
                },
            },
            sass: {
                // sass-loader 打包的时候，会将 /*no*/ /*px*/注释掉
                sassOptions: {
                    outputStyle: 'expanded'
                }
            }
        }
    },
    chainWebpack(config) {
        config.resolve.alias.clear().merge(require('./aliases.config').webpack)
        config.externals([
            {
                jquery: 'jquery'
            },
        ])
        config.module.rule('js')
            .test(/\.m?jsx?$/)
            .exclude.clear() // exclude 优先级高于 include,
            .end()
            .include.add(path.resolve(__dirname, 'node_modules', 'element-ui'))
            .add(path.resolve(__dirname, 'node_modules', 'vue-fragment'))
            .add(path.resolve(__dirname, 'node_modules', 'vue-dompurify-html'))
            .add(path.resolve(__dirname, 'src'))
            .add(path.resolve(__dirname, 'public'))

        config.when(process.env.NODE_ENV === 'development', config => {
            config.devtool('source-map');
        })

        config.when(process.env.NODE_ENV === 'production', config => {
            config.devtool(false);
            config.plugin('scmp-compression').use(require('compression-webpack-plugin'), [{
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.html$|\.json$|\.css$|\.ttf$/,
                threshold: 0,
                minRatio: 0.8,
                deleteOriginalAssets: false
            }])
        })
    },
    devServer: {
        quiet: false,
        // 关闭host check，方便使用ngrok之类的内网转发工具
        disableHostCheck: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        proxy: {
            ...require('./proxy.config')
        },
        writeToDisk: true
    }
}
