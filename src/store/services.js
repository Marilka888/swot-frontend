import axios from 'axios';

export default ({
  namespaced: true,
  state: {
    services: [],
  },
  actions: {
    getServices(context) {
      const api = `http://localhost:8089/api/v1/facility/service/all`;
      context.commit('LOADING', true, {root: true});
      axios.get(api)
        .then((response) => {
          if (response.data.success) {
            context.commit('SERVICES', response.data.services);
          } else {
            context.dispatch('alertMessageModules/updateMessage', {
              message: response.data.message,
              status: 'danger',
            }, {root: true});
          }
          context.commit('LOADING', false, {root: true});
        });
    },
  },
  mutations: {
    SERVICES(state, payload) {
      state.services = payload;
    }
    ,
  },
  getters: {
    services: state => state.services,
  },
});
