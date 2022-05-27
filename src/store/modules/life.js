import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      Life: {},
      user: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Life = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async findLife({ commit }, payload) {
      const res = await request.get('/life/queryLife', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteLife({ commit }, payload) {
      const res = await request.get('/life/deleteLife', {
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

    async saveOrUpdateLife({ commit }, payload) {
      const res = await request.post('/life/saveOrUpdateLife', {
        ...payload
      })
      return res
    }
  }
}
