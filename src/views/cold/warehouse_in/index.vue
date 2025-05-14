<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户" prop="warehouseInClient">
        <el-select v-model="queryParams.warehouseInClient" placeholder="客户" clearable>
          <el-option
            v-for="client in clientList"
            :key="client.clientInfoId"
            :label="client.clientInfoName"
            :value="client.clientInfoId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品类" prop="warehouseInCategory">
        <el-select v-model="queryParams.warehouseInCategory" placeholder="请选择品类" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_category"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="数量" prop="warehouseInQuantity">-->
<!--        <el-input-->
<!--          v-model="queryParams.warehouseInQuantity"-->
<!--          placeholder="请输入数量"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="单位" prop="warehouseInUnit">
        <el-select v-model="queryParams.warehouseInUnit" placeholder="请选择单位" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_unit"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="价格" prop="warehouseInPrice">
        <el-input
          v-model="queryParams.warehouseInPrice"
          placeholder="请输入价格"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库号" prop="warehouseInNumber">
        <el-select v-model="queryParams.warehouseInNumber" placeholder="请选择库号" clearable>
          <el-option
            v-for="dict in dict.type.ware_number"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间" prop="warehouseInTime">
        <el-date-picker clearable
          v-model="queryParams.warehouseInTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择入库时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结算标识" prop="warehouseInSettle">
        <el-select v-model="queryParams.warehouseInSettle" placeholder="请选择结算标识" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_in_settle"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库完成" prop="warehouseInFinish">
        <el-select v-model="queryParams.warehouseInFinish" placeholder="入库完成" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_in_finish"
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
          v-hasPermi="['cold:warehouse_in:add']"
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
          v-hasPermi="['cold:warehouse_in:edit']"
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
          v-hasPermi="['cold:warehouse_in:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cold:warehouse_in:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getWNameList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouse_inList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="入库操作ID" align="center" prop="warehouseInId" />-->
      <el-table-column label="客户" align="center" prop="warehouseInClientName" />
      <el-table-column label="品类" align="center" prop="warehouseInCategory">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_category" :value="scope.row.warehouseInCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="warehouseInQuantity" />
      <el-table-column label="单位" align="center" prop="warehouseInUnit">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_unit" :value="scope.row.warehouseInUnit"/>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="warehouseInPrice" />
      <el-table-column label="库号" align="center" prop="warehouseInNumber">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.ware_number" :value="scope.row.warehouseInNumber"/>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" align="center" prop="warehouseInTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.warehouseInTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算标识" align="center" prop="warehouseInSettle">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_in_settle" :value="scope.row.warehouseInSettle"/>
        </template>
      </el-table-column>
      <el-table-column label="入库完成标识" align="center" prop="warehouseInFinish">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_in_finish" :value="scope.row.warehouseInFinish"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cold:warehouse_in:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cold:warehouse_in:remove']"
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

    <!-- 添加或修改入库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户" prop="warehouseInClient">
          <el-select v-model="form.warehouseInClient" placeholder="请选择客户">
            <el-option
              v-for="client in clientList"
              :key="client.clientInfoId"
              :label="client.clientInfoName"
              :value="client.clientInfoId"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="toClientInfoPage">添加新用户</el-button>
        </el-form-item>

        <el-form-item label="品类" prop="warehouseInCategory">
          <el-select v-model="form.warehouseInCategory" placeholder="请选择品类">
            <el-option
              v-for="dict in dict.type.warehouse_category"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="warehouseInQuantity">
          <el-input v-model="form.warehouseInQuantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="单位" prop="warehouseInUnit">
          <el-select v-model="form.warehouseInUnit" placeholder="请选择单位">
            <el-option
              v-for="dict in dict.type.warehouse_unit"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="warehouseInPrice">
          <el-input v-model="form.warehouseInPrice" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="库号" prop="warehouseInNumber">
          <el-select v-model="form.warehouseInNumber" placeholder="请选择库号">
            <el-option
              v-for="dict in dict.type.ware_number"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间" prop="warehouseInTime">
          <el-date-picker clearable
            v-model="form.warehouseInTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择入库时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库完成标识" prop="warehouseInFinish">
          <el-select v-model="form.warehouseInFinish" placeholder="请选择入库完成标识">
            <el-option
              v-for="dict in dict.type.warehouse_in_finish"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算标识" prop="warehouseInSettle">
          <el-select v-model="form.warehouseInSettle" placeholder="请选择结算标识">
            <el-option
              v-for="dict in dict.type.warehouse_in_settle"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col span="6">
          <el-statistic
            group-separator=","
            :precision="2"
            :value="form.warehouseInQuantity*form.warehouseInPrice"
            title="总库费"
            :value-style="{color:'#1890FF',fontSize:'30px'}"
          >

            <template slot="prefix">
              <i class="el-icon-s-flag" style="color: #1890FF"></i>
            </template>
<!--            <template slot="suffix">-->
<!--              <i class="el-icon-s-flag" style="color: blue"></i>-->
<!--            </template>-->
          </el-statistic>
        </el-col>
      </el-row>




      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouse_in, getWarehouse_in, delWarehouse_in, addWarehouse_in, updateWarehouse_in,listWarehouse_in_wname } from "@/api/cold/warehouse_in"
import {listClient} from "../../../api/cold/client";

export default {
  name: "Warehouse_in",
  dicts: ['warehouse_unit', 'ware_number', 'warehouse_category', 'warehouse_in_settle', 'warehouse_in_finish'],
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
      // 入库表格数据
      warehouse_inList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseInClient: null,
        warehouseInCategory: null,
        warehouseInQuantity: null,
        warehouseInUnit: null,
        warehouseInPrice: null,
        warehouseInNumber: null,
        warehouseInTime: null,
        warehouseInSettle: null,
        warehouseInFinish: null
      },
      // 表单参数
      form: {},
      clientList: [],
      // 表单校验
      rules: {
        warehouseInClient: [
          { required: true, message: "客户不能为空", trigger: "change" }
        ],
        warehouseInCategory: [
          { required: true, message: "品类不能为空", trigger: "change" }
        ],
        warehouseInQuantity: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],
        warehouseInUnit: [
          { required: true, message: "单位不能为空", trigger: "change" }
        ],
        warehouseInPrice: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],
        warehouseInNumber: [
          { required: true, message: "库号不能为空", trigger: "change" }
        ],
        warehouseInTime: [
          { required: true, message: "入库时间不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    this.getClientList()
    // this.getList()
    this.getWNameList()

  },
  methods: {
    toClientInfoPage() {
      this.cancel()
      this.$router.push({ path: "/cold/client" });
    },
    getWNameList() {
      this.loading = true
      listWarehouse_in_wname(this.queryParams).then(response => {
        this.warehouse_inList = response.rows
        this.total = response.total
        this.loading = false
      })
    },

    /** 查询入库列表 */
    getList() {
      this.loading = true
      listWarehouse_in(this.queryParams).then(response => {
        this.warehouse_inList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    getClientList() {
      listClient(null).then(response => {
        this.clientList = response.rows
        console.log(this.clientList)
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
        warehouseInId: null,
        warehouseInClient: null,
        warehouseInCategory: null,
        warehouseInQuantity: null,
        warehouseInUnit: null,
        warehouseInPrice: null,
        warehouseInNumber: null,
        warehouseInTime: null,
        warehouseInSettle: null,
        warehouseInFinish: 0
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      console.log(this.queryParams)
      this.getWNameList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.warehouseInId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加入库"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const warehouseInId = row.warehouseInId || this.ids
      getWarehouse_in(warehouseInId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改入库"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.warehouseInId != null) {
            updateWarehouse_in(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getWNameList()
            })
          } else {
            addWarehouse_in(this.form).then(response => {
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
      const warehouseInIds = row.warehouseInId || this.ids
      this.$modal.confirm('是否确认删除入库编号为"' + warehouseInIds + '"的数据项？').then(function() {
        return delWarehouse_in(warehouseInIds)
      }).then(() => {
        this.getWNameList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('cold/warehouse_in/export', {
        ...this.queryParams
      }, `warehouse_in_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
