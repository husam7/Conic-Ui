import request from '@/utils/RequestApi'

export function GetMember(query) {
  return request({
    url: '/Member/GetMember',
    method: 'get',
    params: query
  })
}

export function GetActiveMember(query) {
  return request({
    url: '/Member/GetActiveMember',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Member/Create',
    method: 'post',
     data
  })
}

export function Edit(data) {
  return request({
    url: '/Member/Edit',
    method: 'post',
    data
  })
}