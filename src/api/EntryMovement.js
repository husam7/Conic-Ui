import request from '@/utils/RequestApi'


export function Create(data) {
  return request({
    url: '/EntryMovement/Create',
    method: 'post',
     data
  })
}
