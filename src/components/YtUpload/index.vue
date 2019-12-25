<template>
  <div class="container" v-show="false">
    <label>请选择一个图像文件：</label>
    <input ref="uploadFile" type="file" :accept="accept" :multiple="multiple" @change="fileChange"/>
  </div>
</template>

<script>
import EXIF from 'exif-js';
import { is_weixin, browser } from '@/utils/util';

const getPhotoOrientation = function(img) {
  var orient;
  EXIF.getData(img, function() {
    orient = EXIF.getTag(this, 'Orientation');
  });
  return orient;
};

export default {
  name: 'YtUpload',
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    // 文件类型
    typeRegExp: {
      type: Function,
      default: () => {
        return /.(jpeg|jpg|png|bmp)$/i;
      }
    },
    // 是否上传多个文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 输出图片的画质。值为0～1,默认为1
    quality: {
      type: Number,
      default: 1
    },
    // 输出图片的格式，image/jpeg;默认为文件的type
    mineType: {
      type: String,
      default: ''
    },
    // 上传文件的最大个数
    maxCount: {
      type: Number,
      default: 1
    }
  },
  computed: {},
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
    async fileChange(e) {
      const files = e.target.files;
      // const reader = new FileReader();
      const image = new Image();

      if (files && files.length) {
        // 上传文件

        // 是否多文件
        if (this.multiple) {
          const fileList = [];
          const formData = new FormData(); // FormData 对象
          if (files.length > this.maxCount) {
            this.$toast({
              position: 'bottom',
              message: `最多还能上传${this.maxCount > 0 ? this.maxCount : 0}个文件`
            });
            this.$refs.uploadFile.value = null;
            return false;
          }
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // console.dir(file);
            if (!this.typeRegExp().test(e.target.value)) {
              this.$toast({
                position: 'bottom',
                message: '文件格式不对！'
              });
              this.$refs.uploadFile.value = null;
              return false;
            }
            this.$toast.loading({
              mask: true,
              duration: 0,
              message: '解析中...'
            });
            if (file.type.indexOf('image') > -1) {
              const reader = new FileReader();
              await new Promise((resolve, reject) => {
                reader.onload = ev => {
                  image.src = ev.target.result;
                  image.onload = async function() {
                    const orient = getPhotoOrientation(image);
                    const imgWidth = Number(this.width);
                    const imgHeight = Number(this.height);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;

                    if (orient - 0 === 6) {
                      ctx.save();// 保存状态
                      ctx.translate(imgWidth / 2, imgHeight / 2);// 设置画布上的(0,0)位置，也就是旋转的中心点
                      ctx.rotate(90 * Math.PI / 180);// 把画布旋转90度
                      // 执行Canvas的drawImage语句
                      ctx.drawImage(this, 0 - imgHeight / 2, 0 - imgWidth / 2, imgHeight, imgWidth);// 把图片绘制在画布translate之前的中心点，
                      ctx.restore(); // 恢复状态
                    } else {
                      ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
                    }

                    canvas.toBlob(blob => {
                      fileList.push(blob);
                      formData.append('files', blob, file.name); // 文件对象
                      resolve();
                    }, this.mineType || file.type, this.quality);
                    if (i === files.length - 1) {
                      if (this.$toast) {
                        this.$toast.clear();
                      }
                    }
                  };
                };
                // 转化为base64
                reader.readAsDataURL(file);
                // 转化为blob
                // reader.readAsArrayBuffer(file);
              });
            }
          }
          // console.log(formData);
          if (fileList.length === files.length) {
            this.$store.dispatch({
              type: 'common/uploadBatch',
              payload: formData
            }).then(data => {
              // console.log(data);
              this.$refs.uploadFile.value = null;
              if (data) {
                this.$emit('uploadFileSuccess', data);
              }
            });
          }
        }
      }
    },
    getFiles() {
      if (this.wxConfigInitFlag && /image/i.test(this.accept)) {
        // this.$toast.loading({
        //   mask: true,
        //   duration: 0,
        //   message: '处理中...'
        // });
        const { dispatch } = this.$store;
        wx.checkJsApi({
          jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: (res) => {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            if (res && res.checkResult && res.checkResult.chooseImage) {
              try {
                wx.chooseImage({
                  count: this.maxCount, // 默认9
                  // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                  success: async(res) => {
                    const localIds = res.localIds;
                    this.$toast.clear();
                    if (localIds && localIds.length) {
                      this.$toast.loading({
                        mask: true,
                        duration: 0,
                        message: '上传中...'
                      });
                      const serverIds = [];
                      for (let i = 0; i < localIds.length; i += 1) {
                        await new Promise((resolve, reject) => {
                          wx.uploadImage({
                            localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 0, // 默认为1，显示进度提示
                            success: (res) => {
                              const serverId = res.serverId; // 返回图片的服务器端ID
                              serverIds.push(serverId);
                              resolve();
                            }
                          });
                        });
                      }
                      dispatch({
                        type: 'common/getWX_medias',
                        payload: {
                          ids: serverIds
                        }
                      }).then(data => {
                        this.$toast.clear();
                        if (data) {
                          const values = serverIds.map(item => {
                            return data[item];
                          });
                          this.$emit('uploadFileSuccess', values);
                        }
                      });
                    } else {
                      this.$toast({
                        position: 'bottom',
                        message: '图片加载失败！'
                      });
                      this.showCropper = false;
                    }
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
        this.$refs.uploadFile.click();
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
