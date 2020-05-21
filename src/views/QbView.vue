<template>
  <div>
    <div class="box clearfix" v-if="connected">
      <ul class="no-list torrent-transferinfo">
        <li title="Download">
          <i class="fas fa-arrow-alt-circle-down"></i>
          <span v-if="transferInfo.alltime_dl">{{ prettierBytes(transferInfo.alltime_dl) }}</span>
          <span v-if="transferInfo.dl_info_speed">({{ prettierBytes(transferInfo.dl_info_speed) }})</span>
        </li>
        <li title="Upload">
          <i class="fas fa-arrow-alt-circle-up"></i>
          <span v-if="transferInfo.alltime_ul">{{ prettierBytes(transferInfo.alltime_ul) }}</span>
          <span v-if="transferInfo.ul_info_speed">({{ prettierBytes(transferInfo.ul_info_speed) }})</span>
        </li>
        <li v-if="transferInfo.free_space_on_disk" title="Free disk space">
          <i class="fas fa-hdd"></i>
          {{ prettierBytes(transferInfo.free_space_on_disk) }}
        </li>
        <li v-if="transferInfo.global_ratio" title="Global ratio">
          <i class="fas fa-arrows-alt-v"></i>
          {{ transferInfo.global_ratio }}
        </li>
      </ul>

      <select v-model="filters.trackerName">
        <option value></option>
        <option v-for="tracker in trackers" :key="tracker" :value="tracker" v-text="tracker"></option>
      </select>
    </div>

    <template v-if="connected">
      <table class="container datalist torrents" v-if="torrents.length > 0">
        <thead>
          <th class="cursor-pointer" @click="sortByKey = 'name'">torrent</th>
          <th class="cursor-pointer" @click="sortByKey = 'ratio'">ratio</th>
          <th class="cursor-pointer" @click="sortByKey = 'downloaded'">downloaded</th>
          <th class="cursor-pointer" @click="sortByKey = 'added_on'">added</th>
          <th class="center-text">
            <i class="fa fa-users" title="Peers"></i>
            /
            <i class="fa fa-seedling" title="Seeders"></i>
          </th>
          <th class="cursor-pointer" @click="sortByKey = 'dlspeed'">dlspeed</th>
          <th class="cursor-pointer" @click="sortByKey = 'upspeed'">ulspeed</th>
          <th class="cursor-pointer" @click="sortByKey = 'trackerName'">tracker</th>
          <th></th>
          <th></th>
        </thead>
        <transition-group tag="tbody" name="list">
          <tr v-for="torrent in sortedList" :class="torrent.state" :key="torrent.name">
            <td v-text="torrent.name"></td>
            <td v-text="torrent.ratio.toFixed(2)"></td>
            <td v-text="prettierBytes(torrent.downloaded || 0)"></td>
            <td v-text="formatDistanceStrict(new Date(), new Date(torrent.added_on * 1000))"></td>
            <td class="center-text" v-text="`${torrent.num_leechs} / ${torrent.num_seeds}`"></td>
            <td v-text="`${prettierBytes(torrent.dlspeed || 0)}/s`"></td>
            <td v-text="`${prettierBytes(torrent.upspeed || 0)}/s`"></td>
            <td v-text="torrent.trackerName"></td>
            <td>
              <progress-bar :progress="+(torrent.progress * 100).toFixed(2)"></progress-bar>
            </td>
            <td :title="torrent.state" v-html="getIcon(torrent.state)"></td>
          </tr>
        </transition-group>
      </table>
    </template>
    <div class="container" v-else>No connection to qbittorrent!</div>
  </div>
</template>

<script>
import { formatDistanceStrict } from "date-fns";
import ProgressBar from "../components/ProgressBar.vue";
const prettierBytes = require("prettier-bytes");

export default {
  name: "Qb",
  components: { ProgressBar },
  data() {
    return {
      inview: false,
      torrents: [],
      connected: true,
      transferInfo: {},
      sortByKey: "added_on",
      filters: {
        trackerName: ""
      }
    };
  },
  mounted() {
    this.inview = true;

    this.getList();
    this.getTransferInfo();

    const info = window.localStorage.getItem("qbit");
    if (info) {
      this.transferInfo = JSON.parse(info);
    }
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
      try {
        const info =
          (await this.$http.get("/qb/transferinfo").then(d => d.data)) || {};
        this.connected = true;

        if (!info.hasOwnProperty("server_state")) {
          return;
        }

        const server = info.server_state;

        Object.keys(server).forEach(k => {
          this.transferInfo[k] = server[k];
        });

        window.localStorage.setItem("qbit", JSON.stringify(this.transferInfo));
      } catch (e) {
        this.connected = false;
      }
    },
    async getList() {
      try {
        this.torrents =
          (await this.$http.get("/qb/list").then(res => res.data)) || [];

        this.torrents = this.torrents.map(torrent => ({
          ...torrent,
          completion_on:
            torrent.completion_on === 4294967295 ? null : torrent.completion_on
        }));
        if (this.inview) {
          this.timer();
        }
      } catch (e) {
        if (this.inview) {
          this.timer();
        }
      }
    },
    getIcon(state) {
      switch (state) {
        case "forcedDOWN":
        case "downloading":
          return "<i class='fas fa-arrow-alt-circle-down'></i>";
        case "forcedUP":
        case "uploading":
          return "<i class='fas fa-arrow-alt-circle-up'></i>";
        case "pausedDL":
          return "<i class='fas fa-pause-circle'></i>";
        case "pauseUL":
          return "<i class='fas fa-pause-circle'></i>";
        case "stalledUP":
          return "<i class='far fa-arrow-alt-circle-up'></i>";
        case "stalledDL":
          return "<i class='far fa-arrow-alt-circle-down'></i>";
        case "queuedUP":
          return `<span class="fa-layers">
            <i class='fas fa-arrow-alt-circle-up'"></i>
            <i style="color: red; font-weight: 300" class='fas fa-pause fa-inverse' data-fa-transform="shrink-5 down-8 right-8"></i>
          </span>`;
        case "queuedDOWN":
          return `<span class="fa-layers">
            <i class='fas fa-arrow-alt-circle-down'"></i>
            <i style="color: red; font-weight: 300" class='fas fa-pause fa-inverse' data-fa-transform="shrink-5 down-8 right-8"></i>
          </span>`;
      }
    },
    prettierBytes,
    formatDistanceStrict
  },

  computed: {
    sortedList() {
      if (!this.torrents) {
        return [];
      }

      let sorted = this.torrents;

      Object.keys(this.filters).forEach(filter => {
        const filterValue = this.filters[filter];
        sorted = sorted.filter(t =>
          !filterValue ? true : t[filter] === filterValue
        );
      });

      return sorted.sort((a, b) => b[this.sortByKey] - a[this.sortByKey]);
    },
    trackers() {
      if (!this.torrents) {
        return [];
      }
      return this.torrents
        .map(t => t.trackerName)
        .filter((item, i, ar) => ar.indexOf(item) === i && item.length);
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  clear: both;
  ul {
    float: left;
  }
  select {
    margin-top: 0;
    float: right;
  }
}
.torrents .stalledUP {
  color: rgb(165, 165, 165) !important;
}

.torrents .uploading {
  color: rgb(250, 143, 81) !important;
}

.torrents .downloading {
  color: rgb(9, 247, 88) !important;
}
.torrent-transferinfo li {
  display: inline-block;
  margin-right: 10px;
  &:last-of-type {
    margin-right: 0;
  }
}
</style>
