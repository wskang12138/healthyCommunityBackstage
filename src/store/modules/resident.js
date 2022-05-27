import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      Resident: {},
      user: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Resident = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async findResident({ commit }, payload) {
      const res = await request.get('/resident/queryResident', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteResident({ commit }, payload) {
      const res = await request.get('/resident/deleteResident', {
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

    async saveOrUpdateResident({ commit }, payload) {
      const res = await request.post('/resident/saveOrUpdateResident', {
        ...payload
      })
      return res
    }
  }
}
