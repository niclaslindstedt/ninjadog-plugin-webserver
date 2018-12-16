<template>
  <div>
    <div class="box">
      <input type="text" @keyup.enter="addShow" placeholder="Add show" ref="showinput">
    </div>
    <div class="container">
      <h2>Active shows</h2>
      <table class="datalist four-columns" v-if="shows.length > 0">
        <thead>
          <th>Name</th>
          <th class="center-text">Downloads</th>
          <th class="center-text">Last download</th>
          <th class="center-text">Remove</th>
        </thead>
        <transition-group tag="tbody" name="list">
          <tr v-for="show in sortedShows" :key="show.name">
            <td v-text="show.name"></td>
            <td class="center-text" v-text="show.downloads.length"></td>
            <td class="center-text" v-text="lastDownload(show)"></td>
            <td class="center-text">
              <i class="fas fa-trash-alt cursor-pointer" @click="remove(show)"></i>
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
            <tr v-for="(show, index) in removedSortedShows" :key="index">
              <td v-text="show.name"></td>
              <td class="center-text">
                <i class="fas fa-redo cursor-pointer" @click="restore(show)">️</i>
              </td>
            </tr>
          </transition-group>
        </table>
      </template>
    </div>
  </div>
</template>

<script>
import { distanceInWordsStrict } from "date-fns";
import { sortByName } from "../helpers/sort.js";

export default {
  name: "Qbittorrent",
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
      .get("/torrentrss/removed-shows")
      .then(res => res.data);
  },

  beforeDestroy() {
    this.inview = false;
  },

  methods: {
    async showsTimer() {
      this.shows = await this.$http
        .get("/torrentrss/shows")
        .then(res => res.data);

      if (this.inview) {
        setTimeout(() => {
          this.showsTimer();
        }, 180000);
      }
    },
    async remove(show) {
      await this.$http.delete("/torrentrss/shows", {
        params: { show: show.name }
      });
      this.shows.splice(this.shows.findIndex(s => s.name === show.name), 1);
      this.removedShows.push(show);
    },
    async restore(show) {
      await this.$http.delete("/torrentrss/removed-shows", {
        params: { show: show.name }
      });
      this.removedShows.splice(
        this.removedShows.findIndex(s => s.name === show.name),
        1
      );
      this.shows.push(show);
    },
    async addShow(e) {
      if (this.loading === true) {
        return;
      }

      const show = e.target.value;
      this.loading = true;
      try {
        await this.$http.post("/torrentrss/shows", { show });
        this.$refs.showinput.value = "";
        this.shows.push({ name: show, downloads: [] });
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
      return distanceInWordsStrict(new Date(), new Date(last.date));
    }
  },

  computed: {
    sortedShows() {
      return this.shows.sort(sortByName);
    },
    removedSortedShows() {
      return this.removedShows.sort(sortByName);
    }
  }
};
</script>

<style>
</style>
