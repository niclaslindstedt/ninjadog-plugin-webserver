<template>
  <div class="container">
    <h2>Ninjadog version</h2>
    <span :class="{ upgradable: upgradable.includes('ninjadog') }"
      >Installed: {{ $api.info.version }}</span
    >
    <br />Latest:
    <version-check
      @upgradable="(name) => upgradable.push(name)"
      name="ninjadog"
    ></version-check>
    <h2>Plugin versions</h2>
    <table class="datalist">
      <thead>
        <th>plugin</th>
        <th>installed version</th>
        <th>latest version</th>
        <th></th>
      </thead>
      <tbody>
        <tr
          v-for="plugin in $api.plugins"
          :key="plugin.name"
          :class="{
            upgradable: upgradable.includes(`ninjadog-plugin-${plugin.name}`),
          }"
        >
          <td>{{ plugin.name }}</td>
          <td>{{ plugin.version }}</td>
          <td>
            <version-check
              :name="`ninjadog-plugin-${plugin.name}`"
              :current-version="plugin.version"
              @upgradable="(name) => upgradable.push(name)"
            ></version-check>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import VersionCheck from '../components/VersionCheck.vue';
export default {
  components: { VersionCheck },
  data() {
    return {
      upgradable: [],
    };
  },
};
</script>

<style lang="scss">
@import '../scss/_variables.scss';
.upgradable {
  color: $orange-color;
}
</style>
