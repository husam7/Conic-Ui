import request from '@/utils/RequestApi'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/Role/GetRoles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/Role/AddRole',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/Role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/Role/${id}`,
    method: 'delete'
  })
}
