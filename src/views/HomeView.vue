<template>
  <div class="home">
    <b-carousel id="homeCarousel" :interval="3000" img-height="375px">
      <b-carousel-slide img-src="/static/banner.jpg"/>
    </b-carousel>
    <b-container>
      <b-row>
        <b-col>
          <div class="text-primary">
            <h1 class="text-center display-4">DgS Tools and Projects</h1>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card header="Streaming Gravity" border-variant="primary">
            <p class="card-text">View live streaming gravity from our in-house sensors</p>
            <div slot="footer">Footer Text</div>
          </b-card>

        </b-col>
        <b-col>
          <b-card title="Tidal Gravity">
            <p class="card-text">View and compute tidal gravity corrections for your location</p>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import bJumbotron from 'bootstrap-vue/es/components/jumbotron/jumbotron'
  import bCarousel from 'bootstrap-vue/es/components/carousel/carousel'
  import bCarouselSlide from 'bootstrap-vue/es/components/carousel/carousel-slide'

  export default {
    name: 'home',
    data () {
      return {
        msg: 'Gravity Dashboard Homepage'
      }
    },
    computed: {
    },
    components: {
      bJumbotron,
      bCarousel,
      bCarouselSlide
    }
  }
</script>

<style scoped>

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
