<template>
  <div>
    <slot name="upload" />
    <input v-show="false" ref="upload" type="file" accept="image/*" multiple="false" @change="uploadImg($event)">
    <div v-show="showCropper" class="cropperWrap">
      <VueCropper
        ref="cropper"
        class="cropper"
        :img="cropperConfig.img"
        :output-size="cropperConfig.size"
        :output-type="cropperConfig.outputType"
        :info="cropperConfig.info"
        :can-scale="cropperConfig.canScale"
        :auto-crop="cropperConfig.autoCrop"
        :fixed="cropperConfig.fixed"
        :fixed-number="cropperConfig.fixedNumber"
        :fixed-box="cropperConfig.fixedBox"
        :can-move-box="cropperConfig.canMoveBox"
        :center-box="cropperConfig.centerBox"
        @imgLoad="cropperImgLoad"
      />
      <div class="buttonList">
        <button type="button" class="cancel" @click="showCropper = false">取消</button>
        <button type="button" class="submit" @click="submitUpload">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper';
import axios from 'axios';
import CONFIG from '@/utils/config';
import { is_weixin, browser } from '@/utils/util';
// let baseUploadUrl = `file/upload?token=${sessionStorage.getItem("token")}`;
export default {
  name: 'CropperUpload',
  components: {
    VueCropper
  },
  data() {
    return {
      baseUploadUrl: CONFIG.uploadUrl,
      showCropper: false, // 裁切窗口显示
      fileName: '',
      wxConfigInitFlag: false, // 微信jssdk初始化成功标志
      cropperConfig: {
        img: '',
        info: true,
        size: 0.6,
        outputType: 'jpeg',
        canScale: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1],
        fixedBox: true,
        canMoveBox: false,
        centerBox: true
      } // croppper 配置参数
    };
  },
  watch: {
    showCropper(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'inherit';
      }
    }
  },
  mounted() {
    if (is_weixin() && wx) {
      wx.ready(() => {
        this.wxConfigInitFlag = true;
      });
      wx.error((res) => {
        this.wxConfigInitFlag = false;
      });
    }
  },
  methods: {
    getFiles() {
      if (this.wxConfigInitFlag) {
        this.fileName = 'img.jpg';
        wx.checkJsApi({
          jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: (res) => {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            if (res && res.checkResult && res.checkResult.chooseImage) {
              try {
                wx.chooseImage({
                  count: 1, // 默认9
                  // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                  success: (res) => {
                    const localIds = res.localIds;
                    this.showCropper = true;
                    this.$nextTick(() => {
                      this.$toast.clear();
                      if (localIds && localIds.length) {
                        if (browser.versions.ios) {
                          wx.getLocalImgData({
                            localId: localIds[0], // 图片的localID
                            success: (res) => {
                              const localData = res.localData;
                              this.cropperConfig.img = localData;
                            }
                          });
                        } else {
                          if (localIds && localIds.length) {
                            this.$toast.loading({
                              mask: true,
                              duration: 0,
                              message: '处理中...'
                            });
                            wx.uploadImage({
                              localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                              isShowProgressTips: 0, // 默认为1，显示进度提示
                              success: (res) => {
                                const { dispatch } = this.$store;
                                const serverId = res.serverId; // 返回图片的服务器端ID
                                if (serverId) {
                                  dispatch({
                                    type: 'common/getWX_medias',
                                    payload: {
                                      ids: [serverId]
                                    }
                                  }).then(data => {
                                    this.$toast.clear();
                                    if (data) {
                                      this.cropperConfig.img = data[serverId];
                                    }
                                  });
                                }
                              }
                            });
                          }
                        }
                      } else {
                        this.$toast({
                          position: 'bottom',
                          message: '图片加载失败！'
                        });
                        this.showCropper = false;
                      }
                    });
                  }
                });
              } catch (error) {
                this.$refs.uploadFile.click();
              }
            } else {
              this.$refs.uploadFile.click();
            }
          }
        });
      } else {
        this.$refs.upload.click();
      }
    },
    uploadImg(e) {
      if (e.target.files && e.target.files.length) {
        // 上传图片
        const file = e.target.files[0];
        this.fileName = file.name;
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          this.$toast({
            position: 'bottom',
            message: '必须是图片'
          });
          return false;
        }
        this.$toast.loading({
          mask: true,
          duration: 0,
          message: '解析中...'
        });
        const reader = new window.FileReader();
        reader.onload = e => {
          let data;
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new window.Blob([e.target.result]));
          } else {
            data = e.target.result;
          }

          //   this.showCropper = true;
          this.$nextTick(() => {
            this.showCropper = true;
            this.$refs.upload.value = null;
            this.$nextTick(() => {
              this.cropperConfig.img = data;
            });
          });
        };
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file);
      }
    },
    cropperImgLoad(res) {
      if (res === 'success') {
        this.$toast.clear();
      } else {
        this.$toast({
          message: '解析失败！'
        });
      }
    },
    // 提交上传图片
    submitUpload() {
      this.$refs.cropper.getCropBlob(data => {
        console.log(data);
        const formData = new window.FormData(); // 这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数
        formData.append('file', data, this.fileName); // append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同

        // axios
        axios.defaults.baseURL = CONFIG.BaseUrl;
        const config = {
          url: this.baseUploadUrl,
          method: 'post',
          data: formData,
          timeout: 10000,
          onUploadProgress: function(progressEvent) {
            console.log((progressEvent.loaded / progressEvent.total) * 100);
          }
        };
        this.$toast.loading({
          mask: true,
          duration: 0,
          message: '上传中...'
        });
        axios(config)
          .then(res => {
            if (res.data.code === 0) {
              this.$emit('croppperSuccess', res.data.data);
              this.showCropper = false;
              this.$toast.clear();
            } else if (res.data.code === 10003 || res.data.code === 10008) {
              this.$toast({
                position: 'bottom',
                message: res.data.msg
              });
              sessionStorage.removeItem('token');
            } else {
              this.$toast({
                position: 'bottom',
                message: res.data.msg
              });
            }
          })
          .catch(err => {
            // this.$toast.clear();
            // console.log(err);
            if (err) {
              this.$toast({
                position: 'bottom',
                message: 'HTTP CODE: ' + err.status
              });
            } else {
              this.$toast({
                message: '上传失败'
              });
            }
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.cropperWrap {
  position: fixed;
  z-index: 90;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  .cropper {
    background: #000000;
    width: 100%;
    flex-grow: 1;
  }
  .buttonList {
    height: 200px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-shrink: 0;
    button {
      background: none;
      border: none;
      width: 50%;
      height: 50%;
      color: #ffffff!important;
      // margin: 0 100px;
      font-size: 30px;
      // &.cancel {
      //   float: left;
      // }
      // &.submit {
      //   float: right;
      // }
    }
  }
}
</style>
