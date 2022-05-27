import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      log: {}
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.log = payload
    }
  },
  actions: {
    async findLog({ commit }, payload) {
      const res = await request.get('/log/query', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteLog({ commit }, payload) {
      const res = await request.get('/log/delete', {
        params: {
          ...payload
        }
      })
      return res
    }
  }
}
