import { is_weixin } from '@/utils/util';

/**
 * 微信分享配置
 * @param {Object} options {
 *  title // 分享卡片的title
 *  desc // 分享卡片的描述
 *  link // 要分享的H5跳转地址
 *  imgUrl // 分享图标
 * }
 */
export function initWxShare(options) {
  const { dispatch } = this.$store;
  const initShare = (options) => {
    const shareTitle = options.title;
    const shareDesc = options.desc;
    const shareJump = options.url;
    const shareCover = options.imgUrl;
    wx.onMenuShareTimeline({
      title: shareTitle, // 分享标题
      link: shareJump, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: shareCover, // 分享图标
      success: () => {
        // 设置成功
        console.log('onMenuShareTimeline==>成功');
      }
    });
    wx.onMenuShareAppMessage({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareJump, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: shareCover, // 分享图标
      // type: '', // 分享类型,music、video或link，不填默认为link
      // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: () => {
        // 设置成功
        console.log('onMenuShareAppMessage==>成功');
      }
    });
    wx.onMenuShareQQ({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareJump, // 分享链接
      imgUrl: shareCover, // 分享图标
      success: () => {
        // 用户确认分享后执行的回调函数
        console.log('onMenuShareQQ==>成功');
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareQZone({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareJump, // 分享链接
      imgUrl: shareCover, // 分享图标
      success: () => {
        // 用户确认分享后执行的回调函数
        console.log('onMenuShareQZone==>成功');
      },
      cancel: () => {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.updateAppMessageShareData({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareJump, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: shareCover, // 分享图标
      success: () => {
        // 设置成功
        console.log('updateAppMessageShareData==>成功');
      }
    });
    wx.updateTimelineShareData({
      title: shareTitle, // 分享标题
      link: shareJump, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: shareCover, // 分享图标
      success: () => {
        // 设置成功
        console.log('updateTimelineShareData==>成功');
      }
    });
  };
  if (is_weixin()) {
    if (wx) {
      dispatch({
        type: 'common/getJsapi_ticket',
        payload: {
          url: window.location.href,
          noloading: false
        }
      }).then(data => {
        if (data) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
          });
        }
      });
      wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
        initShare(options);
      });
    }
  }
}
