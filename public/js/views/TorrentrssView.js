import { sortString } from '../helpers/sort.js';

export default {
  name: 'Qbittorrent',
  template: `
    <div>
      <div class="box">
        <input type="text" @keyup.enter="addShow" placeholder="Add show" ref="showinput">
      </div>
      <h2>Active shows</h2>
      <table class="datalist two-columns" v-if="shows.length > 0">
        <thead>
          <th>Name</th>
          <th class="center-text">Remove</th>
        </thead>
        <transition-group tag="tbody" name="list">
          <tr v-for="show in sortedShows" :key="show">
            <td v-text="show"></td>
            <td class="center-text">
              <span class="cursor-pointer" @click="remove(show)">🗑️</span>
            </td>
          </tr>
        </transition-group>
      </table>

      <template v-if="removedShows.length > 0">
        <h2>Removed shows</h2>
        <table class="datalist two-columns">
          <thead>
            <th>Name</th>
            <th class="center-text">Restore</th>
          </thead>
          <transition-group tag="tbody" name="list">
            <tr v-for="show in removedSortedShows" :key="show">
              <td v-text="show"></td>
              <td class="center-text">
                <span class="cursor-pointer" @click="restore(show)">✔️</span>
              </td>
            </tr>
          </transition-group>
        </table>
      </template>
    </div>
  `,
  data() {
    return {
      inview: false,
      shows: [],
      removedShows: [],
      loading: false
    };
  },
  async mounted() {
    this.inview = true;
    this.showsTimer();

    this.removedShows = await this.$http
      .get('/torrentrss/removed-shows')
      .then(res => res.data);
  },

  beforeDestroy() {
    this.inview = false;
  },

  methods: {
    async showsTimer() {
      this.shows = await this.$http
        .get('/torrentrss/shows')
        .then(res => res.data);

      if (this.inview) {
        setTimeout(() => {
          this.showsTimer();
        }, 180000);
      }
    },
    async remove(show) {
      await this.$http.delete('/torrentrss/shows', { params: { show } });
      this.shows.splice(this.shows.indexOf(show), 1);
      this.removedShows.push(show);
    },
    async restore(show) {
      await this.$http.delete('/torrentrss/removed-shows', {
        params: { show }
      });
      this.removedShows.splice(this.removedShows.indexOf(show), 1);
      this.shows.push(show);
    },
    async addShow(e) {
      if (this.loading === true) {
        return;
      }

      const show = e.target.value;
      this.loading = true;
      try {
        await this.$http.post('/torrentrss/shows', { show });
        this.$refs.showinput.value = '';
        this.shows.push(show);
      } catch (error) {}
      this.loading = false;
    }
  },

  computed: {
    sortedShows() {
      return this.shows.sort(sortString);
    },
    removedSortedShows() {
      return this.removedShows.sort(sortString);
    }
  }
};
