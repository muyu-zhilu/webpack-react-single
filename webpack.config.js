const webpack = require('webpack');//引入webpack
const path = require('path');//引入nodejs路径模块，处理路径用的
const glob = require('glob');//glob，这个是一个全局的模块，动态配置多页面会用得着
const HtmlWebpackPlugin = require('html-webpack-plugin'); //这个是通过html模板生成html页面的插件，动态配置多页面用得着
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除打包的源文件，再打包，避免文件重复
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//分离css，webpack4推荐的分离css的插件
const autoprefixer = require('autoprefixer');//给css自动加浏览器兼容性前缀的插件
const os = require('os');//这个nodejs模块，会帮助我们获取本机ip
const portfinder = require('portfinder');//这个帮助我们寻找可用的端口，如果默认端口被占用了的话
const fs = require('fs');//处理文件用的

//动态加时间戳,发布不需要刷新浏览器
function stamp(){
  var date = new Date();
  date = Date.parse(date);
  return date;
}

//端口占用动态+1
var ports = fs.readFileSync('./port.json', 'utf8');
ports = JSON.parse(ports);
portfinder.basePort = "3000";
portfinder.getPort(function(err, port) {
    ports.data.port = port;
    ports = JSON.stringify(ports,null,4);
    fs.writeFileSync('./port.json',ports);
});

//获取本机ip
function getIPAdress(){  
  const interfaces = os.networkInterfaces();  
  for(let devName in interfaces){  
      const iface = interfaces[devName];  
      for(let i=0;i<iface.length;i++){  
          const alias = iface[i];  
          if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
              return alias.address;  
          }  
      }  
  }  
} 

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production'

  const webpackConfig = {
    entry: {},
    output:{
      path:path.resolve(__dirname, './dist/'),
      filename:`[name]-${stamp()}.js`
    },
    //设置开发者工具的端口号,不设置则默认为3000端口
    devServer: {
      port: ports.data.port, //端口号
      overlay: true, // 开启错误调试,
      hot: true,  //是否开启hot-module-replacement
      https: false, // 如果需要用https请开启，如http2
      compress:false, //是否启用 gzip 压缩。boolean 为类型，默认为 false
      open: false, // 启动且第一次构建完时自动用你系统上默认的浏览器去打开要开发的网页。
      stats: "errors-only", // 只展示错误信息，避免大量无用日志
      host: getIPAdress()  //获取本机器ip
    },
    module:{
      rules:[
        {
          test:/\.(js|jsx)$/,
          exclude:/node_modules/,
          use: {
            loader: "babel-loader"
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
      new CleanWebpackPlugin(
        ['dist'],　 
        {
          root: __dirname,    　　　　　　　　　　
          verbose: true,    　　　　　　　　　　
          dry:   false    　　　　　　　　　　
        }
      ),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ]
  }

  // 获取指定路径下的入口文件
  function getEntries(globPath) {
    const files = glob.sync(globPath),
    entries = {};
    files.forEach(function(filepath) {
      const split = filepath.split('/');
      const name = split[split.length - 2];
      entries[name] = './' + filepath;
    });
    return entries;
  }
      
  const entries = getEntries('src/**/index.js');
  
  Object.keys(entries).forEach(function(name) {
    webpackConfig.entry[name] = entries[name]; // entry拼接对象键值对
    const plugin = new HtmlWebpackPlugin({
      filename: name + '.html',
      template: './public/index.html',
      inject: true,
      chunks: [name]
    });
    webpackConfig.plugins.push(plugin); //new HtmlWebpackPlugin数组 
  })

  return webpackConfig
};






