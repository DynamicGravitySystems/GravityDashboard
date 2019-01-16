<template>
  <div id="app">
    <b-navbar type="light" variant="light" :sticky="true" toggleable="md">
      <b-container>
        <b-navbar-brand to="/">
          <img id="logo" alt="Dynamic Gravity Systems" src="./assets/dgslogo.png"/>
          Dynamic Gravity Systems
        </b-navbar-brand>
        <b-navbar-toggle target="nav_collapse" />
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/" active-class="router-link-active">Home</b-nav-item>
            <b-nav-item to="/gravity">Live Display</b-nav-item>
            <b-nav-item to="/sensor">Sensors</b-nav-item>
            <b-nav-item to="/tide">Tide</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <keep-alive include="GravityChartView">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {}
  }
</script>

<style lang="scss">
  @import 'override';
  @import '../node_modules/bootstrap/scss/bootstrap';

  html {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #app {
    text-align: center;
    color: #2c3e50;
  }


  .navbar {
    padding: 5px;
    margin-bottom: 0;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    font-weight: 400;

  }

  #logo {
    height: 50px;
    width: 50px;
    margin: 0 10px;
  }

</style>
