import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
// 验证码
export function getCodeImg(params = {}) {
  return request('/captcha', 'get', params, false)
}

// 文章
export function queryArticle(data) {
  return request({
    url: '/user/queryArticle',
    method: 'get',
    params: { ...data }
  })
}

export function queryDetail(data) {
  return request({
    url: '/user/detailsArticle',
    method: 'get',
    params: { ...data }
  })
}

export function updateCount(data) {
  return request({
    url: '/user/updateCount',
    method: 'post',
    data
  })
}
