import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      Diease: {},
      user: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Diease = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async findDiease({ commit }, payload) {
      const res = await request.get('/historyDiease/queryDiease', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteDiease({ commit }, payload) {
      const res = await request.get('/historyDiease/deleteDiease', {
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
    async saveOrUpdateDiease({ commit }, payload) {
      const res = await request.post('/historyDiease/saveOrUpdateDiease', {
        ...payload
      })
      return res
    }
  }
}
