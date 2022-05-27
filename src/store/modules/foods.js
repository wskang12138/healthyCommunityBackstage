import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      food: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.food = payload
    }
  },
  actions: {
    async findFood({ commit }, payload) {
      const res = await request.get('/foods/findAllFood', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res.data)
      return res
    },
    async deleteFood({ commit }, payload) {
      const res = await request.get('/foods/deleteFood', {
        params: {
          ...payload
        }
      })
      return res
    },
    async saveUpdateFood({ commit }, payload) {
      const res = await request.post('/foods/saveUpdateFood', {
        ...payload
      })
      return res
    }
  }
}
