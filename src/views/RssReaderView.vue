<template>
  <div>
    <div class="box">
      <input type="text" @keyup.enter="addShow" placeholder="Add show" ref="showinput" />
    </div>
    <div class="container">
      <h2>Active shows</h2>
      <table class="datalist four-columns" v-if="shows.length > 0">
        <thead>
          <th>Name</th>
          <th class="center-text">Downloads</th>
          <th class="center-text">Copy to</th>
          <th class="center-text">Last download</th>
          <th class="center-text">Remove</th>
        </thead>
        <transition-group tag="tbody" name="list">
          <tr v-for="(entry, index) in sortedShows" :key="`s${index}`">
            <td v-text="entry.show.name"></td>
            <td class="center-text" v-text="entry.downloads.length"></td>
            <td class="center-text" v-text="entry.show.copyTo"></td>
            <td class="center-text" v-text="lastDownload(entry)"></td>
            <td class="center-text">
              <span @click="remove(entry)">
                <i class="fas fa-trash-alt cursor-pointer"></i>
              </span>
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
            <tr v-for="(entry, index) in removedSortedShows" :key="`r${index}`">
              <td v-text="entry.show.name"></td>
              <td class="center-text">
                <span @click="restore(entry)" class="cursor-pointer">
                  <i class="fas fa-redo"></i>
                </span>
              </td>
            </tr>
          </transition-group>
        </table>
      </template>
    </div>
  </div>
</template>

<script>
import { sortByName } from "../helpers/sort.js";
import formatDistanceStrict from "date-fns/formatDistanceStrict";

export default {
  name: "RssReader",
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
      .get("/rss/removed-shows")
      .then(res => res.data);
  },

  beforeDestroy() {
    this.inview = false;
  },

  methods: {
    async showsTimer() {
      this.shows = await this.$http.get("/rss/shows").then(res => res.data);

      if (this.inview) {
        setTimeout(() => {
          this.showsTimer();
        }, 180000);
      }
    },
    async remove(entry) {
      await this.$http.delete("/rss/shows", {
        params: { show: entry.show.name }
      });
      this.shows.splice(
        this.shows.findIndex(s => s.name === entry.show.name),
        1
      );
      this.removedShows.push(entry);
    },
    async restore(entry) {
      await this.$http.delete("/rss/removed-shows", {
        params: { show: entry.show.name }
      });
      this.removedShows.splice(
        this.removedShows.findIndex(s => s.name === entry.show.name),
        1
      );
      this.shows.push(entry);
    },
    async addShow(e) {
      if (this.loading === true) {
        return;
      }

      const show = e.target.value;
      this.loading = true;
      try {
        const resp = await this.$http.post("/rss/shows", { show });
        const newShow = resp.data;
        this.$refs.showinput.value = "";
        this.shows.push({ show: newShow, downloads: [] });
      } catch (error) {
        console.log("error");
      }
      this.loading = false;
    },

    lastDownload(show) {
      const last = show.downloads.slice(0).pop();
      if (!last) {
        return "";
      }
      return formatDistanceStrict(new Date(), new Date(last.date));
    }
  },

  computed: {
    sortedShows() {
      if (!this.shows) {
        return [];
      }
      return this.shows.slice().sort(sortByName);
    },
    removedSortedShows() {
      return this.removedShows.slice().sort(sortByName);
    }
  }
};
</script>

<style></style>
