<template>
  <div class="index-container">
    <Button @click="handleHrefParams">检查url参数</Button>
    <Button @click="handleCheckUA">检查ua</Button>
    <Button @click="handleH5URL">测试跳转URL</Button>
  </div>
</template>

<script>
import { Button } from 'vant';
import { browser } from '@/utils/util';

export default {
  name: 'Index',
  components: { Button },
  data() {
    return {};
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleHrefParams() {
      alert(window.location.href);
    },
    handleCheckUA() {
      alert(navigator.userAgent);
      alert(`是否在她他会APP”中==》${browser.versions.myApp}`);
    },
    handleH5URL() {
      this.$router.push({ path: '/index' });
    }
  }
};
</script>

<style scoped lang="scss">
.index-container {
  display: flex;
  flex-direction: column;
  font-size: 28px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  .van-button {
    margin-bottom: 10px;
  }
}
</style>
