import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      Heathy: {},
      user: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Heathy = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async findHeathy({ commit }, payload) {
      const res = await request.get('/heathy/queryHeathy', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteHeathy({ commit }, payload) {
      const res = await request.get('/heathy/deleteHeathy', {
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

    async saveOrUpdateHeathy({ commit }, payload) {
      const res = await request.post('/heathy/saveOrUpdateHeathy', {
        ...payload
      })
      return res
    }
  }
}
