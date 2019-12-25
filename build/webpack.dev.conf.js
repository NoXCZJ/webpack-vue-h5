// build/webpack.dev.js
const merge = require('webpack-merge')
const webpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
// const pxToUnit = require('postcss-px-to-relative-unit');
module.exports = merge(webpackConfig, {
  // 指定打包模式
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            // options: {
            //   ident: "postcss",
            //   plugins: () => [
            //     pxToUnit({
            //       targetUnit: 'vw&rem',
            //       ignoreThreshold: 1,
            //       viewportWidth: 750,
            //       viewportHeight: 1334,
            //       htmlFontSize: 75,
            //       unitPrecision: 5,
            //       excludeFiles: [/node_modules/],
            //       excludeSelectors: [],
            //       excludeProperties: []
            //     })
            //   ]
            // }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass'),
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
  ]
})
