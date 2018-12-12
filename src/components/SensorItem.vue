<template>

  <b-card>
    <b-row>
      <b-col sm="3" class="text-left">
        <b-badge v-if="is_active" variant="success">Active</b-badge>
        {{sensor.name}}
      </b-col>
      <b-col>Last Active: {{last_active}}</b-col>
      <b-col align="right">
        <b-button-group>
          <b-button @click="download" size="sm" variant="secondary">Raw Data</b-button>
          <b-button @click="activate" size="sm" variant="success">Configuration</b-button>
        </b-button-group>
      </b-col>
    </b-row>
    <b-collapse :id="collapse_id" v-model="collapsed">
      <p class="text-left">
        <b-table stacked :items="[sensor.config]"/>
      </p>
    </b-collapse>
  </b-card>
</template>

<script>
  import bBadge from 'bootstrap-vue/es/components/badge/badge'
  import bTable from 'bootstrap-vue/es/components/table/table'
  import bButton from 'bootstrap-vue/es/components/button/button'
  import moment from 'moment'

  export default {
    name: 'SensorItem',
    data () {
      return {
        collapsed: false
      }
    },
    props: {
      'sensor': Object
    },
    components: {
      'b-badge': bBadge,
      'b-table': bTable,
      'b-button': bButton
    },
    computed: {
      collapse_id: function () {
        return this.sensor.name + '-collapse'
      },
      last_active: function () {
        if (this.sensor.lastdata) {
          return new Date(this.sensor.lastdata * 1000)
        } else {
          return 'No Data'
        }
      },
      is_active: function () {
        if (this.sensor.lastdata) {
          const lastActive = moment(new Date(this.sensor.lastdata * 1000))
          return moment().subtract(30, 'minutes') < lastActive
        } else {
          return false
        }
      }
    },
    methods: {
      activate: function () {
        // Fetch configuration here when expanding?
        this.collapsed = !this.collapsed
      },
      download: function () {
        console.log('downloading data')
      }
    }
  }
</script>

<style scoped>

</style>
