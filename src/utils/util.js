// 判断是否在微信浏览器
export function is_weixin() {
  const ua = navigator.userAgent.toLowerCase();
  const uaMatch = ua.match(/MicroMessenger/i);
  if (uaMatch && uaMatch.indexOf('micromessenger') > -1) {
    return true;
  } else {
    return false;
  }
}
// 判断访问终端
export const browser = {
  versions: (function() {
    const u = navigator.userAgent;
    // const app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, // 是否微信
      qq: u.match(/\sQQ/i) === ' qq', // 是否QQ
      myApp: u.indexOf('myApp') > -1 // 自己应用内部
    };
  }()),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

export function getRandom(min, max) { // 获取随机整数
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
