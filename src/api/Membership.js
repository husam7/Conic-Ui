import request from '@/utils/RequestApi'

export function GetMembership(query) {
  return request({
    url: '/Membership/GetMembership',
    method: 'get',
    params: query
  })
}

export function GetActiveMembership(query) {
  return request({
    url: '/Membership/GetActiveMembership',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Membership/Create',
    method: 'post',
     data
  })
}

export function Edit(data) {
  return request({
    url: '/Membership/Edit',
    method: 'post',
    data
  })
}