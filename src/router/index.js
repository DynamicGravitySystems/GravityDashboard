import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SensorDisplay from '@/components/SensorListView'
import GravityChart from '@/components/GravityChartView'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/sensor',
      name: 'SensorDisplay',
      component: SensorDisplay
    },
    {
      path: '/gravity',
      name: 'GravityChart',
      component: GravityChart
    }
  ]
})
