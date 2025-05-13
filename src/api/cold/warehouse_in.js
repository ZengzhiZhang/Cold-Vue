import request from '@/utils/request'


export function listWarehouse_in_wname(query) {
  return request({
    url: '/cold/warehouse_in/listWName',
    method: 'get',
    params: query
  })
}
// 查询入库列表
export function listWarehouse_in(query) {
  return request({
    url: '/cold/warehouse_in/list',
    method: 'get',
    params: query
  })
}

// 查询入库详细
export function getWarehouse_in(warehouseInId) {
  return request({
    url: '/cold/warehouse_in/' + warehouseInId,
    method: 'get'
  })
}

// 新增入库
export function addWarehouse_in(data) {
  return request({
    url: '/cold/warehouse_in',
    method: 'post',
    data: data
  })
}

// 修改入库
export function updateWarehouse_in(data) {
  return request({
    url: '/cold/warehouse_in',
    method: 'put',
    data: data
  })
}

// 删除入库
export function delWarehouse_in(warehouseInId) {
  return request({
    url: '/cold/warehouse_in/' + warehouseInId,
    method: 'delete'
  })
}
