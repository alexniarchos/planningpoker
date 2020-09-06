import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: null,
    name: '',
    roomId: '',
    users: []
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket
    },
    setName(state, name) {
      state.name = name;
    },
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
    setUsers(state, users) {
      state.users = users;
    }
  },
  actions: {
  },
  modules: {
  },
});
