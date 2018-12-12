import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const localStorageWatcher = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'sensors') {
      console.debug('saving sensors to local storage')
      localStorage.setItem('sensors', JSON.stringify(state.sensors))
      const meta = {
        created: moment()
      }
      localStorage.setItem('sensors_meta', JSON.stringify(meta))
    }
  })
}

export default new Vuex.Store({
  plugins: [localStorageWatcher],
  state: {
    // endpoint: 'http://dgs-collector.ad.dynamicgravitysystems.com/',
    endpoint: 'http://localhost:5000/',
    sensors: [],
    sensorsAge: null,
    test: 0
  },
  getters: {
  },
  mutations: {
    sensors (state, data) {
      state.sensors = data
    }
  },
  actions: {
    fetchSensors ({commit, state}) {
      fetch(state.endpoint + 'sensor/list/').then(response => {
        response.json().then(value => {
          commit('sensors', value)
        })
      }).catch(reason => {
        console.error('Request rejected for sensor list')
      })
    }
  }
})
