/* eslint-disable no-param-reassign */
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin') // 压缩优化js文件

const resolve = dir => path.join(__dirname, dir)

const [currentCommand] = process.env.npm_lifecycle_event.split(':').slice(-1)
console.log('currentCommand', currentCommand)
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const pagesHashMap = {
  national: {
    index: {
      entry: 'pages/national/main.ts',
      template: 'pages/national/index.html',
      filename: 'index.html'
    }
  },
  international: {
    index: {
      entry: 'pages/international/main.ts',
      template: 'pages/international/index.html',
      filename: 'index.html'
    }
  }
}

const pages = pagesHashMap[currentCommand] || pagesHashMap.national

module.exports = {
  pages,
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 输出文件目录
  outputDir: currentCommand === 'international' ? 'dist/international' : 'dist/national',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  runtimeCompiler: true, // 关键点在这
  // 调整内部的 webpack 配置。
  chainWebpack: config => {
    config.resolve.alias.set('public', resolve('public')).set('pages', resolve('pages'))

    // config.optimization.splitChunks({
    //   chunks: "all",
    //   cacheGroups: {
    //     libs: {
    //       // 把所有 node_modules的模块被不同的 chunk 引入超过 3 次的抽取为 common。
    //       name: "chunk-libs",
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: 10,
    //       chunks: "initial", // initial chunk,
    //       minSize: 0,
    //       maxSize: 1024 * 1024
    //     },
    //     elementUI: {
    //       name: "chunk-elementUI", // split elementUI into a single package
    //       priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //       test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
    //       minSize: 0,
    //       maxSize: 1024 * 1024
    //     },
    //     // echarts: {
    //     //   name: "chunk-echarts", // split echarts into a single package
    //     //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //     //   test: /[\\/]node_modules[\\/]_?echarts(.*)/, // in order to adapt to cnpm
    //     //   minSize: 0,
    //     //   maxSize: 1024 * 1024
    //     // },
    //     commons: {
    //       name: "chunk-commons", // 把所有 src/components 的模块被不同的 chunk 引入超过 3 次的抽取为 common。
    //       test: resolve("src/components"),
    //       minChunks: 3, //  minimum common number
    //       priority: 5,
    //       reuseExistingChunk: true,
    //       minSize: 0,
    //       maxSize: 1024 * 1024
    //     }
    //   }
    // });
  },
  configureWebpack: {
    plugins: [
      // 配置JS在线代码编辑器monaco-editor的辅助文件
      new MonacoWebpackPlugin({
        languages: ['json', 'xml', 'html']
      })
    ]
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true, // 注释css热更新生效
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  // webpack-dev-server 相关配置
  devServer: {
    /* 自动打开浏览器 */
    open: process.platform === 'darwin',
    // host: "test.jdl.cn",
    host: 'test.jdl.com',
    allowedHosts: ['.jd.com', '.jdwl.com', '.jdl.cn', '.jdl.com'],
    port: 80,
    https: false,
    hotOnly: false,
    /* 使用代理 */
    proxy: {
      '/mock': {
        target: 'http://11.51.194.248:3000',
        changeOrigin: true
      },
      // "/": {
      //   target: "http://lcp-platform-uat1.jdl-wly.svc.wlzyxprod.n.jd.local",
      //   changeOrigin: true
      // }

      '/lcp-rest': {
        target:
          'http://lcp-server-rest-devtest.jdl-wly.svc.wlzyxtest.n.jd.local',
        // "http://11.158.5.8:8080",
        changeOrigin: true,
        pathRewrite: { '/lcp-rest': '' }
      },
      '/': {
        target: 'http://11.158.4.153:8080',
        changeOrigin: true
      }
    },
    before: () => {}
  },
  // 第三方插件配置
  pluginOptions: {}
}
