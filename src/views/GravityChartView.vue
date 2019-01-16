<template>
  <b-container>
    <b-row>
      <b-col id="nopad">
        <b-card title="Realtime Gravity Display" img-src="/static/banner3.jpg">
          <p class="card-text">View realtime gravity data from gravity meters currently active at our office.</p>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <!--<c-chart v-for="sensor in activeSensors" :chartid="'chart-' + sensor.name" :sensor="sensor"-->
               <!--:key="sensor.name" :name="sensor.name + '-chart'"></c-chart>-->
    </b-row>
    <b-row>
      <g-chart v-for="sensor in activeSensors"  :sensorname="sensor.name" :sensortype="sensor.type" :sensorid="sensor.id"  :key="sensor.name"></g-chart>
    </b-row>

  </b-container>
</template>

<script>
  import Chart from '../components/ChartComponent'
  import Chart2 from '../components/GravityChartComponent'
  import moment from 'moment'
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'GravityChartView',
    components: {
      'c-chart': Chart,
      'g-chart': Chart2
    },
    methods: {
      ...mapActions([
        'fetchSensors'
      ])
    },
    computed: {
      ...mapState([
        'sensors'
      ]),
      activeSensors: function () {
        return this.sensors.filter(value => {
          if (value.lastdata) {
            return moment().subtract(30, 'minutes') < moment.unix(value.lastdata)
          } else {
            return false
          }
        })
      }
    },
    beforeMount () {
      this.fetchSensors()
    },
    deactivated () {
      console.debug('Chart view deactivated')
    },
    activated () {
      console.debug('Chart view activated')
    }
  }
</script>

<style scoped>
  .row {
    margin: 10px 0;
  }

  #nopad {
    padding: 0;
  }

</style>
