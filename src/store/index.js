import { createStore } from 'vuex';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import invoice from './modules/invoice'; 

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {
    invoice 
  }
});