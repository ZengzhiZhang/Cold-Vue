import request from '@/utils/request'

// 查询出库列表
export function listWarehouse_out(query) {
  return request({
    url: '/cold/warehouse_out/list',
    method: 'get',
    params: query
  })
}

// 查询出库详细
export function getWarehouse_out(warehouseOutId) {
  return request({
    url: '/cold/warehouse_out/' + warehouseOutId,
    method: 'get'
  })
}

// 新增出库
export function addWarehouse_out(data) {
  return request({
    url: '/cold/warehouse_out',
    method: 'post',
    data: data
  })
}

// 修改出库
export function updateWarehouse_out(data) {
  return request({
    url: '/cold/warehouse_out',
    method: 'put',
    data: data
  })
}

// 删除出库
export function delWarehouse_out(warehouseOutId) {
  return request({
    url: '/cold/warehouse_out/' + warehouseOutId,
    method: 'delete'
  })
}
