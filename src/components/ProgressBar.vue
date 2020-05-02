<template>
  <div class="progressbar-container">
    <div class="progressbar" :style="{ width: `${this.progress}%` }"></div>
  </div>
</template>

<script>
export default {
  props: {
    progress: Number,
    default() {
      return 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/_variables.scss';

.progressbar-container {
  content: ' ';
  width: 80px;
  height: 15px;
  .progressbar {
    height: 100%;
    transition: width 0.2s ease-in;
    background-color: $text-color-dark;
  }
}
</style>
