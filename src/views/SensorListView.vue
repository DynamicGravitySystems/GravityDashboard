<template>

  <b-container>
    <!--<sensor-item v-for="sensor in sensors" :sensor="sensor" :key="sensor.id"/>-->
    <b-row>
      <b-col>
        <b-card title="Sensor Listing" img-src="/static/banner.jpg">
          <p class="card-text">View a list of current and previously active gravity sensors, as well as their
            configuration/calibration parameters. Optionally download a sample of the raw data from specific sensors.</p>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table :items="sensors" :fields="fields">
          <template slot="lastdata" slot-scope="data">
            {{ formatDate(data.value) }}

          </template>
          <template slot="actions" slot-scope="row">
            <b-button-group>
              <b-button size="sm" variant="primary" @click.stop="row.toggleDetails">Configuration</b-button>
              <b-button size="sm" id="rawData" @click.stop="">Raw Data</b-button>
              <b-popover target="rawData" title="Raw Data" triggers="hover" content="Download raw data" placement="topright"/>
            </b-button-group>
          </template>
          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row>
                <ConfigurationDisplay :config="row.item.config" />
              </b-row>
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
  import SensorItem from '../components/SensorItem'
  import ConfigurationDisplay from '../components/ConfigurationDisplayComponent'
  import bTable from 'bootstrap-vue/es/components/table/table'
  import bListGroup from 'bootstrap-vue/es/components/list-group/list-group'
  import bButton from 'bootstrap-vue/es/components/button/button'

  import { mapState, mapActions } from 'vuex'

  import moment from 'moment'

  export default {
    name: 'SensorDisplay',
    components: {
      bButton,
      bListGroup,
      bTable,
      SensorItem,
      ConfigurationDisplay
    },
    data () {
      return {
        fields: ['name', 'lastdata', 'type', 'actions']
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
      ]),
      formatDate (date) {
        if (date !== undefined) {
          return moment.unix(date).format('YYYY-MM-DD HH:mm:ss ')
        } else {
          return 'No Activity'
        }
      }
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
