// main.js
import Vue from 'vue';

import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import '@/styles/index.scss'; // global css

// import './icons' // icon

import App from './App.vue';
import router from './router';
import store from './store';
import { Toast } from 'vant';
import VueLazyload from 'vue-lazyload';

Vue.use(Toast);
Vue.use(VueLazyload);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
