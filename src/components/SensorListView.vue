<template>

  <b-container>
    <sensor-item v-for="sensor in sensors" :sensor="sensor" :key="sensor.id"/>
  </b-container>

</template>

<script>
  import SensorItem from '@/components/SensorItem'
  import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'

  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'SensorDisplay',
    components: {
      bListGroup,
      SensorItem
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState([
        'sensors'
      ])
    },
    methods: {
      ...mapActions([
        'fetchSensors'
      ])
    },
    beforeMount () {
      this.fetchSensors().then(value => {
        console.log('Retrieved sensors')
      })
      // fetch('http://dgs-collector.ad.dynamicgravitysystems.com/sensor/list/')
      //   .then(response => {
      //     response.json().then(value => {
      //       this.sensors = value
      //     })
      //   }).catch(rejected => {
      //     console.log('Request rejected ' + rejected)
      //   })
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
