<template>
  <div class="home">
    <b-jumbotron header="Dynamic Gravity Dashboard">
      <p>click the links to do stuff</p>
      <template slot="lead">
        Lead line stuff here
      </template>
    </b-jumbotron>
    <b-container>
      <b-row>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import bJumbotron from 'bootstrap-vue/es/components/jumbotron/jumbotron'
  export default {
    name: 'home',
    data () {
      return {
        msg: 'Gravity Dashboard Homepage'
      }
    },
    components: {
      'b-jumbotron': bJumbotron
    }
  }
</script>

<style scoped>
  .col {
    outline: 1px solid red;
  }
  .row {
    outline: 1px dashed blue;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
