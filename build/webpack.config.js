// webpack.config.js

//引入核心内置模块path,用户获取文件路径等
const path = require('path')

// webpack打包出来的js文件我们需要引入到html中，但是每次我们都手动修改js文件名显得很麻烦
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 打包输出前清空dist文件夹
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

// 把css样式从js文件中提取到单独的css文件中｜拆分css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 解析.vue文件
const vueLoaderPlugin = require('vue-loader/lib/plugin')

const Webpack = require('webpack')

const devMode = process.argv.indexOf('--mode=production') === -1

module.exports = {
  /**
  * 设置模式：
  * development开发环境
  * production生产模式 
  * 默认值为production 
  * 也可以设置为none
  * */
  mode: 'development',
  /**
  * 设置入口文件路径
  * path.resolve()由相对路径计算出绝对路径
  * __dirname是当前模块的目录名
  * */
  // entry: {
  //   main: path.resolve(__dirname, '../src/main.js'), // 入口文件1
  //   header: path.resolve(__dirname, '../src/header.js') // 入口文件2
  // },
  // entry: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')],
  entry: path.resolve(__dirname, '../src/main.js'),
  output: {
    // filename: 'output.js', // 打包后的文件名称
    filename: '[name].[hash:8].js', // 打包后的文件名称｜为了缓存
    path: path.resolve(__dirname, '../dist') // 打包后的目录
  },
  // 配置webpack-dev-server进行热更新
  // 配置开发服务器
  devServer: {
    // 设置端口号
    port: 7777,
    // 开启热更新
    hot: true,
    // 告诉服务器内容来源
    static: {
      directory: path.join(__dirname, 'dist'),
    }
    // contentBase: path.join(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 设置模板
      template: path.resolve(__dirname, '../public/index.html'),
      // 多入口文件配置
      filename: 'index.html',
      chunks: ['main'] // 与入口文件对应的模块名
    }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../public/header.html'),
    //   filename: 'header.html',
    //   chunks: ['header'] // 与入口文件对应的模块名
    // }),
    new CleanWebpackPlugin(),
    // 从js中分离出css
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    new vueLoaderPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  ],
  module: {
    // 配置模块规则
    rules: [
      {
        //正则匹配所有.css结尾的文件
        test: /\.css$/,
        //匹配到之后使用的loader,从有向左解析
        // use: [
        //   'vue-style-loader', 
        //   // 'style-loader', 
        //   MiniCssExtractPlugin.loader,
        //   'css-loader',
        //   'postcss-loader'
        //   // {
        //   //   loader: 'postcss-loader',
        //   //   options: {
        //   //     postcssOptions: {
        //   //       plugins: [require('autoprefixer')]
        //   //     }
        //   //   }
        //   // }
        // ]
        use: [{
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../dist/css/',
            hmr: devMode
          }
        },
          'css-loader',
          'postcss-loader'
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     postcssOptions: {
          //       plugins: [require('autoprefixer')]
          //     }
          //   }
          // }
        ]
      },
      {
        test: /\.less$/,
        // use: ['style-loader', 'css-loader', 'less-loader'] // 从右向左解析原则
        // use: [
        //   // 'style-loader', 
        //   MiniCssExtractPlugin.loader,
        //   'css-loader', 
        //   'postcss-loader', 
        //   'less-loader'] // 从右向左解析原则｜为css添加浏览器前缀
        // use: [
        //   'vue-style-loader',
        //   MiniCssExtractPlugin.loader,
        //   // 'style-loader', 
        //   'css-loader', 
        //   'postcss-loader',
        //   // {
        //   //   loader: 'postcss-loader',
        //   //   options: {
        //   //     postcssOptions: {
        //   //       plugins: [require('autoprefixer')]
        //   //     }
        //   //   }
        //   // }, 
        //   'less-loader'
        // ] // 从右向左解析原则｜为css添加浏览器前缀｜引入方式2
        use: [{
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../dist/css/',
            hmr: devMode
          }
        },
          // 'style-loader', 
          'css-loader', 
          'postcss-loader',
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     postcssOptions: {
          //       plugins: [require('autoprefixer')]
          //     }
          //   }
          // }, 
          'less-loader'
        ] // 从右向左解析原则｜为css添加浏览器前缀｜引入方式2
      },
      // 打包 图片、字体、媒体、等文件
      {
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              // 限制文件大小
              limit: 10240,
              // 超出上面限制之后使用的loader ext是文件本来的扩展名
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      // js代码兼容更多的环境｜用babel转义js文件｜处理js语法浏览器兼容问题
      // 只会将 ES6/7/8语法转换为ES5语法，但是对新api并不会转换 例如(promise、Generator、Set、Maps、Proxy等)
      // 需要借助babel-polyfill来帮助我们转换
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        // 排除依赖下的js
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  // 配置模块如何进行解析
  resolve: {
    // 创建别名
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      // 设置@引用的地址为根目录下的src
      '@': path.resolve(__dirname, '../src')
    },
    // 按顺序解析以下数组后缀名的文件
    extensions: ['*', '.js', 'json', 'vue']
  }
}
