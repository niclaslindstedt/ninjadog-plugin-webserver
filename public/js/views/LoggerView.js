export default {
  name: 'Logger',
  template: `
    <div>
      <a href="#" @click="clearLog">x clear log</a>
      <ul class="no-list">
        <li v-for="(entry, i) in entries" :key="i" :class="'log-'+entry.color">
          [{{ entry.date }}] {{ entry.message }}
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      inview: false,
      entries: []
    };
  },
  mounted() {
    this.inview = true;
    this.logTimer();
  },

  beforeDestroy() {
    this.inview = false;
  },

  methods: {
    async logTimer() {
      this.entries = await this.$http.get('/logger/log').then(res =>
        res.data
          .split('\n')
          .filter(line => line.length > 0)
          .map(line => line.split(';'))
          .map(entry => ({
            color: entry[0],
            date: dateFns.format(new Date(entry[1]), 'ddd HH:mm'),
            message: entry[2]
          }))
          .reverse()
      );

      if (this.inview) {
        setTimeout(() => {
          this.logTimer();
        }, 10000);
      }
    },

    async clearLog() {
      await this.$http.delete('logger/log');
      this.logTimer();
    }
  }
};
