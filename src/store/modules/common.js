import { sysConf, sysConfKey, uploadBatch, getQrcode, getJsapi_ticket, getWX_medias } from '@/api/common';
// import router, { resetRouter } from '@/router';
import CONFIG from '@/utils/config';

const state = {
  dictConfData: [] // 配置数据
};

const mutations = {
  SET_DICTDATA: (state, config) => {
    state.dictConfData = config;
  }
};

const actions = {
  // user login
  dictConf({ commit }) {
    return new Promise((resolve, reject) => {
      sysConf({ version: CONFIG.version }).then(response => {
        const { data } = response;
        if (data) {
          const key = data.dict_version;
          sysConfKey({ version: CONFIG.version, key }).then(response => {
            const { data } = response;
            // console.log(data[key], key);
            if (data) {
              commit('SET_DICTDATA', data.dict);
              resolve(data.dict);
            } else {
              resolve(false);
            }
          }).catch(error => {
            reject(error);
          });
        } else {
          resolve(false);
        }
      }).catch(error => {
        reject(error);
      });
    });
  },
  sysConf() {
    return new Promise((resolve, reject) => {
      sysConf({ version: CONFIG.version }).then(response => {
        const { data } = response;
        if (data) {
          resolve(data);
        } else {
          resolve(false);
        }
      }).catch(error => {
        reject(error);
      });
    });
  },
  liveShareConf() {
    return new Promise((resolve, reject) => {
      sysConfKey({ version: CONFIG.version, key: 'live_share_config' }).then(response => {
        const { data } = response;
        if (data) {
          resolve(data.live_share_config);
        } else {
          resolve(false);
        }
      }).catch(error => {
        reject(error);
      });
    });
  },
  uploadBatch({ commit }, { payload }) {
    // console.log(payload);
    return new Promise((resolve, reject) => {
      uploadBatch(payload).then(response => {
        const { data } = response;
        if (data) {
          resolve(data);
        }
        resolve(false);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getQrcode({ commit }, { payload }) {
    return new Promise((resolve, reject) => {
      getQrcode(payload).then(response => {
        const { data } = response;
        if (data) {
          resolve(data);
        }
        resolve(false);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getJsapi_ticket({ commit }, { payload }) {
    return new Promise((resolve, reject) => {
      getJsapi_ticket(payload).then(response => {
        const { data } = response;
        if (data) {
          resolve(data);
        }
        resolve(false);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getWX_medias({ commit }, { payload }) {
    return new Promise((resolve, reject) => {
      getWX_medias(payload).then(response => {
        const { data } = response;
        if (data) {
          resolve(data);
        }
        resolve(false);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
