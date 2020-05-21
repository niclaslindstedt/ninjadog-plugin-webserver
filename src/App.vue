<template>
  <div id="app" :class="{ minimized: minimenu }">
    <main-menu @minimize="minid => (minimenu = minid)"></main-menu>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
export default {
  components: { MainMenu },
  data() {
    return {
      minimenu: false
    };
  },
  mounted() {}
};
</script>

<style lang="scss">
#app {
  height: 100vh;
  .content {
    padding-left: 140px;
  }

  &.minimized {
    .content {
      padding-left: 50px;
    }
  }
}
</style>
