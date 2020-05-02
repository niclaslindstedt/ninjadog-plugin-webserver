<template>
  <div class="container">
    <h4>Routes</h4>
    <ul>
      <li v-for="(route, i) in $api.routes" v-text="route" :key="i"></li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
