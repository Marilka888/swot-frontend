// src/boot/vuex.js
import store from '../store'

export default ({ app, Vue }) => {
  Vue.prototype.$store = store
  app.use(store)
}
