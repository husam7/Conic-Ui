import request from '@/utils/RequestApi'

export function GetOrderInventory(query) {
  return request({
    url: '/OrderInventory/GetOrderInventory',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/OrderInventory/Create',
    method: 'post',
     data
  })
}
