// store.js
import Vue from 'vue';
import Vuex from 'vuex';

// 使用 Vuex
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    userID:'',
    userEmail:'',
  },
  mutations: {
    updateUserInfo(state, newData) {
      state.userInfo = newData;
    },
    updateUserID(state,newData){
      state.userID=newData;
    },
    updateUserEmail(state,newData){
      state.userEmail=newData;
    }
  },
  actions: {
    updateUserInfo({ commit }, newData) {
      commit('updateUserInfo', newData);
    },
    updateUserID({ commit },newData){
      commit('getUserID',newData);
    },
    updateUserEmail({ commit },newData){
      commit('getUserEmail',newData);
    }
  },
  getters: {
    userInfo: state => state.userInfo,
    userID: state=> state.userID,
    userEmail:state=>state.userEmail
  }
});