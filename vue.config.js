const path = require('path');
require('dotenv').config({ path: './.env.local' })

console.log('-----------------------------');
console.log('后端API地址: ' + process.env.VUE_APP_API_URL);
console.log('-----------------------------');
//gzip 压缩
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
//打包分析
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = {
    publicPath: "./",
    productionSourceMap: false, // 生产环境是否生成 SourceMap
    lintOnSave: true,
    runtimeCompiler: true, // 使用构建版vue
    configureWebpack:(config)=>{
        let plugins = [
           new webpack.ProvidePlugin({
             $:"jquery",
             jQuery:"jquery",
             "windows.jQuery":"jquery"
           }),
        ];
    },
    devServer: {
        // open: true,      // 是否浏览器打开
        hotOnly: true, // 当编译失败时，不刷新页面
        compress: true, // 为所服务的一切启用gzip压缩
        // host: '0.0.0.0', // 指定要使用的主机。默认情况下这是localhost。
        port: 8010, // 端口号，
        proxy: {
            "/bs": {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/bs':''
                }
            },
            "/mock": {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                secure: false,
                pathRewrite: {}
            },
            "/system": {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                secure: false,
                pathRewrite: {}
            },
            "/target": {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                secure: false,
                pathRewrite: {}
            },
            "/mpts-manage": {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                secure: false,
                pathRewrite: {}
            }
        }
    },
    css: {},
    chainWebpack: config => {
        config.resolve.alias.set('@mixins', path.join(__dirname, 'src/mixins'));

        if (process.env.NODE_ENV === 'production') {
            //开启gzip压缩 ---部署 nginx 开启gzip命令
            config
                .plugin('compression')
                .use(CompressionPlugin, [{
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                    cache: true
                }]);
            //添加打包分析
            config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{
                analyzerMode: "static"
            }]);
        }
    },
    transpileDependencies: ["major-gantt"]
}