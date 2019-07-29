const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfig = require('./webpack.base.conf.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin= require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { ANALYZE } = process.env;

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:8].css',
    chunkFilename: 'css/[name].[contenthash:8].css'
  }),
  new OptimizeCssnanoPlugin({
    sourceMap: true,
    cssnanoOptions: {
      preset: [
        'default',
        {
          mergeLonghand: false,
          cssDeclarationSorter: false
        }
      ]
    }
  }),
  new CleanWebpackPlugin()
];

if (ANALYZE) {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static'
  }));
}

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: '#source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        // test: /\.js(\?.*)?$/i,
        uglifyOptions: {
          // sourceMap: true,
          //删除注释
          output:{
            comments: false
          },
          //删除console 和 debugger  删除警告
          compress:{
            drop_debugger: true,
            drop_console: true
          }
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          }
        ]
      },
    ]
  },
  plugins: plugins
})
