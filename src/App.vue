<template>
  <div id="app">
    <b-navbar type="light" :sticky="true" variant="primary" toggleable="lg">
      <b-navbar-brand href="#">DgS</b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/gravity">Live Display</b-nav-item>
          <b-nav-item to="/sensor">Sensors</b-nav-item>
        </b-navbar-nav>
    </b-navbar>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {
    }
  }
</script>

<style lang="scss">
  @import 'override';
  @import '../node_modules/bootstrap/scss/bootstrap';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

  .navbar {
    margin-bottom: 10px;
  }

</style>
