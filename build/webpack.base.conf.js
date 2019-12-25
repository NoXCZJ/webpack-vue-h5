"use strict";
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const postcssPresetEnv = require("postcss-preset-env");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  entry: {
    // 配置入口文件
    main: resolve("../src/main.js")
  },
  output: {
    // 配置打包文件输出的目录
    path: resolve("../dist"),
    // 生成的js文件名称
    filename: "js/[name].[hash:8].js",
    // 生成的chunk名称
    chunkFilename: "js/[name].[hash:8].js",
    // 资源引用的路径
    publicPath: "/vue-h5-v1/"
  },
  devServer: {
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    contentBase: "./dist",
    proxy: {
      '/test': {
        target: 'http://192.168.1.90:8080/test',
        secure: true, // 如果是https接口，需要配置这个参数为true
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置为true
        pathRewrite: {
          '^/test': ''
        }
      }
    }
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.runtime.esm.js",
      "@": resolve("../src")
    },
    extensions: [".js", ".vue"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "cache-loader"
          },
          {
            loader: "thread-loader"
          },
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "cache-loader"
          },
          {
            loader: "thread-loader"
          },
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              // plugins: () => [
              //   postcssPresetEnv({
              //     autoprefixer: {
              //       flexbox: "no-2009"
              //     },
              //     stage: 3
              //   })
              // ]
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "media/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "fonts/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      // {
      //   test: /\.(vue|js|jsx)$/,
      //   loader: 'eslint-loader',
      //   exclude:/node_modules/,
      //   enforce: 'pre'     //预处理
      // }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // 配置忽略规则

    new HtmlWebpackPlugin({
      template: resolve("../public/index.html"),
      favicon: path.resolve(__dirname, '../public/favicon.ico'),
      minify: {
        collapseWhitespace: true,//删除空格、换行
      },
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist')
      }
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
