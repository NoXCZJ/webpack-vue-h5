<template>
  <!-- <div id="app">
    <router-view />
  </div> -->
  <div id="app">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view v-if="$route.meta.keepAlive === false"></router-view>
      <keep-alive v-else>
        <router-view></router-view>
      </keep-alive>

    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>
