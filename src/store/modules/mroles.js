import request from '@/utils/request'

export default {
  namespaced: true,

  state() {
    return {
      Roles: {}
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Roles = payload
    }
  },
  actions: {
    async findRoles({ commit }, payload) {
      const res = await request.get('/roles/findRoles', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
      return res
    },
    async deleteRoles({ commit }, payload) {
      const res = await request.get('/roles/deleteRoles', {
        params: {
          ...payload
        }
      })
      return res
    },
    async saveOrUpdateRoles({ commit }, payload) {
      const res = await request.post('/roles/saveOrUpdateRoles', {
        ...payload
      })
      return res
    },
    async statusChange({ commit }, payload) {
      const res = await request.get('/users/statusChange', {
        params: {
          ...payload
        }
      })
      return res
    }
  }
}
