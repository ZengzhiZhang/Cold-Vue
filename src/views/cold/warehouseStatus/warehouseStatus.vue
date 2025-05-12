<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="品类" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择品类" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_category"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库号" prop="wareNumber">
        <el-select v-model="queryParams.wareNumber" placeholder="请选择库号" clearable>
          <el-option
            v-for="dict in dict.type.ware_number"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="inventory">
        <el-input
          v-model="queryParams.inventory"
          placeholder="请输入数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-select v-model="queryParams.unit" placeholder="请选择单位" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_unit"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户id" prop="clientId">
        <el-input
          v-model="queryParams.clientId"
          placeholder="请输入客户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:status:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="库存信息" name="first">

      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second"></el-tab-pane>
    </el-tabs>
    <el-table v-loading="loading" :data="statusList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="warehouseId" />
      <el-table-column label="品类" align="center" prop="category">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_category" :value="scope.row.category"/>
        </template>
      </el-table-column>
      <el-table-column label="库号" align="center" prop="wareNumber">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.ware_number" :value="scope.row.wareNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="inventory" />
      <el-table-column label="单位" align="center" prop="unit">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_unit" :value="scope.row.unit"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="客户id" align="center" prop="clientId" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listStatus, getStatus, delStatus, addStatus, updateStatus } from "@/api/cold/warehouseStatus"

export default {
  name: "Status",
  dicts: ['ware_number', 'warehouse_unit', 'warehouse_category'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 标签页选择
      activeName: 'second',
      // 总条数
      total: 0,
      // 库存信息表格数据
      statusList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        category: null,
        wareNumber: null,
        inventory: null,
        unit: null,
        clientId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        category: [
          { required: true, message: "品类不能为空", trigger: "change" }
        ],
        wareNumber: [
          { required: true, message: "库号不能为空", trigger: "change" }
        ],
        inventory: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "单位不能为空", trigger: "change" }
        ],
        clientId: [
          { required: true, message: "客户id不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询库存信息列表 */
    getList() {
      this.loading = true
      listStatus(this.queryParams).then(response => {
        this.statusList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        warehouseId: null,
        category: null,
        wareNumber: null,
        inventory: null,
        unit: null,
        remark: null,
        clientId: null,
        createTime: null,
        updateTime: null
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.warehouseId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('system/status/export', {
        ...this.queryParams
      }, `status_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
