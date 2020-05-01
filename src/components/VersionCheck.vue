<template>
  <div>
    <i class="fas fa-circle-notch fa-spin"></i>
    <span>{{ version }}</span>
  </div>
</template>

<script>
const BASE_URL = 'http://cors-anywhere.herokuapp.com/https://registry.npmjs.org/NAME';
export default {
  props: {
    name: String,
    currentVersion: String,
  },
  data() {
    return {
      version: undefined,
    };
  },
  watch: {
    version: {
      handler: function(version) {
        const svg = this.$el.querySelector('svg');
        if (svg) {
          svg.remove();
        }

        if (version && this.currentVersion && version !== this.currentVersion) {
          this.$emit('upgradable', this.name);
        }
      },
      immidiate: true,
    },
  },
  mounted() {
    this.getVersion();
  },
  methods: {
    async getVersion() {
      const url = BASE_URL.replace(/NAME/, this.name);
      const response = await this.$http.get(url);
      this.version = response.data['dist-tags'].latest;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  display: inline-block;
}
</style>
