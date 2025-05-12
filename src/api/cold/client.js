import request from '@/utils/request'

// 查询客户信息列表
export function listClient(query) {
  return request({
    url: '/cold/client/list',
    method: 'get',
    params: query
  })
}

// 查询客户信息详细
export function getClient(clientInfoId) {
  return request({
    url: '/cold/client/' + clientInfoId,
    method: 'get'
  })
}

// 新增客户信息
export function addClient(data) {
  return request({
    url: '/cold/client',
    method: 'post',
    data: data
  })
}

// 修改客户信息
export function updateClient(data) {
  return request({
    url: '/cold/client',
    method: 'put',
    data: data
  })
}

// 删除客户信息
export function delClient(clientInfoId) {
  return request({
    url: '/cold/client/' + clientInfoId,
    method: 'delete'
  })
}
