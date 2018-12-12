<template>

  <div>
    <b-container>
      <b-row>
        <c-chart v-for="sensor in activeSensors" :chartid="'chart-' + sensor.name" :sensor="sensor" :key="sensor.name"></c-chart>
      </b-row>
    </b-container>
  </div>

</template>

<script>
  import Chart from '@/components/Chart'
  import moment from 'moment'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'GravityChart',
    components: {
      'c-chart': Chart
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
    }
  }
</script>

<style scoped>

</style>
