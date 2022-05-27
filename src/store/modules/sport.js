import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      sport: {}
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.sport = payload
    }
  },
  actions: {
    async findSport({ commit }, payload) {
      const res = await request.get('/sport/findAllSport', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteSport({ commit }, payload) {
      const res = await request.get('/sport/deleteSport', {
        params: {
          ...payload
        }
      })
      return res
    },
    async saveUpdateSport({ commit }, payload) {
      const res = await request.post('/sport/saveUpdateSport', {
        ...payload
      })
      return res
    }
  }
}
