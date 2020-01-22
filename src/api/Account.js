import request from '@/utils/RequestApi'

export function GetAccount(query) {
  return request({
    url: '/Account/GetAccount',
    method: 'get',
    params: query
  })
}

export function GetActiveAccounts(query) {
  return request({
    url: '/Account/GetActiveAccounts',
    method: 'get',
    params: query
  })
}

export function GetCashAccounts(query) {
  return request({
    url: '/Account/GetCashAccounts',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/Account/Create',
    method: 'post',
     data
  })
}

export function Edit(data) {
  return request({
    url: '/Account/Edit',
    method: 'post',
    data
  })
}