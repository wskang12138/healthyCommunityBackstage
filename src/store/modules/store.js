import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      Store: {},
      user: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Store = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async findStore({ commit }, payload) {
      const res = await request.get('/store/findAll', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteStore({ commit }, payload) {
      const res = await request.get('/store/delete', {
        params: {
          ...payload
        }
      })
      return res
    },
    async findName({ commit }, payload) {
      const res = await request.get('/store/findName', {
        params: {
          ...payload
        }
      })
      commit('SET_USER', res.data)
      return res
    },
    async saveOrUpdateStore({ commit }, payload) {
      const res = await request.post('/store/saveUpdate', {
        ...payload
      })
      return res
    }
  }
}
