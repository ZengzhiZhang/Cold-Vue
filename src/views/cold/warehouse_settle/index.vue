<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户" prop="warehouseSettleClientId">
        <el-select v-model="queryParams.warehouseSettleClientId" placeholder="客户" clearable filterable>
          <el-option
            v-for="client in clientList"
            :key="client.clientInfoId"
            :label="client.clientInfoName"
            :value="client.clientInfoId"
          ></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="品类" prop="warehouseSettleCategory">
        <el-select v-model="queryParams.warehouseSettleCategory" placeholder="请选择品类" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_category"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="单位" prop="warehouseSettleUnit">
        <el-select v-model="queryParams.warehouseSettleUnit" placeholder="请选择单位" clearable>
          <el-option
            v-for="dict in dict.type.warehouse_unit"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="总件数" prop="warehouseSettleQuantity">-->
<!--        <el-input-->
<!--          v-model="queryParams.warehouseSettleQuantity"-->
<!--          placeholder="请输入总件数"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="总库费" prop="warehouseSettleMoneyKu">
        <el-input
          v-model="queryParams.warehouseSettleMoneyKu"
          placeholder="请输入总库费"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总收费" prop="warehouseSettleMoneyShou">
        <el-input
          v-model="queryParams.warehouseSettleMoneyShou"
          placeholder="请输入总收费"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cold:warehouse_settle:add']"
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
          v-hasPermi="['cold:warehouse_settle:edit']"
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
          v-hasPermi="['cold:warehouse_settle:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cold:warehouse_settle:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouse_settleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="结算ID" align="center" prop="warehouseSettleId" />-->
      <el-table-column label="客户" align="center" prop="warehouseSettleClientName" />
      <el-table-column label="品类" align="center" prop="warehouseSettleCategory">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_category" :value="scope.row.warehouseSettleCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="warehouseSettleUnit">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.warehouse_unit" :value="scope.row.warehouseSettleUnit"/>
        </template>
      </el-table-column>
      <el-table-column label="总件数" align="center" prop="warehouseSettleQuantity" />
      <el-table-column label="总库费" align="center" prop="warehouseSettleMoneyKu" />
      <el-table-column label="总收费" align="center" prop="warehouseSettleMoneyShou" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cold:warehouse_settle:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cold:warehouse_settle:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改结算对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户" prop="warehouseSettleClientId">
          <el-select v-model="form.warehouseSettleClientId" placeholder="请选择客户" @change="loadSettle">
            <el-option
              v-for="client in clientList"
              :key="client.clientInfoId"
              :label="client.clientInfoName"
              :value="client.clientInfoId"
            ></el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="品类" prop="warehouseSettleCategory">
          <el-select v-model="form.warehouseSettleCategory" placeholder="请选择品类" @change="loadSettle">
            <el-option
              v-for="dict in dict.type.warehouse_category"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="warehouseSettleUnit">
          <el-select v-model="form.warehouseSettleUnit" placeholder="请选择单位" @change="loadSettle">
            <el-option
              v-for="dict in dict.type.warehouse_unit"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>


<!--        <el-form-item label="总件数" prop="warehouseSettleQuantity">-->
<!--          <el-input v-model="form.warehouseSettleQuantity" placeholder="请输入总件数" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="总库费" prop="warehouseSettleMoneyKu">-->
<!--          <el-input v-model="form.warehouseSettleMoneyKu" placeholder="请输入总库费" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="总收费" prop="warehouseSettleMoneyShou">-->
<!--          <el-input v-model="form.warehouseSettleMoneyShou" placeholder="请输入总收费" />-->
<!--        </el-form-item>-->
      </el-form>

      <el-table
        :header-cell-style="{background:'#E7FAF0'}"
        :data="wareInfo"
        border
        style="width: 100%">
        <el-table-column
          prop="inTotalQuantity"
          label="入库总件数"
          >
        </el-table-column>
        <el-table-column
          prop="inTotalKuFei"
          label="总库费"
          >
        </el-table-column>
        <el-table-column
          prop="outTotalQuantity"
          label="出库总件数">

        </el-table-column>
        <el-table-column
          prop="outTotalMaiMoney"
          label="总收入">

        </el-table-column>
      </el-table>
      <el-table
        :data="outWare"

        border
        style="width: 100%">
        <el-table-column
          prop="warehouseOutQuantity"
          label="出库量"
          >
        </el-table-column>
        <el-table-column
          prop="warehouseOutMoney"
          label="单价"
          >
        </el-table-column>
        <el-table-column

          label="总价">
          <template #default="scope">
            <!-- 核心逻辑：计算两列乘积 + 数值校验 + 格式化 -->
            {{calculateAllOutMoney(scope.row)}}
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="inWare"
        border
        style="width: 100%">
        <el-table-column
          prop="warehouseInQuantity"
          label="入库量"
          >
        </el-table-column>
        <el-table-column
          prop="warehouseInPrice"
          label="单价"
          >
        </el-table-column>
        <el-table-column

          label="总价">
          <template #default="scope">
            <!-- 核心逻辑：计算两列乘积 + 数值校验 + 格式化 -->
            {{calculateAllInMoney(scope.row)}}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">生 成</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouse_settle, getWarehouse_settle, delWarehouse_settle, addWarehouse_settle, updateWarehouse_settle } from "@/api/cold/warehouse_settle"
import {listClient} from "../../../api/cold/client";
import {listWarehouse_settle_wname, loadSettle, updateInOut2Settle} from "../../../api/cold/warehouse_settle";


export default {
  name: "Warehouse_settle",
  dicts: ['warehouse_unit', 'warehouse_category'],
  data() {
    return {

      wareInfo:[{
        inTotalKuFei:null,
        inTotalQuantity:null,
        inUnit:null,
        outTotalMaiMoney:null,
        outTotalQuantity:null,
        outUnit:null
      }],
      outWare:null,
      inWare:null,
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
      // 结算表格数据
      warehouse_settleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseSettleClientId: null,
        warehouseSettleCategory: null,
        warehouseSettleUnit: null,
        warehouseSettleQuantity: null,
        warehouseSettleMoneyKu: null,
        warehouseSettleMoneyShou: null
      },
      // 表单参数
      form: {},
      clientList: [],
      // 表单校验
      rules: {
        warehouseSettleClientId: [
          { required: true, message: "客户不能为空", trigger: "blur" }
        ],
        warehouseSettleCategory: [
          { required: true, message: "品类不能为空", trigger: "change" }
        ],
        warehouseSettleUnit: [
          { required: true, message: "单位不能为空", trigger: "change" }
        ],
        // warehouseSettleQuantity: [
        //   { required: true, message: "总件数不能为空", trigger: "blur" }
        // ],
        // warehouseSettleMoneyKu: [
        //   { required: true, message: "总库费不能为空", trigger: "blur" }
        // ],
        // warehouseSettleMoneyShou: [
        //   { required: true, message: "总收费不能为空", trigger: "blur" }
        // ]
      }
    }
  },
  created() {
    this.getClientList()
    this.getWNameList()

  },
  methods: {

    calculateAllOutMoney(row) {
      return row.warehouseOutMoney * row.warehouseOutQuantity;
    },

    calculateAllInMoney(row) {
      return row.warehouseInPrice * row.warehouseInQuantity;
    },
    loadSettle() {
      //检查三个值是否都键入
      if(this.form.warehouseSettleClientId != null && this.form.warehouseSettleCategory != null && this.form.warehouseSettleUnit != null) {
        loadSettle({'ClientId':this.form.warehouseSettleClientId,'category':this.form.warehouseSettleCategory,'unit':this.form.warehouseSettleUnit}).then(response => {
          this.outWare = response.outList
          this.inWare = response.inList

          this.wareInfo[0].inTotalKuFei = response.inTotalKuFei
          this.wareInfo[0].inTotalQuantity = response.inTotalQuantity
          this.wareInfo[0].inUnit = response.inUnit
          this.wareInfo[0].outTotalQuantity = response.outTotalQuantity
          this.wareInfo[0].outTotalMaiMoney = response.outTotalMaiMoney


          this.form.warehouseSettleMoneyKu = response.inTotalKuFei
          this.form.warehouseSettleMoneyShou = response.outTotalMaiMoney
          this.form.warehouseSettleQuantity = response.outTotalQuantity
        })
      }else {

      }
    },

    getWNameList() {
      this.loading = true
      listWarehouse_settle_wname(this.queryParams).then(response => {
        this.warehouse_settleList = response.rows

        this.total = response.total
        this.loading = false
      })
    },

    getClientList() {
      listClient(null).then(response => {
        this.clientList = response.rows
      })
    },
    /** 查询结算列表 */
    getList() {
      this.loading = true
      listWarehouse_settle(this.queryParams).then(response => {
        this.warehouse_settleList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.inWare = null
      this.outWare = null
      this.wareInfo = [{
        inTotalKuFei:null,
        inTotalQuantity:null,
        inUnit:null,
        outTotalMaiMoney:null,
        outTotalQuantity:null,
        outUnit:null
      }]
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        warehouseSettleId: null,
        warehouseSettleClientId: null,
        warehouseSettleCategory: null,
        warehouseSettleUnit: null,
        warehouseSettleQuantity: null,
        warehouseSettleMoneyKu: null,
        warehouseSettleMoneyShou: null
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
      this.ids = selection.map(item => item.warehouseSettleId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "结算单"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const warehouseSettleId = row.warehouseSettleId || this.ids
      getWarehouse_settle(warehouseSettleId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改结算单"
      })
    },


    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.warehouseSettleId != null) {
            updateWarehouse_settle(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getWNameList()
            })
          } else {

            addWarehouse_settle(this.form).then(response => {
              this.$modal.msgSuccess("生成成功")
              this.open = false
              let inIds = this.inWare.map(item => {
                return item.warehouseInId
              });
              let outIds = this.outWare.map(item => {
                return item.warehouseOutId
              });


              //修改单子
              updateInOut2Settle(inIds,outIds).then(resp => {
                console.log(resp)
              })
              this.inWare = null
              this.outWare = null
              this.wareInfo = [{
                inTotalKuFei:null,
                inTotalQuantity:null,
                inUnit:null,
                outTotalMaiMoney:null,
                outTotalQuantity:null,
                outUnit:null
              }]



              this.getWNameList()

            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const warehouseSettleIds = row.warehouseSettleId || this.ids
      this.$modal.confirm('是否确认删除结算编号为"' + warehouseSettleIds + '"的数据项？').then(function() {
        return delWarehouse_settle(warehouseSettleIds)
      }).then(() => {
        this.getWNameList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('cold/warehouse_settle/export', {
        ...this.queryParams
      }, `warehouse_settle_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
