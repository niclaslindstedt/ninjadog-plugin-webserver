import { sortString } from './helpers/sort.js';

export default {
  name: 'App',
  template: `
    <div class="container">
      <nav>
        <router-link to="/" class="logo">( ^ , ^)~~~~</router-link>
        <ul class="inline-block">
          <li v-for="plugin in pluginsWithRoute" class="inline-block">
            <router-link :to="plugin" v-text="plugin"></router-link>
          </li>
        </ul>
      </nav>     
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  `,
  mounted() {},

  computed: {
    pluginsWithRoute() {
      const activeRoutes = this.$router.options.routes.map((r) => r.name);
      return this.$api.plugins
        .filter((p) => activeRoutes.indexOf(p) > -1)
        .sort(sortString);
    }
  }
};
