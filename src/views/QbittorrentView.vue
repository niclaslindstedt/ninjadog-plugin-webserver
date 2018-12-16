<template>
  <div>
    <div class="box clearfix">
      <ul v-if="transferInfo" class="no-list torrent-transferinfo">
        <li>
          <i class="fas fa-arrow-alt-circle-down"></i>
          {{ transferInfo.dl_info.data }} ({{ transferInfo.dl_info.speed }})
        </li>
        <li>
          <i class="fas fa-arrow-alt-circle-up"></i>
          {{ transferInfo.up_info.data }} ({{ transferInfo.up_info.speed }})
        </li>
      </ul>

      <select v-model="filters.trackerName">
        <option value></option>
        <option v-for="tracker in trackers" :key="tracker" :value="tracker" v-text="tracker"></option>
      </select>
    </div>
    <table class="container datalist torrents" v-if="torrents.length > 0">
      <thead class="cursor-pointer">
        <th @click="sortByKey = 'name'">torrent</th>
        <th @click="sortByKey = 'ratio'">ratio</th>
        <th @click="sortByKey = 'downloaded'">downloaded</th>
        <th @click="sortByKey = 'added_on'">added</th>
        <th @click="sortByKey = 'completion_on'">completed</th>
        <th @click="sortByKey = 'dlspeed'">dlspeed</th>
        <th @click="sortByKey = 'ulspeed'">ulspeed</th>
        <th @click="sortByKey = 'trackerName'">tracker</th>
        <th></th>
        <th></th>
      </thead>
      <transition-group tag="tbody" name="list">
        <tr v-for="torrent in sortedList" :class="torrent.state" :key="torrent.name">
          <td v-text="torrent.name"></td>
          <td v-text="torrent.ratio.toFixed(2)"></td>
          <td v-text="prettierBytes(torrent.downloaded || 0)"></td>
          <td v-text="distanceInWordsStrict(new Date(), new Date(torrent.added_on * 1000))"></td>
          <td
            v-text="torrent.completion_on ? distanceInWordsStrict(new Date(), new Date(torrent.completion_on * 1000)) : ''"
          ></td>
          <td v-text="`${prettierBytes(torrent.dlspeed || 0)}/s`"></td>
          <td v-text="`${prettierBytes(torrent.ulspeed || 0)}/s`"></td>
          <td v-text="torrent.trackerName"></td>
          <td>
            <progress-bar :progress="+(torrent.progress * 100).toFixed(2)"></progress-bar>
          </td>
          <td>
            <i :class="getIcon(torrent.state)"></i>
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script>
import { distanceInWordsStrict } from "date-fns";
import ProgressBar from "../components/ProgressBar.vue";
const prettierBytes = require("prettier-bytes");

export default {
  name: "Qbittorrent",
  components: { ProgressBar },
  data() {
    return {
      inview: false,
      torrents: [],
      transferInfo: null,
      sortByKey: "added",
      filters: {
        trackerName: ""
      }
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
          .get("/qbittorrent/transferinfo")
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
        (await this.$http.get("/qbittorrent/list").then(res => res.data)) || [];

      this.torrents = this.torrents.map(torrent => ({
        ...torrent,
        completion_on:
          torrent.completion_on === 4294967295 ? null : torrent.completion_on
      }));
      if (this.inview) {
        this.timer();
      }
    },
    getIcon(state) {
      switch (state) {
        case "downloading":
          return "fas fa-arrow-alt-circle-up";
        case "uploading":
          return "fas fa-arrow-alt-circle-up";
        case "pausedDL":
          return "fas fa-pause-circle";
        case "pauseUL":
          return "far fa-pause-circle";
        case "stalledUP":
          return "far️ fa-arrow-alt-circle-up";
        case "stalledDOWN":
          return "far️ fa-arrow-alt-circle-down";
      }
    },
    prettierBytes,
    distanceInWordsStrict
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
.torrents .stalledUP td {
  color: rgb(165, 165, 165) !important;
}

.torrents .uploading td {
  color: rgb(250, 143, 81) !important;
}

.torrents .downloading td {
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
