export default {
  name: 'Qbittorrent',
  template: `
    <div>
      <table class="datalist torrents" v-if="torrents.length > 0">
        <thead>
          <th v-for="key in Object.keys(torrents[0])">{{ key }}</th>
        </thead>
        <tbody>
          <tr v-for="torrent in torrents" :class="torrent.state">
            <td v-for="key in Object.keys(torrent)">
              {{ torrent[key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      inview: false,
      torrents: []
    };
  },
  mounted() {
    this.inview = true;

    this.getList();
  },

  beforeDestroy() {
    this.inview = false;
  },

  methods: {
    timer() {
      setTimeout(() => {
        this.getList();
      }, 3000);
    },
    async getList() {
      this.torrents =
        (await this.$http
          .get('/qbittorrent/list')
          .then(res => res.data)
          .catch(() => this.timer())) || [];

      this.torrents = this.torrents
        .map(torrent => ({
          ...torrent,
          completion_on:
            torrent.completion_on === 4294967295 ? null : torrent.completion_on
        }))
        .sort((a, b) => b.added_on - a.added_on)
        .map(torrent => {
          return {
            name: torrent.name,
            ratio: torrent.ratio.toFixed(2),
            downloaded: torrent.downloaded
              ? prettierBytes(torrent.downloaded)
              : null,
            added: dateFns.distanceInWordsStrict(
              new Date(torrent.added_on * 1000),
              new Date()
            ),
            completed: torrent.completion_on
              ? dateFns.distanceInWordsStrict(
                  new Date(torrent.completion_on * 1000),
                  new Date()
                )
              : null,
            dlspeed: `${prettierBytes(torrent.dlspeed || 0)}/s`,
            upspeed: `${prettierBytes(torrent.upspeed || 0)}/s`,
            progress: `${(torrent.progress * 100).toFixed(2)}%`,
            state: torrent.state
          };
        });

      if (this.inview) {
        this.timer();
      }
    }
  }
};
