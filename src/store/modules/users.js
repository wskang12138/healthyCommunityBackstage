import request from '@/utils/request'

export default {
  namespaced: true,
  state() {
    return {
      Users: {},
      user: [],
      people: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.Users = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    },
    SET_PEOPLE(state, payload) {
      state.people = payload
    }
  },
  actions: {
    async findUsers({ commit }, payload) {
      const res = await request.get('/users/findUsers', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)

      return res
    },
    async deleteUsers({ commit }, payload) {
      const res = await request.get('/users/deleteUsers', {
        params: {
          ...payload
        }
      })
      return res
    },
    async findUser({ commit }, payload) {
      const res = await request.get('/users/findRoles', {
        params: {
          ...payload
        }
      })
      commit('SET_USER', res.data)
      return res
    },
    async saveOrUpdateUsers({ commit }, payload) {
      const res = await request.post('/users/saveOrUpdateUsers', {
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
    },
    async passwordChange({ commit }, payload) {
      const res = await request.post('/users/passwordChange', {
        ...payload
      })
      return res
    },
    async peopleFind({ commit }, payload) {
      const res = await request.get('/users/findPeople', {
        params: {
          ...payload
        }
      })
      commit('SET_PEOPLE', res.data[0])
      return res
    },
    async changeImg({ commit }, payload) {
      const res = await request.post('/users/changeImg', {
        ...payload
      })
      return res
    },
    async updatePeople({ commit }, payload) {
      const res = await request.post('/users/updatePeople', {
        ...payload
      })
      return res
    }
  }
}
