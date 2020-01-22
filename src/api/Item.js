import request from '@/utils/RequestApi'

export function GetItem(query) {
  return request({
    url: '/Item/GetItem',
    method: 'get',
    params: query
  })
}

export function GetActiveItem(query) {
  return request({
    url: '/Item/GetActiveItem',
    method: 'get',
    params: query
  })
}


export function CreateItem(data) {
  return request({
    url: '/Item/Create',
    method: 'post',
     data
  })
}

export function Edit(data) {
  return request({
    url: '/Item/Edit',
    method: 'post',
    data
  })
}