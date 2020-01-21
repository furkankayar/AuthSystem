import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import VueCookie from 'vue-cookie'
import Vuelidate from 'vuelidate'
import BootstrapVue from 'bootstrap-vue'
import DatePicker from 'vue-bootstrap-datetimepicker'
import VueMultiselect from 'vue-multiselect'
import VueListPicker from 'vue-list-picker'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@fortawesome/vue-fontawesome'
import { iconsSet as icons } from './assets/icons/icons.js'
import VueSocketio from 'vue-socket.io';

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.use(DatePicker)
Vue.use(VueMultiselect)
Vue.use(Vuelidate)
Vue.use(VueCookie)
Vue.use(BootstrapVue)
Vue.use(VueListPicker)
Vue.use(new VueSocketio({
  connection: 'http://localhost:7777'
}))


Vue.prototype.activeUser = {
  username: '',
  dangerModal: false
}
Vue.prototype.userCounter = 0

new Vue({
  el: '#app',
  router,
  icons,
  template: '<App/>',
  components: {
    App
  },
  sockets: {
    connect: () => {
      // Socket connection established
    },
    message : (data) => {
      Vue.prototype.userCounter = data.count
    }
  },
})
