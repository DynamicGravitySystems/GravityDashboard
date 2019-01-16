import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/HomeView'
import SensorDisplay from '@/views/SensorListView'
import GravityChart from '@/views/GravityChartView'
import TideGravity from '@/views/TideView'

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
      components: {
        default: GravityChart
      }
    },
    {
      path: '/tide',
      name: 'TideGravity',
      component: TideGravity
    }
  ]
})
