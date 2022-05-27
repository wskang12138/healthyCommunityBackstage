import request from '@/utils/request'
export default {
  namespaced: true,
  state() {
    return {
      article: {},
      queryArticles: {},
      auth: {},
      details: []
    }
  },
  mutations: {
    SET_EVALUE(state, payload) {
      state.article = payload
    },
    SET_QEURY(state, payload) {
      state.queryArticles = payload
    },
    SET_AUTH(state, payload) {
      state.auth = payload
    },
    SET_DETAILS(state, payload) {
      state.details = payload
    }
  },
  actions: {
    async findAllArticle({ commit }, payload) {
      const res = await request.get('/artilcle/find', {
        params: {
          ...payload
        }
      })
      commit('SET_EVALUE', res)
    },
    async queryArticle({ commit }, payload) {
      const res = await request.get('/article/queryArticle', {
        params: {
          ...payload
        }
      })
      commit('SET_QEURY', res)
    },
    async findAuthor({ commit }) {
      const res = await request.get('/article/author')
      commit('SET_AUTH', res)
    },
    async deleteArticle({ commit }, id) {
      const res = await request.get('/artilcle/deleteById', {
        params: {
          id
        }
      })
      return res
    },
    async detailsArticle({ commit }, id) {
      const res = await request.get('/article/detailsArticle', {
        params: {
          id
        }
      })
      commit('SET_DETAILS', res.data)
      return res
    }
  }
}
