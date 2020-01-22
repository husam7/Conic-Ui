import request from '@/utils/RequestApi'

export function GetEntryAccounting(query) {
  return request({
    url: '/EntryAccounting/GetEntryAccounting',
    method: 'get',
    params: query
  })
}


export function Create(data) {
  return request({
    url: '/EntryAccounting/Create',
    method: 'post',
     data
  })
}
