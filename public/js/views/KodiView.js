import { sortString } from '../helpers/sort.js';

export default {
  name: 'Kodi',
  template: `
    <div>
      <table class="datalist" v-if="scrobbles.length > 0">
        <thead>
          <th>Name</th>
        </thead>
        <tbody>
          <tr v-for="scrobble in scrobbles">
            <td>{{ scrobble }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      inview: false,
      scrobbles: []
    };
  },
  mounted() {
    this.inview = true;
    this.scrobblesTimer();
  },

  beforeDestroy() {
    this.inview = false;
  },

  methods: {
    async scrobblesTimer() {
      this.scrobbles = await this.$http
        .get('/kodi/scrobbled')
        .then(res => res.data);

      if (this.inview) {
        setTimeout(() => {
          this.scrobblesTimer();
        }, 20000);
      }
    }
  }
};
