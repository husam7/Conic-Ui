import request from '@/utils/RequestApi'

export function GetInventoryItem(query) {
  return request({
    url: '/InventoryItem/GetInventoryItem',
    method: 'get',
    params: query
  })
}

export function GetActiveInventory(query) {
  return request({
    url: '/InventoryItem/GetActiveInventory',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/InventoryItem/Create',
    method: 'post',
     data
  })
}

export function Edit(data) {
  return request({
    url: '/InventoryItem/Edit',
    method: 'post',
    data
  })
}