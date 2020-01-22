import request from '@/utils/RequestApi'

export function GetOpration(query) {
  return request({
    url: '/Oprationsys/GetOpration',
    method: 'get',
    params: query
  })
}
export function ChangeObjStatus(data) {
    return request({
      url: '/Oprationsys/ChangeObjStatus',
      method: 'post',
      params: data
    })
  }

export function Create(data) {
  return request({
    url: '/Oprationsys/Create',
    method: 'post',
     data
  })
}

export function Edit(data) {
  return request({
    url: '/Oprationsys/Edit',
    method: 'post',
    data
  })
}