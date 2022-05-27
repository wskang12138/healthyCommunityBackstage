import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      Electron: {},
      user: [],
      users: {},
      doctor: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Electron = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    },
    SET_USERS(state, payload) {
      state.users = payload
    },
    SET_DOCTOR(state, payload) {
      state.doctor = payload
    }
  },
  actions: {
    async findElectron({ commit }, payload) {
      const res = await request.get('/electron/queryElectron', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteElectron({ commit }, payload) {
      const res = await request.get('/electron/deleteElectron', {
        params: {
          ...payload
        }
      })
      return res
    },
    async findUser({ commit }, payload) {
      const res = await request.get('/findAll/user', {
        params: {
          ...payload
        }
      })
      commit('SET_USER', res.data)
      return res
    },

    async saveOrUpdateElectron({ commit }, payload) {
      const res = await request.post('/electron/saveOrUpdateElectron', {
        ...payload
      })
      return res
    },
    async findPeple({ commit }, payload) {
      const res = await request.get('/electron/findPeple', {
        params: {
          ...payload
        }
      })
      commit('SET_USERS', res)
      return res
    },
    async queryDoctor({ commit }, payload) {
      const res = await request.get('/user/queryDoctor', {
        params: {
          ...payload
        }
      })
      commit('SET_DOCTOR', res.data)
      return res
    }
  }
}
