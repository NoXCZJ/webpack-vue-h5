<template>
  <div class="top-container">
    <img class="user-headImg user-headImg-01" src="../../assets/images/publicity/头像01@2x.png" />
    <img class="user-headImg user-headImg-02" src="../../assets/images/publicity/头像02@2x.png" />
    <img class="user-headImg user-headImg-03" src="../../assets/images/publicity/头像03@2x.png" />
    <img class="user-headImg user-headImg-04" src="../../assets/images/publicity/头像04@2x.png" />
    <img class="user-headImg user-headImg-05" src="../../assets/images/publicity/头像05@2x.png" />
    <img class="user-headImg user-headImg-06" src="../../assets/images/publicity/头像06@2x.png" />
    <img class="user-headImg user-headImg-07" src="../../assets/images/publicity/头像07@2x.png" />
    <img class="user-headImg user-headImg-08" src="../../assets/images/publicity/头像08@2x.png" />
    <img class="user-headImg user-headImg-09" src="../../assets/images/publicity/头像09@2x.png" />
    <div class="love-wrap">
      <img class="love love-L" src="../../assets/images/publicity/L@2x.png" />
      <img class="love love-O" src="../../assets/images/publicity/O@2x.png" />
      <img class="love love-V" src="../../assets/images/publicity/V@2x.png" />
      <img class="love love-E" src="../../assets/images/publicity/E@2x.png" />
    </div>
    <img class="live-title" src="../../assets/images/publicity/夜听3千万人海中遇见爱@2x.png" />
  </div>
</template>

<script>
export default {
  name: 'PosterHeader',
  props: {},
  computed: {}
};
</script>

<style scoped lang="scss">
@mixin love-item($width, $height) {
  width: $width;
  height: $height;
}
@mixin user-headImg($height, $top, $left) {
  height: $height;
  top: $top;
  left: $left;
}
.user-headImg {
  width: auto;
  position: absolute;
  &.user-headImg-01 {
    @include user-headImg(66px, 54px, 190px);
    animation: rockLeft 1.5s infinite;
  }
  &.user-headImg-02 {
    @include user-headImg(96px, 88px, 548px);
    animation: fadeIn 2s 1s infinite;
  }
  &.user-headImg-03 {
    @include user-headImg(72px, 174px, 328px);
    z-index: 0;
  }
  &.user-headImg-04 {
    @include user-headImg(84px, 232px, 118px);
    z-index: 0;
    animation: rockLeft 1.5s infinite;
    transform-origin: 100% 100% 0;
  }
  &.user-headImg-05 {
    @include user-headImg(44px, 258px, 546px);
    z-index: 0;
  }
  &.user-headImg-06 {
    @include user-headImg(58px, 286px, 442px);
    z-index: 0;
  }
  &.user-headImg-07 {
    @include user-headImg(66px, 334px, 0px);
  }
  &.user-headImg-08 {
    @include user-headImg(44px, 346px, 242px);
    z-index: 2;
  }
  &.user-headImg-09 {
    @include user-headImg(76px, 322px, 628px);
    animation: fadeIn 3s 2s infinite;
  }
}
.top-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 486px;

  .love-wrap {
    margin-top: 220px;
    .love {
      vertical-align: middle;
      position: relative;
    }
    .love:not(:first-child) {
      margin-left: 16px;
    }
    .love-L {
      @include love-item(78px, 180px);
      z-index: 1;
    }
    .love-O {
      @include love-item(86px, 184px);
      z-index: 2;
    }
    .love-V {
      @include love-item(96px, 180px);
      z-index: 3;
    }
    .love-E {
      @include love-item(78px, 180px);
      z-index: 4;
    }
  }

  .live-title {
    width: 492px;
    height: 42px;
    margin-top: 22px;
  }

}
@keyframes rockLeft {
  0% {
    transform: rotate3d(0,0,1,0deg);
  }
  50% {
    transform: rotate3d(0,0,1,6deg);
  }
  100% {
    transform: rotate3d(0,0,1,0deg);
  }
}

@keyframes headArrows {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 10px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeIn {
  0% {
    transform: scale3d(1,1,1);
    opacity: 1;
  }
  50% {
    transform: scale3d(0.5,0.5,0.5);
    opacity: 0.3;
  }
  100% {
    transform: scale3d(1,1,1);
    opacity: 1;
  }
}
</style>
