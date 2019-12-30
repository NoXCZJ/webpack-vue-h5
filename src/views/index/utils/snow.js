import { randomFloat } from '@/utils/util';

class SnowCanvas {
  constructor(params) {
    this.target = params.target;
    this.width = params.width;
    this.height = params.height;
    this.snowflakeIcon = params.icon;
    console.log(params);
    const oC = document.querySelector(this.target);
    oC.setAttribute('width', this.width);
    oC.setAttribute('height', this.height);
    oC.style.background = 'transparent';
    const oGc = oC.getContext('2d');
    new Snowflake({
      oC,
      oGc,
      icon: this.snowflakeIcon
    }).init();
    return oC;
  }
}

class Snow {
  constructor(params) {
    this.oC = params.oC;
  }
  init() {
    this.x = randomFloat(0, this.oC.width);
    this.r = randomFloat(10, 25);
    this.y = -this.r;
    this.vy = randomFloat(3, 5);
    const wind = randomFloat(-1, 1);
    this.wind = wind;
    this.vx = wind + randomFloat(0, 0.3 * wind);
    this.globalAlpha = randomFloat(0.6, 1);
  }
  draw(cxt, img) {
    cxt.drawImage(img, this.x, this.y, this.r, this.r);
    cxt.globalAlpha = this.globalAlpha;
    cxt.shadowBlur = randomFloat(2, 5);
    cxt.shadowColor = 'white';
    this.update(cxt);
  }
  update() {
    if (this.y < this.oC.height - this.r) {
      this.y += this.vy;
      this.x += this.wind + randomFloat(0, 0.3 * this.wind);
    } else {
      this.init();
    }
  }
}

class Snowflake {
  constructor(params) {
    this.oC = params.oC;
    this.oGc = params.oGc;
    this.snowflakeIcon = params.icon;
  }
  init() {
    const img = new Image();
    img.onload = () => {
      const snow = [];
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          const oSnow = new Snow({
            oC: this.oC
          });
          oSnow.init();
          snow.push(oSnow);
        }, 1000 * i);
      }

      const that = this;

      (function move() {
        that.oGc.clearRect(0, 0, that.oC.width, that.oC.height);
        for (let i = 0; i < snow.length; i++) {
          snow[i].draw(that.oGc, img);
        }
        requestAnimationFrame(move);
      })();
    };
    img.src = this.snowflakeIcon;
  }
}

export default SnowCanvas;
