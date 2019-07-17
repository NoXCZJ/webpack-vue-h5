"use strict";
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const postcssPresetEnv = require("postcss-preset-env");

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
    publicPath: "/"
  },
  devServer: {
    hot: true,
    port: 3000,
    contentBase: "./dist",
    open: true
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
              plugins: () => [
                postcssPresetEnv({
                  autoprefixer: {
                    flexbox: "no-2009"
                  },
                  stage: 3
                })
              ]
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
              limit: 4096,
              fallback: "file-loader",
              options: {
                name: "img/[name].[hash:8].[ext]"
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
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),

    new HtmlWebpackPlugin({
      template: resolve("../public/index.html")
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
