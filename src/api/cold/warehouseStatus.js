import request from '@/utils/request'

// 查询库存信息列表
export function listStatus(query) {
  return request({
    url: '/system/status/list',
    method: 'get',
    params: query
  })
}

// 查询库存信息详细
export function getStatus(warehouseId) {
  return request({
    url: '/system/status/' + warehouseId,
    method: 'get'
  })
}

// 新增库存信息
export function addStatus(data) {
  return request({
    url: '/system/status',
    method: 'post',
    data: data
  })
}

// 修改库存信息
export function updateStatus(data) {
  return request({
    url: '/system/status',
    method: 'put',
    data: data
  })
}

// 删除库存信息
export function delStatus(warehouseId) {
  return request({
    url: '/system/status/' + warehouseId,
    method: 'delete'
  })
}
