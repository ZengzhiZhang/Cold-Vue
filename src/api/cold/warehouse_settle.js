import request from '@/utils/request'


export function listWarehouse_settle_wname(query) {
  return request({
    url: '/cold/warehouse_settle/listWName',
    method: 'get',
    params: query
  })
}
// 查询结算列表
export function listWarehouse_settle(query) {
  return request({
    url: '/cold/warehouse_settle/list',
    method: 'get',
    params: query
  })
}

// 查询结算详细
export function getWarehouse_settle(warehouseSettleId) {
  return request({
    url: '/cold/warehouse_settle/' + warehouseSettleId,
    method: 'get'
  })
}

// 新增结算
export function addWarehouse_settle(data) {
  return request({
    url: '/cold/warehouse_settle',
    method: 'post',
    data: data
  })
}

// 修改结算
export function updateWarehouse_settle(data) {
  return request({
    url: '/cold/warehouse_settle',
    method: 'put',
    data: data
  })
}

// 删除结算
export function delWarehouse_settle(warehouseSettleId) {
  return request({
    url: '/cold/warehouse_settle/' + warehouseSettleId,
    method: 'delete'
  })
}
