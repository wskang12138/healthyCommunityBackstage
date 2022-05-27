import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      medicine: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.medicine = payload
    }
  },
  actions: {
    async findMedicine({ commit }, payload) {
      const res = await request.get('/medicine/findAll', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res.data)
      return res
    },
    async deleteMedicine({ commit }, payload) {
      const res = await request.get('/medicine/delete', {
        params: {
          ...payload
        }
      })
      return res
    },
    async saveUpdateMedicine({ commit }, payload) {
      const res = await request.post('/medicine/saveUpdate', {
        ...payload
      })
      return res
    }
  }
}
