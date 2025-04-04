import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import App from './App.vue';
import router from './router';
import store from './store';
import './bus';

Vue.config.favourionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Vuex);
VeeValidate.Validator.localize('zh_TW', zhTWValidate);
Vue.use(VeeValidate, {
  locale: 'zh_TW',
});

// eslint-disable-next-line vue/multi-word-component-names
Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);

axios.defaults.withCredentials = true;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
