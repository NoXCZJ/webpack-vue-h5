##### 1. 安装依赖包

```shell
npm install
```

#####  2.各个插件作用



`postcss-import`:

目前使用的是默认配置。只在 `postcss.config.js` 文件中引入了该插件。 `postcss-import` 主要功有是解决 `@import` 引入路径问题。使用这个插件，可以让你很轻易的使用本地文件、 `node_modules` 或者 `web_modules` 的文件。这个插件配合 `postcss-url` 让你引入文件变得更轻松。

`postcss-url`: 

该插件主要用来处理文件，比如图片文件、字体文件等引用路径的处理。
在Vue项目中， `vue-loader` 已具有类似的功能，只需要配置中将 `vue-loader` 配置进去。

`autoprefixer`:

autoprefixer插件是用来自动处理浏览器前缀的一个插件。如果你配置了postcss-cssnext，其中就已具备了autoprefixer的功能。在配置的时候，未显示的配置相关参数的话，表示使用的是Browserslist指定的列表参数，你也可以像这样来指定last 2 versions 或者 > 5%。

如此一来，你在编码时不再需要考虑任何浏览器前缀的问题，可以专心撸码。这也是PostCSS最常用的一个插件之一。

###### vw的布局兼容方案

`postcss.config.js`：
```js
module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-import": {},
    "postcss-url": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    // "postcss-cssnext": { // 已经废弃，用 `postcss-preset-env`
    //   warnForDuplicates: false
    // },
    "postcss-px-to-viewport": {
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: "vw", // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: [".ignore", ".hairlines"], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false // 允许在媒体查询中转换`px`
    },
    "postcss-viewport-units": {},
    cssnano: {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    }
  }
};

```

> 特别声明：由于cssnext和cssnano都具有autoprefixer,事实上只需要一个，所以把默认的autoprefixer删除掉，然后把cssnano中的autoprefixer设置为false。对于其他的插件使用，稍后会简单的介绍。

> postcss-cssnext 也具有autoprefixer，所以需要 `warnForDuplicates: false`

`postcss-cssnext`:(已经废弃，用 `postcss-preset-env`)

postcss-cssnext其实就是cssnext。该插件可以让我们使用CSS未来的特性，其会对这些特性做相关的兼容性处理。

```js
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              postcssPresetEnv({
                autoprefixer: {
                  flexbox: "no-2009"
                },
                stage: 3
              })
            ]
          } }
        ]
      }
    ]
  }
}
```

`cssnano`:

cssnano主要用来压缩和清理CSS代码。在Webpack中，cssnano和css-loader捆绑在一起，所以不需要自己加载它。不过你也可以使用postcss-loader显式的使用cssnano。

在cssnano的配置中，使用了preset: "advanced"，所以我们需要另外安装：

```shell
npm i cssnano-preset-advanced --save-dev
```

cssnano集成了一些其他的PostCSS插件，如果你想禁用cssnano中的某个插件的时候，可以像下面这样操作：

```shell
"cssnano": {
    autoprefixer: false,
    "postcss-zindex": false
}
```

> 上面的代码把autoprefixer和postcss-zindex禁掉了。前者是有重复调用，后者是一个讨厌的东东。只要启用了这个插件，z-index的值就会重置为1。这是一个天坑，千万记得将postcss-zindex设置为false。

`postcss-px-to-viewport`:

postcss-px-to-viewport插件主要用来把px单位转换为vw、vh、vmin或者vmax这样的视窗单位，也是vw适配方案的核心插件之一。

在配置中需要配置相关的几个关键参数：
```js
"postcss-px-to-viewport": {
    viewportWidth: 750,      // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
    viewportHeight: 1334,    // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
    unitPrecision: 3,        // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
    viewportUnit: 'vw',      // 指定需要转换成的视窗单位，建议使用vw
    selectorBlackList: ['.ignore', '.hairlines'],  // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
    minPixelValue: 1,       // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
    mediaQuery: false       // 允许在媒体查询中转换`px`
}
```

目前出视觉设计稿，我们都是使用750px宽度的，那么100vw = 750px，即1vw = 7.5px。那么我们可以根据设计图上的px值直接转换成对应的vw值。在实际撸码过程，不需要进行任何的计算，直接在代码中写px，比如：

```css
.test {
    border: .5px solid black;
    border-bottom-width: 4px;
    font-size: 14px;
    line-height: 20px;
    position: relative;
}
[w-188-246] {
    width: 188px;
}
```
编译出来的CSS：
```css
.test {
    border: .5px solid #000;
    border-bottom-width: .533vw;
    font-size: 1.867vw;
    line-height: 2.667vw;
    position: relative;
}
[w-188-246] {
    width: 25.067vw;
}
```
在不想要把px转换为vw的时候，首先在对应的元素（html）中添加配置中指定的类名.ignore或.hairlines(.hairlines一般用于设置border-width:0.5px的元素中)：
```html
<div class="box ignore"></div>
```
写CSS的时候：

```css
.ignore {
    margin: 10px;
    background-color: red;
}
.box {
    width: 180px;
    height: 300px;
}
.hairlines {
    border-bottom: 0.5px solid red;
}
```

编译出来的CSS:
```css
.box {
    width: 24vw;
    height: 40vw;
}
.ignore {
    margin: 10px; /*.box元素中带有.ignore类名，在这个类名写的`px`不会被转换*/
    background-color: red;
}
.hairlines {
    border-bottom: 0.5px solid red;
}
```
上面解决了px到vw的转换计算。那么在哪些地方可以使用vw来适配我们的页面。根据相关的测试：
- 容器适配，可以使用vw
- 文本的适配，可以使用vw
- 大于1px的边框、圆角、阴影都可以使用vw
- 内距和外距，可以使用vw

`postcss-aspect-ratio-mini`:

postcss-aspect-ratio-mini主要用来处理元素容器宽高比。在实际使用的时候，具有一个默认的结构
```html
<div aspectratio>
    <div aspectratio-content></div>
</div>
```

在实际使用的时候，你可以把自定义属性aspectratio和aspectratio-content换成相应的类名，比如：

```
<div class="aspectratio">
    <div class="aspectratio-content"></div>
</div>
```
我个人比较喜欢用自定义属性，它和类名所起的作用是同等的。结构定义之后，需要在你的样式文件中添加一个统一的宽度比默认属性：

```css
[aspectratio] {
    position: relative;
}
[aspectratio]::before {
    content: '';
    display: block;
    width: 1px;
    margin-left: -1px;
    height: 0;
}

[aspectratio-content] {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}
```
如果我们想要做一个188:246（188是容器宽度，246是容器高度）这样的比例容器，只需要这样使用：
```css
[w-188-246] {
    aspect-ratio: '188:246';
}
```
有一点需要特别注意：aspect-ratio属性不能和其他属性写在一起，否则编译出来的属性只会留下aspect-ratio的值，比如：
```html
<div aspectratio w-188-246 class="color"></div>
```
编译前的CSS如下：
```css
[w-188-246] {
    width: 188px;
    background-color: red;
    aspect-ratio: '188:246';
}
```
编译之后：
```css
[w-188-246]:before {
    padding-top: 130.85106382978725%;
}
```

主要是因为在插件中做了相应的处理，不在每次调用aspect-ratio时，生成前面指定的默认样式代码，这样代码没那么冗余。所以在使用的时候，需要把width和background-color分开来写：
```css
[w-188-246] {
    width: 188px;
    background-color: red;
}
[w-188-246] {
    aspect-ratio: '188:246';
}
```
这个时候，编译出来的CSS就正常了：
```css
[w-188-246] {
    width: 25.067vw;
    background-color: red;
}
[w-188-246]:before {
    padding-top: 130.85106382978725%;
}
```

> 目前采用PostCSS插件只是一个过渡阶段，在将来我们可以直接在CSS中使用aspect-ratio属性来实现长宽比。

`postcss-write-svg`:

postcss-write-svg插件主要用来处理移动端1px的解决方案。该插件主要使用的是border-image和background来做1px的相关处理。比如：
```css
@svg 1px-border {
    height: 2px;
    @rect {
        fill: var(--color, black);
        width: 100%;
        height: 50%;
    }
}
.example {
    border: 1px solid transparent;
    border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch;
}
```
编译出来的CSS:
```css
.example {
    border: 1px solid transparent;
    border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E") 2 2 stretch;
}
```

上面演示的是使用border-image方式，除此之外还可以使用background-image来实现。比如：
```css
@svg square {
    @rect {
        fill: var(--color, black);
        width: 100%;
        height: 100%;
    }
}

#example {
    background: white svg(square param(--color #00b1ff));
}
```
编译出来就是：
```css
#example {
    background: white url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%2300b1ff' width='100%25' height='100%25'/%3E%3C/svg%3E");
}
```

> 特别声明：由于有一些低端机对border-image支持度不够友好，个人建议你使用background-image的这个方案。

`postcss-viewport-units`:

postcss-viewport-units插件主要是给CSS的属性添加content的属性，配合viewport-units-buggyfill库给vw、vh、vmin和vmax做适配的操作。

这是实现vw布局必不可少的一个插件，因为少了这个插件，这将是一件痛苦的事情。后面你就清楚。

到此为止，有关于所需要的PostCSS已配置完。并且简单的介绍了各个插件的作用，至于详细的文档和使用，可以参阅对应插件的官方文档。

### 3.vw兼容方案

最终的解决方案，就是使用viewport的polyfill：Viewport Units Buggyfill。使用viewport-units-buggyfill主要分以下几步走：

##### 引入JavaScript文件

`viewport-units-buggyfill` 主要有两个JavaScript文件： `viewport-units-buggyfill.js` 和 `viewport-units-buggyfill.hacks.js` 。你只需要在你的HTML文件中引入这两个文件。比如在Vue项目中的 `index.html` 引入它们：
```html
<script src="//g.alicdn.com/fdilab/lib3rd/viewport-units-buggyfill/0.6.2/??viewport-units-buggyfill.hacks.min.js,viewport-units-buggyfill.min.js"></script>
```
你也可以使用其他的在线CDN地址，也可将这两个文件合并压缩成一个.js文件。这主要看你自己的兴趣了。

第二步，在HTML文件中调用viewport-units-buggyfill，比如：

```html
<script>
    window.onload = function () {
        window.viewportUnitsBuggyfill.init({
            hacks: window.viewportUnitsBuggyfillHacks
        });
    }
</script>
```

具体的使用。在你的CSS中，只要使用到了viewport的单位（vw、vh、vmin或vmax ）地方，需要在样式中添加content：

```css
.my-viewport-units-using-thingie {
    width: 50vmin;
    height: 50vmax;
    top: calc(50vh - 100px);
    left: calc(50vw - 100px);

    /* hack to engage viewport-units-buggyfill */
    content: 'viewport-units-buggyfill; width: 50vmin; height: 50vmax; top: calc(50vh - 100px); left: calc(50vw - 100px);';
}
```

这可能会令你感到恶心，而且我们不可能每次写vw都去人肉的计算。特别是在我们的这个场景中，咱们使用了postcss-px-to-viewport这个插件来转换vw，更无法让我们人肉的去添加content内容。

这个时候就需要前面提到的postcss-viewport-units插件。这个插件将让你无需关注content的内容，插件会自动帮你处理。

Viewport Units Buggyfill还提供了其他的功能。详细的这里不阐述了。但是content也会引起一定的副作用。比如img和伪元素::before(:before)或::after（:after）。在img中content会引起部分浏览器下，图片不会显示。这个时候需要全局添加：

```css
img {
    content: normal !important;
}
```

而对于::after之类的，就算是里面使用了vw单位，Viewport Units Buggyfill对其并不会起作用。比如：

```css
// 编译前
.after {
    content: 'after content';
    display: block;
    width: 100px;
    height: 20px;
    background: green;
}

// 编译后
.after[data-v-469af010] {
    content: "after content";
    display: block;
    width: 13.333vw;
    height: 2.667vw;
    background: green;
}
```



