const pxToUnit = require('postcss-px-to-relative-unit');
module.exports = {
  plugins: {
    'postcss': pxToUnit({
      targetUnit: 'vw&rem',
      ignoreThreshold: 1,
      viewportWidth: 750,
      viewportHeight: 1334,
      htmlFontSize: 75,
      unitPrecision: 5,
      excludeFiles: [/node_modules/],
      excludeSelectors: [],
      excludeProperties: []
    }),
    autoprefixer: {},
    'postcss-import': {},
    'postcss-url': {},
    'postcss-aspect-ratio-mini': {},
    'postcss-write-svg': {
      utf8: false
    },
    // "postcss-cssnext": { // 已经废弃，用 `postcss-preset-env`
    //   warnForDuplicates: false
    // },
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 3
    },
    // 'postcss-px-to-viewport': {
    //   unitToConvert: 'px',
    //   viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
    //   viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
    //   unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
    //   viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
    //   selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
    //   minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
    //   mediaQuery: false, // 允许在媒体查询中转换`px`
    //   exclude: [/vant/]
    // },
    // 'postcss-viewport-units': {
    //   // filterFile: file => !file.includes('node_modules'),
    //   silence: true // if true, will not print warning even though there is a content property. it's false by default.
    // },
    cssnano: {
      preset: [
        'advanced',
        {
          // 避免 cssnano 重新计算 z-index
          zindex: false
        }
      ],
      autoprefixer: false,
      'postcss-zindex': true
    }

  }
};
