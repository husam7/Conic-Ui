import request from '@/utils/RequestApi'

export function GetVendor(query) {
  return request({
    url: '/Vendor/GetVendor',
    method: 'get',
    params: query
  })
}

export function GetActiveVendor(query) {
  return request({
    url: '/Vendor/GetActiveVendor',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Vendor/Create',
    method: 'post',
     data
  })
}

export function Edit(data) {
  return request({
    url: '/Vendor/Edit',
    method: 'post',
    data
  })
}