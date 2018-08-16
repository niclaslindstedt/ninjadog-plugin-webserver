export default {
  name: 'Qbittorrent',
  template: `
    <div>
      <ul v-if="transferInfo" class="no-list torrent-transferinfo"><li>download: {{ transferInfo.dl_info.data }} ({{ transferInfo.dl_info.speed }})</li><li>ul: {{ transferInfo.up_info.data }} ({{ transferInfo.up_info.speed }})</li></ul>
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
      torrents: [],
      transferInfo: null
    };
  },
  mounted() {
    this.inview = true;

    this.getList();
    this.getTransferInfo();
  },

  beforeDestroy() {
    this.inview = false;
  },

  methods: {
    timer() {
      setTimeout(() => {
        this.getList();
        this.getTransferInfo();
      }, 3000);
    },

    async getTransferInfo() {
      this.transferInfo =
        (await this.$http
          .get('/qbittorrent/transferinfo')
          .then(res => res.data)) || [];

      const ti = this.transferInfo;

      this.transferInfo = {
        global_ratio: ti.global_ratio,
        dl_info: {
          data: prettierBytes(ti.dl_info_data),
          speed: `${prettierBytes(ti.dl_info_speed)}/s`,
          limit: ti.dl_info_limit
        },
        up_info: {
          data: prettierBytes(ti.up_info_data),
          speed: `${prettierBytes(ti.up_info_speed)}/s`,
          limit: ti.up_info_limit
        }
      };
    },
    async getList() {
      this.torrents =
        (await this.$http.get('/qbittorrent/list').then(res => res.data)) || [];

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
              new Date(),
              new Date(torrent.added_on * 1000)
            ),
            completed: torrent.completion_on
              ? dateFns.distanceInWordsStrict(
                  new Date(),
                  new Date(torrent.completion_on * 1000)
                )
              : null,
            dlspeed: `${prettierBytes(torrent.dlspeed || 0)}/s`,
            upspeed: `${prettierBytes(torrent.upspeed || 0)}/s`,
            progress: `${(torrent.progress * 100).toFixed(2)}%`,
            tracker: torrent.trackerName,
            state: torrent.state
          };
        });

      if (this.inview) {
        this.timer();
      }
    }
  }
};
