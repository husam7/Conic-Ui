import request from '@/utils/RequestApi'

export function GetTotal(query) {
  return request({
    url: '/Dashbord/GetTotal',
    method: 'get',
    params: query
  })
}

