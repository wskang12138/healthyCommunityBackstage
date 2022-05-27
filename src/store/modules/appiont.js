import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      Appoint: {},
      user: [],
      doctor: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Appoint = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    },
    SET_DOCTOR(state, payload) {
      state.doctor = payload
    }
  },
  actions: {
    async findAppoint({ commit }, payload) {
      const res = await request.get('/appoint/findAppoint', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteAppoint({ commit }, payload) {
      const res = await request.get('/appoint/deleteAppoint', {
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
    async saveOrUpdateAppoint({ commit }, payload) {
      const res = await request.post('/appoint/saveOrUpdateAppoint', {
        ...payload
      })
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
