<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="客户" prop="warehouseOutClientId">
        <el-select v-model="queryParams.warehouseOutClientId" placeholder="客户" clearable>
          <el-option
            v-for="client in clientList"
            :key="client.clientInfoId"
            :label="client.clientInfoName"
            :value="client.clientInfoId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="品类" prop="warehouseOutCategory">
        <el-select v-model="queryParams.warehouseOutCategory" placeholder="请选择品类" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_category"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库号" prop="warehouseOutNumber">
        <el-select v-model="queryParams.warehouseOutNumber" placeholder="请选择库号" clearable>
          <el-option
            v-for="dict in dict.type.ware_number"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="warehouseOutQuantity">
        <el-input
          v-model="queryParams.warehouseOutQuantity"
          placeholder="请输入数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出货时间" prop="warehouseOutTime">
        <el-date-picker clearable
          v-model="queryParams.warehouseOutTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择出货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="金额" prop="warehouseOutMoney">
        <el-input
          v-model="queryParams.warehouseOutMoney"
          placeholder="请输入金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收款方式" prop="warehouseOutManner">
        <el-select v-model="queryParams.warehouseOutManner" placeholder="请选择收款方式" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_out_manner"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cold:warehouse_out:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cold:warehouse_out:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cold:warehouse_out:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cold:warehouse_out:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getWNameList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouse_outList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="出库操作ID" align="center" prop="warehouseOutId" />-->
      <el-table-column label="客户" align="center" prop="warehouseOutClientName" />
      <el-table-column label="品类" align="center" prop="warehouseOutCategory">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_category" :value="scope.row.warehouseOutCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="库号" align="center" prop="warehouseOutNumber">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.ware_number" :value="scope.row.warehouseOutNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="warehouseOutQuantity" />
      <el-table-column label="出货时间" align="center" prop="warehouseOutTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.warehouseOutTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="warehouseOutMoney" />
      <el-table-column label="收款方式" align="center" prop="warehouseOutManner">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_out_manner" :value="scope.row.warehouseOutManner"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cold:warehouse_out:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cold:warehouse_out:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getWNameList"
    />

    <!-- 添加或修改出库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户" prop="warehouseOutClientId">
          <el-select v-model="form.warehouseOutClientId" placeholder="请选择客户">
            <el-option
              v-for="client in clientList"
              :key="client.clientInfoId"
              :label="client.clientInfoName"
              :value="client.clientInfoId"
            ></el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="品类" prop="warehouseOutCategory">
          <el-select v-model="form.warehouseOutCategory" placeholder="请选择品类">
            <el-option
              v-for="dict in dict.type.warehouse_category"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库号" prop="warehouseOutNumber">
          <el-select v-model="form.warehouseOutNumber" placeholder="请选择库号">
            <el-option
              v-for="dict in dict.type.ware_number"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="warehouseOutQuantity">
          <el-input v-model="form.warehouseOutQuantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="出货时间" prop="warehouseOutTime">
          <el-date-picker clearable
            v-model="form.warehouseOutTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择出货时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="金额" prop="warehouseOutMoney">
          <el-input v-model="form.warehouseOutMoney" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="收款方式" prop="warehouseOutManner">
          <el-select v-model="form.warehouseOutManner" placeholder="请选择收款方式">
            <el-option
              v-for="dict in dict.type.warehouse_out_manner"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouse_out, getWarehouse_out, delWarehouse_out, addWarehouse_out, updateWarehouse_out } from "@/api/cold/warehouse_out"
import {listWarehouse_out_wname} from "../../../api/cold/warehouse_out";
import {listClient} from "../../../api/cold/client";

export default {
  name: "Warehouse_out",
  dicts: ['ware_number', 'warehouse_category', 'warehouse_out_manner'],
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
      // 总条数
      total: 0,
      // 出库表格数据
      warehouse_outList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseOutClientId: null,
        warehouseOutCategory: null,
        warehouseOutNumber: null,
        warehouseOutQuantity: null,
        warehouseOutTime: null,
        warehouseOutMoney: null,
        warehouseOutManner: null
      },
      // 表单参数
      form: {},
      clientList: [],
      // 表单校验
      rules: {
        warehouseOutClientId: [
          { required: true, message: "客户不能为空", trigger: "blur" }
        ],
        warehouseOutCategory: [
          { required: true, message: "品类不能为空", trigger: "change" }
        ],
        warehouseOutNumber: [
          { required: true, message: "库号不能为空", trigger: "change" }
        ],
        warehouseOutQuantity: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],
        warehouseOutTime: [
          { required: true, message: "出货时间不能为空", trigger: "blur" }
        ],
        warehouseOutMoney: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        warehouseOutManner: [
          { required: true, message: "收款方式不能为空", trigger: "change" }
        ]
      }
    }
  },
  created() {
    this.getClientList()
    this.getWNameList()
  },
  methods: {

    getWNameList() {
      this.loading = true
      listWarehouse_out_wname(this.queryParams).then(response => {
        this.warehouse_outList = response.rows
        this.total = response.total
        this.loading = false
      })
    },

    getClientList() {
      listClient(null).then(response => {
        this.clientList = response.rows

      })
    },
    /** 查询出库列表 */
    getList() {
      this.loading = true
      listWarehouse_out(this.queryParams).then(response => {
        this.warehouse_outList = response.rows
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
        warehouseOutId: null,
        warehouseOutClientId: null,
        warehouseOutCategory: null,
        warehouseOutNumber: null,
        warehouseOutQuantity: null,
        warehouseOutTime: null,
        warehouseOutMoney: null,
        warehouseOutManner: null
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getWNameList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.warehouseOutId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加出库"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const warehouseOutId = row.warehouseOutId || this.ids
      getWarehouse_out(warehouseOutId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改出库"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.warehouseOutId != null) {
            updateWarehouse_out(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getWNameList()
            })
          } else {
            addWarehouse_out(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getWNameList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const warehouseOutIds = row.warehouseOutId || this.ids
      this.$modal.confirm('是否确认删除出库编号为"' + warehouseOutIds + '"的数据项？').then(function() {
        return delWarehouse_out(warehouseOutIds)
      }).then(() => {
        this.getWNameList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('cold/warehouse_out/export', {
        ...this.queryParams
      }, `warehouse_out_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
