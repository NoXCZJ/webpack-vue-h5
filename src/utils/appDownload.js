import CallApp from 'callapp-lib';

/**
 * 启动app的页面
 * @param {string} fallback 下载app的链接
 */
export function initAPPCall(fallback = '//a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mobileqq') {
  const callLib = new CallApp({
    // 用来配置 URL Scheme 所必须的那些v字段。
    scheme: {
      // APP 协议，URL Scheme 的 scheme 字段，就是你要打开的 APP 的标识。
      protocol: 'mqq'
    },
    // 外链
    outChain: {
      // 同 URL Scheme 的 scheme 字段，在你的 APP 就和上面的 protocol 属性值相同，在其他 APP 打开就传该 APP 的 scheme 标识
      protocol: 'mqq',
      // 参考 URL Scheme 的 path 字段，它代表了该 APP 的具体的某个功页面（功能），这里的 path 就是对应的中间页。
      path: 'mqq/welcome'
      // key: 'url'
    },
    // 安卓原生谷歌浏览器必须传递 Intent 协议地址，才能唤起 APP
    intent: {
      package: 'com.tencent.mobileqq',
      scheme: 'mqq'
    },
    // Universal Link，你可以不用传递， callap-lib 将会使用 URL Scheme 来替代它。
    universal: {
      host: 'https://im.qq.com'
      // pathKey 就和前面 Intent 的 key 属性一样，只是这里的 pathKey 是客户端用来提取 path 信息的，以便知道调用的是 APP 的哪个页面
      // pathKey: ``
    },
    // APP 的 App Store 地址
    appstore: 'https://itunes.apple.com/cn/app/id444934666',
    // APP 的应用宝地址
    // yingyongbao: '//a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mobileqq',
    yingyongbao: fallback,
    // 唤端失败后跳转的地址。
    // fallback: '//a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mobileqq',
    fallback: `https:${fallback}`,
    // 等待唤端的时间（单位: ms），超时则判断为唤端失败。
    timeout: 2000
  });

  /**
   * 主动触发下载app
   * @param {function} isIosCall 是ios的callback
   */
  callLib.handleToDownload = (isIosCall) => {
    callLib.open({
      // 需要打开的页面对应的值，URL Scheme 中的 path 部分
      path: '',
      callback: () => {
        try {
          window.location.replace = `https:${fallback}`;
        } catch (error) {
          window.location.href = `https:${fallback}`;
        }
      }
    });
  };
  return callLib;
}
