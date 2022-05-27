import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import articles from './modules/article'
import foods from './modules/foods'
import sports from './modules/sport'
import nowDieases from './modules/nowDiease'
import historyDieases from './modules/historyDiease'
import Electrons from './modules/electron'
import lifes from './modules/life'
import heathys from './modules/heathy'
import users from './modules/users'
import wroles from './modules/mroles'
import familyDiease from './modules/familyDiease'
import Residents from './modules/resident'
import appoints from './modules/appiont'
import logs from './modules/log'
import medicines from './modules/medicine'
import stores from './modules/store'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    articles,
    foods,
    sports,
    nowDieases,
    historyDieases,
    Electrons,
    lifes,
    heathys,
    users,
    wroles,
    familyDiease,
    Residents,
    appoints,
    logs,
    medicines,
    stores
  },
  getters
})

export default store
