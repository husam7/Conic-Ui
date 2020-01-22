import request from '@/utils/RequestApi'

export function login(data) {
  return request({
    url: '/User/login',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/User/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/User/logout',
    method: 'post'
  })
}
