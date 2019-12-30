<template>
  <div id="index" class="index-container">
    <canvas id="canvas" class="canvas"></canvas>
    <div class="index-box">
      <img class="ice" src="../../assets/images/ice.png" />
    </div>
  </div>
</template>

<script>
import { randomFloat } from '@/utils/util';
import snowflake from '@/assets/images/snowflake.png';
export default {
  name: 'Index',
  components: { },
  data() {
    return {
      tets: ''
    };
  },
  watch: {},
  created() {},
  mounted() {
    const Canvas = function(target, width, height) {
      this.width = width;
      this.height = height;
      this.target = target;
    };
    Canvas.prototype = {
      init: function() {
        // const oC = document.createElement('canvas');
        const oC = document.getElementById('canvas');
        oC.setAttribute('width', this.width);
        oC.setAttribute('height', this.height);
        oC.style.background = 'transparent';
        this.target.appendChild(oC);
        return oC;
      }
    };
    const curWinWidth = document.body.offsetWidth;
    const curWinHeight = document.body.offsetHeight;
    const oCanvas = new Canvas(document.getElementById('index'), curWinWidth, curWinHeight);
    const oC = oCanvas.init();
    const oGc = oC.getContext('2d');

    const Snow = function() {};

    Snow.prototype = {
      init: function() {
        this.x = randomFloat(0, oC.width);
        this.r = randomFloat(10, 25);
        this.y = -this.r;
        this.vy = randomFloat(3, 5);
        const wind = randomFloat(-1, 1);
        this.wind = wind;
        this.vx = wind + randomFloat(0, 0.3 * wind);
        this.globalAlpha = randomFloat(0.6, 1);
      },
      draw: function(cxt, img) {
        cxt.drawImage(img, this.x, this.y, this.r, this.r);
        cxt.globalAlpha = this.globalAlpha;
        cxt.shadowBlur = randomFloat(2, 5);
        cxt.shadowColor = 'white';
        this.update(cxt);
      },
      update: function(cxt) {
        if (this.y < oC.height - this.r) {
          this.y += this.vy;
          this.x += this.wind + randomFloat(0, 0.3 * this.wind);
        } else {
          this.init();
        }
      }
    };

    const img = new Image();
    img.onload = () => {
      const snow = [];
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          const oSnow = new Snow();
          oSnow.init();
          snow.push(oSnow);
        }, 1000 * i);
      }

      (function move() {
        oGc.clearRect(0, 0, oC.width, oC.height);
        for (let i = 0; i < snow.length; i++) {
          snow[i].draw(oGc, img);
        }
        requestAnimationFrame(move);
      })();
    };
    img.src = snowflake;
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.index-container {
  display: flex;
  min-height: 100vh;
  background: #13192F url('../../assets/images/bottom_ice.png') no-repeat left bottom;
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
    .ice {
      width: 100vw;
    }
  }
}
</style>
