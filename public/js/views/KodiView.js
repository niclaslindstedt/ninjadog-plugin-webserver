import { sortString } from '../helpers/sort.js';

export default {
  name: 'Kodi',
  template: `
    <div>
      <table class="datalist" v-if="scrobbles.length > 0">
        <thead>
          <th>show/movie</th>
          <th>season</th>
          <th>episode</th>
          <th>episode name</th>
          <th>when</th>
        </thead>
        <tbody>
          <tr v-for="scrobble in scrobbles">
            <td>{{ scrobble.item.showtitle }}</td>
            <td>{{ scrobble.item.season }}</td>
            <td>{{ scrobble.item.episode }}</td>
            <td>{{ scrobble.item.label }}</td>
            <td>{{ scrobble.date }}</td>
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
      this.scrobbles = await this.$http.get('/kodi/scrobbled').then(res => {
        let data = res.data.map(item => ({
          ...item,
          date: dateFns.distanceInWordsStrict(new Date(), new Date(item.date), {
            addSuffix: true
          })
        }));
        return data;
      });

      if (this.inview) {
        setTimeout(() => {
          this.scrobblesTimer();
        }, 20000);
      }
    }
  }
};
