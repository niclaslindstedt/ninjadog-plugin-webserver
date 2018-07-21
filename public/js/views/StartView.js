export default {
  name: 'Start',
  template: `
    <div>
      start
      <h4>Routes</h4>
      <ul>
        <li v-for="route in $api.routes" v-text="route"></li>
      </ul>
    </div>
  `,
  mounted() {}
};
