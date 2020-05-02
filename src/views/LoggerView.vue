<template>
  <div>
    <div class="box">
      <a href="#" @click.prevent="clearLog"> <i class="fas fa-trash"></i> clear log </a>
    </div>
    <div class="container">
      <div v-for="(entries, day) in entries" :key="day">
        <h2>{{ day }}</h2>
        <ul class="no-list">
          <li v-for="(entry, i) in entries" :key="i" :class="'log-' + entry.color">
            [{{ entry.date }}] {{ entry.message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'Logger',
  data() {
    return {
      inview: false,
      entries: [],
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
      const entries = await this.$http.get('/logger/log').then(res =>
        res.data
          .split('\n')
          .filter(line => line.length > 0)
          .map(line => line.split(';'))
          .map(entry => ({
            color: entry[0],
            date: format(new Date(entry[1]), 'HH:mm'),
            message: entry[2],
            day: format(new Date(entry[1]), 'EEE dd MMM'),
          }))
          .reverse()
      );

      this.entries = entries.reduce((prev, curr) => {
        if (!prev[curr.day]) {
          prev[curr.day] = [];
        }
        prev[curr.day] = [...prev[curr.day], curr];
        return prev;
      }, {});

      if (this.inview) {
        setTimeout(() => {
          this.logTimer();
        }, 10000);
      }
    },

    async clearLog() {
      await this.$http.delete('logger/log');
      this.logTimer();
    },
  },
};
</script>

<style>
.log-green {
  color: rgb(181, 235, 96);
}

.log-cyan {
  color: rgb(90, 206, 226);
}

.log-red {
  color: rgb(226, 90, 90);
}

.log-yellow {
  color: rgb(224, 226, 90);
}

.log-white {
  color: rgb(253, 253, 253);
}
</style>
