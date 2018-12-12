<template>
  <b-card :title="sensor.name" style="width: 100%">
    <b-row>
      <b-col><b-form-input v-model="points.length"></b-form-input></b-col>
      <b-col cols="8">
        <b-input-group>
          <b-input-group-text>Refresh</b-input-group-text>
          <b-form-select v-model="state.refresh" :options="refresh_opts"/>
          <b-input-group-text>Window</b-input-group-text>
          <b-form-select v-model="state.window" :options="window_opts"/>
          <b-form-radio-group id="refreshEnabled" buttons v-model="state.enabled"
                              :options="enabled_opts" button-variant="outline-primary"
                              name="refreshEnabled"/>
        </b-input-group>
      </b-col>
      <b-col/>
    </b-row>
    <b-row>
      <div :id="labeldiv"></div>
      <div :id="chartid" class="chart-container" style="width: 100%"></div>
    </b-row>
  </b-card>
</template>

<script>
  import Dygraph from 'dygraphs'
  import moment from 'moment'
  import {mapState} from 'vuex'

  function updateChart (chart, points) {
    return new Promise((resolve) => {
      chart.updateOptions({file: points})
      return resolve(true)
    })
  }

  export default {
    name: 'Chart',
    props: {
      'chartid': String,
      'sensor': Object
    },
    data () {
      return {
        chart: null,
        points: [
          [new Date(), 10000.0]
        ],
        timeout_id: -1,
        labeldiv: this.chartid + '-labels',
        decimate: 10,
        state: {
          window: 86400,
          refresh: 5000,
          enabled: true
        },
        enabled_opts: [
          {value: true, text: 'Enabled'},
          {value: false, text: 'Disabled'}
        ],
        refresh_opts: [
          {value: 1000, text: '1 Second'},
          {value: 5000, text: '5 Seconds'},
          {value: 10000, text: '10 Seconds'}
        ],
        window_opts: [
          {value: 60, text: '1 Minute'},
          {value: 600, text: '10 Minutes'},
          {value: 3600, text: '1 Hour'},
          {value: 86400, text: '1 Day'}
        ]
      }
    },
    computed: {
      ...mapState([
        'endpoint'
      ]),
      sid: function () {
        return this.sensor.id
      },
      storageKey: function () {
        return `sensor_data_${this.sid}`
      },
      window: function () {
        return this.state.window / this.decimate
      }
    },
    methods: {
      requestURI: function () {
        return `${this.endpoint}view/${this.sid}/${this.lastDate().valueOf()}?decimate=${this.decimate}`
      },
      lastDate: function () {
        if (this.points.length > 1) {
          return moment(this.points[this.points.length - 1][0])
        } else {
          console.log(`fetching data from ${this.state.window} seconds ago`)
          return moment().subtract(this.state.window, 'seconds')
        }
      },
      fetch_next: function () {
        // fetch next data from server
        clearTimeout(this.timeout_id)
        fetch(this.requestURI())
          .then(response => {
            response.json().then(value => {
              if (value['data'].length < 1) {
                console.debug('Received no data from server')
              } else {
                console.debug(`fetched ${value['data'].length} points`)
                value['data'].forEach(line => {
                  this.points.push([new Date(line.datetime), line.gravity])
                })
                while (this.points.length > this.window) {
                  // Remove points outside of the window length
                  this.points.shift()
                }
                updateChart(this.chart, this.points)
              }
              if (this.state.enabled) {
                this.timeout_id = setTimeout(this.fetch_next, this.state.refresh)
              }
            })
          }).catch(reason => {
            console.log(`Fetch rejected: ${reason}`)
          })
      },
      get_state: function () {
        console.debug('retrieved graph state from LS')
        let state = localStorage.getItem(`state${this.sensor.id}`)
        if (state !== null) {
          try {
            state = JSON.parse(state)
            this.state.enabled = state.enabled
            this.state.window = state.window
            this.state.refresh = state.refresh
            // Object.assign(state, this.state)
          } catch (err) {
            console.error('Unable to extract chart state')
          }
        }
      },
      put_state () {
        console.debug('saving graph control state to LS')
        localStorage.setItem(`state${this.sensor.id}`, JSON.stringify(this.state))
      }
    },
    watch: {
      'state.enabled': function (enabled, oldEnabled) {
        if (enabled !== oldEnabled) {
          this.put_state()
          if (!enabled) {
            console.debug('Pausing chart')
            clearTimeout(this.timeout_id)
          } else {
            console.debug('Resuming chart')
            this.timeout_id = setTimeout(this.fetch_next, this.state.refresh)
          }
        }
      },
      'state.refresh': function (refresh, oldRefresh) {
        if (refresh !== oldRefresh) {
          this.put_state()
          console.debug('updating timeout interval')
          // this.fetch_next()
          // this.timeout_id = setTimeout(this.fetch_next, this.state.refresh)
        }
      },
      'state.window': function (window, oldWindow) {
        this.put_state()
        if (window > oldWindow) {
          console.debug(`window length increased to ${window}`)
          clearTimeout(this.timeout_id)
          this.points = []
          updateChart(this.chart, this.points)
          this.timeout_id = setTimeout(this.fetch_next, this.state.refresh)
        } else {
          console.debug('trimming extra points')
          while (this.points.length > this.window) {
            this.points.shift()
          }
          updateChart(this.chart, this.points)
        }
      }
    },
    created () {
      this.get_state()
    },
    mounted () {
      this.chart = new Dygraph(
        this.chartid,
        this.points,
        {
          hideOverlayOnMouseOut: true,
          legend: 'always',
          labels: ['Date', 'Gravity (mGals)'],
          labelsDiv: this.labeldiv,
          showRangeSelector: true
        })
      this.points.shift()
      if (this.state.enabled) {
        console.debug('chart mounted, fetching data')
        // clearTimeout(this.timeout_id)
        this.fetch_next()
      }
    },
    beforeDestroy () {
      clearTimeout(this.timeout_id)
    }
  }
</script>

<style scoped>
  .chart-container {
    width: 100%;
    height: 500px;
  }
</style>
