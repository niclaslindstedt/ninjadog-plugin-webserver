import { sortString } from '../helpers/sort.js';

export default {
  name: 'Qbittorrent',
  template: `
    <div>
      <table class="datalist" v-if="shows.length > 0">
        <thead>
          <th>Name</th>
        </thead>
        <tbody>
          <tr v-for="show in shows">
            <td v-text="show">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      inview: false,
      shows: []
    };
  },
  mounted() {
    this.inview = true;
    this.showsTimer();
  },

  beforeDestroy() {
    this.inview = false;
  },

  methods: {
    async showsTimer() {
      this.shows = await this.$http
        .get('/torrentrss/shows')
        .then(res => res.data);

      this.shows = this.shows.sort(sortString);

      if (this.inview) {
        setTimeout(() => {
          this.showsTimer();
        }, 180000);
      }
    }
  }
};
