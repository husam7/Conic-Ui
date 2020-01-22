import request from '@/utils/RequestApi'

export function GetStockInventory(query) {
  return request({
    url: '/StockInventory/GetStockInventory',
    method: 'get',
    params: query
  })
}

export function Create(data) {
  return request({
    url: '/StockInventory/Create',
    method: 'post',
     data
  })
}
