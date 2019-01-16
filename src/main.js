import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
// import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import bContainer from 'bootstrap-vue/es/components/layout/container'
import bRow from 'bootstrap-vue/es/components/layout/row'
import bCol from 'bootstrap-vue/es/components/layout/col'

import bNavbar from 'bootstrap-vue/es/components/navbar/navbar'
import bNavbarBrand from 'bootstrap-vue/es/components/navbar/navbar-brand'
import bNavbarNav from 'bootstrap-vue/es/components/navbar/navbar-nav'
import bnavbarToggle from 'bootstrap-vue/es/components/navbar/navbar-toggle'
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
import bCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import vBToggle from 'bootstrap-vue/es/directives/toggle/toggle'

import bCard from 'bootstrap-vue/es/components/card/card'
import bCardHeader from 'bootstrap-vue/es/components/card/card-header'
import bCardFooter from 'bootstrap-vue/es/components/card/card-footer'
import bCardGroup from 'bootstrap-vue/es/components/card/card-group'

import bFormSelect from 'bootstrap-vue/es/components/form-select/form-select'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'

import bPopover from 'bootstrap-vue/es/components/popover/popover'

import { Collapse, Button, ButtonGroup, FormRadio, InputGroup } from 'bootstrap-vue/es/components'

Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Collapse)
Vue.use(FormRadio)
Vue.use(InputGroup)

Vue.component('b-container', bContainer)
Vue.component('b-row', bRow)
Vue.component('b-col', bCol)
Vue.component('b-navbar', bNavbar)
Vue.component('b-navbar-nav', bNavbarNav)
Vue.component('b-navbar-brand', bNavbarBrand)
Vue.component('b-navbar-toggle', bnavbarToggle)
Vue.component('b-nav-item', bNavItem)

Vue.component('b-collapse', bCollapse)
Vue.directive('v-b-toggle', vBToggle)

Vue.component('b-card', bCard)
Vue.component('b-card-header', bCardHeader)
Vue.component('b-card-footer', bCardFooter)
Vue.component('b-card-group', bCardGroup)

Vue.component('b-form-select', bFormSelect)
Vue.component('b-form-group', bFormGroup)
Vue.component('b-form-input', bFormInput)

Vue.component('b-popover', bPopover)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
