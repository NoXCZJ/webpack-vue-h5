import request from '@/utils/request';

export function sysConf(params) {
  return request({
    url: `/sys/conf/${params.version}`,
    method: 'GET',
    params,
    data: params
  });
}

// 系统配置-获取单项配置信息
export function sysConfKey(params) {
  return request({
    url: `/sys/conf/${params.version}/${params.key}`,
    method: 'GET',
    params,
    data: params
  });
}

export function uploadBatch(params) {
  return request({
    url: `/file/nick/upload/batch`,
    method: 'POST',
    params,
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function getQrcode(params) {
  return request({
    url: `/users/h5/qrcode`,
    method: 'GET',
    params,
    data: params
  });
}

// 获取jsapi_ticket
export function getJsapi_ticket(params) {
  return request({
    url: `/wechat/mp/portal/ticket`,
    method: 'GET',
    params,
    data: params
  });
}

// 获取临时素材文件
export function getWX_medias(params) {
  return request({
    url: `/users/h5/medias`,
    method: 'POST',
    data: params
  });
}
