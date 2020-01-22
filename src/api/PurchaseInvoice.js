import request from '@/utils/RequestApi'

export function GetPurchaseInvoice(query) {
  return request({
    url: '/PurchaseInvoice/GetPurchaseInvoice',
    method: 'get',
    params: query
  })
}

export function GetPurchaseItem(query) {
  return request({
    url: '/PurchaseInvoice/GetPurchaseItem',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/PurchaseInvoice/Create',
    method: 'post',
     data
  })
}
