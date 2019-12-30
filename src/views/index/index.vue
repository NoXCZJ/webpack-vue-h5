<template>
  <div id="index" class="index-container">
    <canvas id="canvas" class="canvas"></canvas>
    <div class="index-box">
      <img class="ice" src="../../assets/images/index/ice.png" />
      <img class="title-img" src="../../assets/images/index/title@2x.png" />
      <!-- 戴帽子 -->
      <div id="fabricBox" class="fabric-container"></div>
      <!-- 选帽子 -->
      <div class="hat-container">
        <div class="hat-item">
          <img class="hat-img" src="../../assets/images/index/hat6@3x.png" />
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="opr-container">
        <img class="opr-btn" src="../../assets/images/index/btn1@2x.png" />
        <img class="opr-btn" src="../../assets/images/index/btn2@2x.png" />
      </div>
      <img class="bottom-ad" src="../../assets/images/index/download@2x.png" />
    </div>
  </div>
</template>

<script>
import snowflake from '@/assets/images/index/snowflake.png';
import SnowCanvas from './utils/snow';
export default {
  name: 'Index',
  components: { },
  data() {
    return {};
  },
  watch: {},
  created() {},
  mounted() {
    const curWinWidth = document.body.offsetWidth;
    const curWinHeight = document.body.offsetHeight;
    new SnowCanvas({
      target: '#canvas',
      width: curWinWidth,
      height: curWinHeight,
      icon: snowflake
    });
    const fabricBox = document.getElementById('fabricBox');
    fabricBox.style.width = fabricBox.offsetHeight + 'px';
    console.log(fabricBox.offsetHeight);
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.index-container {
  display: flex;
  min-height: 100vh;
  background: #13192F url('../../assets/images/index/bottom_ice.png') no-repeat;
  background-position: left 1048px;
  background-size: 750px 424px;
  .canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
  .index-box {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .ice {
      position: fixed;
      width: 100vw;
      top: 0;
      left: 0;
    }
    .title-img {
      width: 750px;
      height: 180px;
      margin-top: 32px;
      flex-shrink: 0;
    }
    .fabric-container {
      flex-grow: 1;
      margin-top: 14px;
      max-width: 65.3333vw;
      max-height: 65.3333vw;
      background: linear-gradient(135deg,rgba(193,255,254,1) 0%,rgba(187,185,255,1) 100%);
      border-radius: 32px;
    }
    .hat-container {
      margin: 32px 0 0 60px;
      display: flex;
      .hat-item {
        width: 100px;
        height: 100px;
        margin-right: 60px;
        background:rgba(255,255,255,0.17);
        border-radius:16px;
        .hat-img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .opr-container {
      margin-top: 6px;
      .opr-btn {
        width: 270px;
        height: 128px;
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
    .bottom-ad {
      margin: 18px 0 16px 0;
      width: 550px;
      height: 142px;
      flex-shrink: 0;
    }
  }
}
@media all and (min-height: 812px) {
  .index-container {
    background-position: left bottom;
  }
}
@media all and (max-height: 480px) {
  .index-container {
    background-position: left 850px;
  }
}
// @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
//   .index-container {
//     margin-bottom: constant(safe-area-inset-bottom);
//     margin-bottom: env(safe-area-inset-bottom);
//   }
// }
</style>
