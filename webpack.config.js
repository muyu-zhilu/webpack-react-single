const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production'
    
    return {
        entry: [
            "babel-polyfill",
            path.join(__dirname, './src/index.js')
        ],
        output:{
            filename:'main.js',
            globalObject: 'this'
        },
        devServer: {
            port: 3000, //端口号
            overlay: true, // 开启错误调试,
            hot: true,  //是否开启hot-module-replacement
            https: false, // 如果需要用https请开启，如http2
            compress:false, //是否启用 gzip 压缩。boolean 为类型，默认为 false
            open: false, // 启动且第一次构建完时自动用你系统上默认的浏览器去打开要开发的网页。
            stats: "errors-only" // 只展示错误信息，避免大量无用日志
        },
        module: {
            rules: [{
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.worker\.js$/, //以.worker.js结尾的文件将被worker-loader加载
                    use: {
                        loader: 'worker-loader',
                        options: {
                            inline: true,
                            fallback: false
                        }
                    }
                }, 
                {
                    test: /\.html$/,
                    use: [{
                        loader: "html-loader",
                        options: {
                            minimize: true
                        }
                    }]
                },
                {
                    test: /\.css$/,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                              loader: "postcss-loader",
                              options: {
                                    plugins: [
                                        require("autoprefixer") /*在这里添加*/
                                    ]
                              }
                         }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        'less-loader',
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    require("autoprefixer") /*在这里添加*/
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader'
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }),
            // 提供公共代码
            new webpack.optimize.CommonsChunkPlugin('common.js'), // 默认会把所有入口节点的公共代码提取出来,生成一个common.js
            // 提供公共代码
            // 默认会把所有入口节点的公共代码提取出来,生成一个common.js
            // 只提取main节点和index节点
            // new webpack.optimize.CommonsChunkPlugin('common.js',['main','index']), 
        ]
    }
};