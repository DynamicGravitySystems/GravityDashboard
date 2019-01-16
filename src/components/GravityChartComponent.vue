<template>
  <b-card :title="sensorname" class="chart-container" style="width: 100%">
    <b-row align-h="center">
      <b-col cols="7">
        <b-input-group>
          <b-button v-b-toggle="getid('debug')">Details</b-button>
          <b-input-group-text id="refresh-label">Filtering</b-input-group-text>
          <b-popover target="refresh-label" triggers="hover"
                     content="Configure curve filtering (smoothing)." placement="top"/>
          <b-form-select v-model="state.smoothing" :options="smoothing_opts"/>
          <b-input-group-text id="window-label">Window</b-input-group-text>
          <b-popover target="window-label" triggers="hover" content="Set the window length of the plot"
                     placement="top"/>
          <b-form-select v-model="state.window" :options="window_opts"/>
          <b-button variant="success" :disabled="refresh_disabled" @click="set_options">Set Options</b-button>
        </b-input-group>
      </b-col>
      <b-col cols="3">
        <b-input-group>
          <b-form-radio-group id="refreshEnabled" buttons v-model="state.enabled"
                              :options="enabled_opts" button-variant="outline-primary"
                              name="refreshEnabled"/>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row>
      <div :id="labeldiv"></div>
      <div :id="chartid" class="chart-container" style="width: 100%"></div>
    </b-row>
    <b-row style="margin-top: 5px;">
    </b-row>
    <b-row>
      <b-col>
        <b-collapse :id="getid('debug')">
          <b-card title="Debug Info">
            <b-row>
              <b-col cols="6">
                <b-form-group label="Sensor Name" horizontal>
                  <b-form-input :value="sensorname" readonly></b-form-input>
                </b-form-group>
                <b-form-group label="Data Points" horizontal>
                  <b-form-input :value="points.length" readonly></b-form-input>
                </b-form-group>
                <b-form-group label="Buffer Length" horizontal>
                  <b-form-input :value="buffer.length" readonly></b-form-input>
                </b-form-group>
              </b-col>
              <b-col cols="6">
                <b-form-group label="Sensor Type" horizontal>
                  <b-form-input :value="sensortype" readonly></b-form-input>
                </b-form-group>
                <b-form-group label="Last Fetch" horizontal>
                  <b-form-input :value="last_fetch" readonly></b-form-input>
                </b-form-group>
                <b-form-group label="Last Value" horizontal>
                  <b-form-input :value="last_value" readonly></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
  import {mapState} from 'vuex'
  import moment from 'moment'
  import Dygraph from 'dygraphs'

  export default {
    name: 'GravityChartComponent',
    props: {
      'sensorname': String,
      'sensortype': String,
      'sensorid': Number
    },
    data () {
      return {
        chart: undefined,
        buffer: [],
        filtBuffer: [],
        fetch_id: -1,  // fetch timeout ID
        draw_id: -1,  // draw timeout ID
        buffer_reserve: 60,
        frequency: 1,
        initialized: false,
        last_fetch: null,
        last_value: 0,
        fetch_interval: 60000,
        draw_interval: 1000,
        retries: 0,
        points: [
          [new Date(), 10000.0]
        ],
        state: {
          enabled: true,
          window: 600,
          smoothing: 0.3,
          filter_len: 100
        },
        smoothing_opts: [
          {value: 0.1, text: '10%'},
          {value: 0.3, text: '30%'},
          {value: 0.5, text: '50%'}
        ],
        enabled_opts: [
          {value: true, text: 'Enabled'},
          {value: false, text: 'Disabled'}
        ],
        window_opts: [
          {value: 60, text: '1 Minute'},
          {value: 600, text: '10 Minutes'},
          {value: 3600, text: '1 Hour'},
          {value: 86400, text: '1 Day'}
        ],
        refresh_disabled: true
      }
    },
    // Lifecycle functions
    created () {
      this.get_state()
    },
    mounted () {
      this.makeChart()
      this.resume_chart()
    },
    activated () {
      console.debug('chart activated')
      if (this.state.enabled) {
        this.resume_chart()
      }
    },
    deactivated () {
      console.debug('chart deactivated')
      this.pause_chart()
    },
    beforeDestroy () {
      console.debug('Destroying chart')
      clearTimeout(this.fetch_id)
      clearTimeout(this.draw_id)
    },
    computed: {
      ...mapState([
        'endpoint'
      ]),
      chartid: function () {
        return `chart-${this.sensorid}`
      },
      labeldiv: function () {
        return `${this.chartid}-labels`
      },
      maxpoints: function () {
        return Math.floor(this.state.window / this.frequency)
      },
      statekey: function () {
        return `state-${this.sensorid}-${this.sensorname}`
      }
    },
    methods: {
      getid (name) {
        return `id-${this.sensorid}-${name}`
      },
      lpf: function (nextValue) {
        // simple low pass filter of streamed values
        let smoothing = this.state.smoothing
        let removed = (this.filtBuffer.length === this.state.filter_len) ? this.filtBuffer.shift() : 0 // take first value from buffer
        this.filtBuffer.push(nextValue)  // append next value to end
        let result = this.filtBuffer.reduce((accumulator, current) => {
          return smoothing * current + (1 - smoothing) * accumulator
        }, removed)
        this.filtBuffer[this.filtBuffer.length - 1] = result
        return result
      },
      delta: function () {
        if (this.last_fetch === null) {
          return this.state.window + this.buffer_reserve
        } else {
          return moment().diff(this.last_fetch, 'seconds')
        }
      },
      jitter: function () {
        return Math.random() * 1000
      },
      redraw: function () {
        this.chart.updateOptions({file: this.points})
      },
      fetchData: async function () {
        // Fetch sensor data from the REST API, then reset timeout callback
        clearTimeout(this.fetch_id)
        if (this.buffer.length < this.buffer_reserve) {
          console.debug(`Fetching data for ${this.sensorname}, there are ${this.buffer.length} items in the buffer`)
          let requestURI = `${this.endpoint}/view/${this.sensorid}?start=${this.delta()}&decimate=${this.frequency}`
          try {
            let response = await fetch(requestURI)
            let json = await response.json()
            if (json['data'].length === 0) {
              console.debug('Received no data from endpoint.')
              this.retries += 1
            } else {
              this.retries = 0
              console.debug(`Fetched ${json['data'].length} items for ${this.sensorname}`)
              this.last_fetch = moment()
              json['data'].forEach(item => {
                this.buffer.push(item)
              })
            }
          } catch (err) {
            console.debug(err)
          }
        }
        if (this.state.enabled) {
          this.fetch_id = setTimeout(this.fetchData, this.fetch_interval + this.jitter())
        }
      },
      drawInitial: function () {
        console.debug(`Plotting initial data for sensor: ${this.sensorname}`)
        while (this.points.length > 0) {
          this.points.shift()
        }
        while (this.buffer.length > this.buffer_reserve) {
          let item = this.buffer.shift()
          this.points.push([new Date(item.datetime), this.lpf(item.gravity)])
        }
        console.debug('Plotted initial data, points left in buffer: ' + this.buffer.length)
        this.redraw()
      },
      updateChart: function () {
        clearTimeout(this.draw_id)
        if (!this.initialized) {
          // draw all points from buffer (leave some until next fetch?)
          this.drawInitial()
          this.initialized = true
        }
        if (this.buffer.length > 0) {
          let item = this.buffer.shift()
          // this.points.push([new Date(item.datetime), this.lpf(item.gravity)])
          this.points.push([new Date(item.datetime), item.gravity])
          this.last_value = item.gravity
          if (this.points.length > this.maxpoints) {
            this.points.shift()
          }
          this.redraw()
        }
        if (this.buffer.length < 2 && this.state.enabled) {
          if (this.retries <= 3) {
            console.debug('Overriding timeout to fetch more data')
            clearTimeout(this.fetch_id)
            this.fetchData()
          }
        }
        this.draw_id = setTimeout(this.updateChart, this.draw_interval)
      },
      makeChart () {
        this.chart = new Dygraph(
          this.chartid,
          this.points,
          {
            hideOverlayOnMouseOut: true,
            legend: 'always',
            labels: ['Date', 'Gravity (mGals)'],
            labelsDiv: this.labeldiv,
            showRangeSelector: true
          }
        )
        this.points.shift()
      },
      get_state () {
        let state = localStorage.getItem(this.statekey)
        if (state !== null) {
          try {
            state = JSON.parse(state)
            this.state.enabled = state.enabled
            this.state.window = state.window
            this.state.smoothing = state.smoothing
            // Object.assign(state, this.state)
          } catch (err) {
            console.error('Unable to extract chart state')
          }
        }
      },
      set_state () {
        localStorage.setItem(this.statekey, JSON.stringify(this.state))
      },
      set_options () {
        console.debug('setting chart options')
        this.refresh_disabled = true
      },
      option_changed () {
        this.set_state()
        this.refresh_disabled = false
      },
      pause_chart () {
        clearTimeout(this.fetch_id)
        clearTimeout(this.draw_id)
      },
      resume_chart () {
        this.fetchData().then(() => this.updateChart())
      }
    },
    watch: {
      'state.enabled': function (newState, oldState) {
        if (newState === true) {
          console.debug('Resuming chart')
          this.resume_chart()
        } else {
          console.debug('Pausing chart')
          this.pause_chart()
        }
        this.set_state()
      },
      'state.window': function (newState, oldState) {
        this.option_changed()
      },
      'state.smoothing': function (newState, oldState) {
        this.option_changed()
      }
    }
  }
</script>

<style scoped>
  .chart-container {
    width: 100%;
  }

</style>
