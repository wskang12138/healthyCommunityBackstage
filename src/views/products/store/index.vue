<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="药品名字" prop="medicine_name">
        <el-input
          v-model="params.medicine_name"
          placeholder="请输入名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >移除</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5" />
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="$store.state.app.loading"
      :data="Store.data"
      class="table"
      :row-style="{ height: '90px' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="true" />
      <el-table-column
        label="药品名称"
        align="center"
        prop="medicine_name"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="药品数量" align="center" prop="num" />
      <el-table-column label="存储位置" align="center" prop="position" />

      <el-table-column label="入库时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.entry_time | fmtDateTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            class="delete"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮模态框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="proFrom" :model="addstore" :rules="rules">
        <el-form-item label="药品名称" :label-width="formLabelWidth" prop="medicine_name">
          <el-select
            v-model.trim="addstore.medicine_name"
            placeholder="请选择名字"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in user"
              :key="index"
              :label="item.medicine_name"
              :value="item.medicine_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="药品数量" :label-width="formLabelWidth" prop="num">
          <el-input-number v-model="addstore.num" :min="0" :max="100" label="描述文字" />
        </el-form-item>
        <el-form-item label="药品位置" :label-width="formLabelWidth" prop="position">
          <el-select v-model.trim="addstore.position" placeholder="请选择名字" clearable filterable>
            <el-option v-for="(item, index) in position" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSave('proFrom')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      class="page"
      background
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Store.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
export default {
  data() {
    return {
      addstore: {
        num: 1
      },
      dialogFormVisible: false,
      title: '',
      // 选中数组
      ids: [],
      export: [],
      position: [
        'A1架上',
        'A2架上',
        'A3架上',
        'A4架上',
        'C1架上',
        'C2架上',
        'C3架上',
        'B1架上',
        'B2架上',
        'B3架上'
      ],
      xg: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formLabelWidth: '80px',
      params: {
        page: 1,
        pageSize: 5
      },
      // 验证规则
      rules: {
        medicine_name: [{ required: true, message: '请输入名字标题', trigger: 'blur' }],
        num: [{ required: true, message: '请选择数量', trigger: 'change' }],
        position: [{ required: true, message: '请选择时间', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('stores', ['Store', 'user'])
  },
  methods: {
    ...mapActions('stores', ['findStore', , 'deleteStore', 'findName', 'saveOrUpdateStore']),
    //   点击添加按钮
    hanlderqueryStore() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findStore(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryStore()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryStore()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
      this.export = selection.map(item => item)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteStore({ id: id })
        })
        .then(() => {
          this.hanlderqueryStore()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },

    handleAdd() {
      this.title = '添加库存'
      this.addstore = {
        num: 1
      }
      this.dialogFormVisible = true
    },
    //   点击模态框确定按钮
    toSave(proFrom) {
      this.$refs[proFrom].validate(valid => {
        if (valid) {
          const arr = Array.from(this.user)
          for (const index in arr) {
            if (arr[index].medicine_name == this.addstore.medicine_name) {
              this.addstore.m_id = arr[index].id
            }
          }
          this.saveOrUpdateStore(this.addstore).then(res => {
            this.hanlderqueryStore(this.params)
            this.dialogFormVisible = false
            // 提示成功操作信息
            this.$message({
              type: 'success',
              message: res.message
            })
          })
        } else {
          alert('error submit!!')
          return false
        }
      })
    },

    handleUpdate(row) {
      this.title = '修改库存'
      if (row.id) {
        this.addstore = _.clone(row)
      } else {
        this.addstore = this.xg
      }
      this.dialogFormVisible = true
    },
    //
    handleQuery() {
      this.hanlderqueryStore()
    },
    download(data) {
      const downloadUrl = `${process.env.VUE_APP_BASE_API}/store/download?data=${JSON.stringify(
        data
      )}`
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = '药品库存'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    handleExport() {
      if (this.export.length === 0) {
        for (const key in this.Store.data) {
          if (this.Store.data[key].entry_time) {
            this.Store.data[key].entry_time = moment(this.Store.data[key].entry_time).format(
              'YYYY-MM-DD hh:mm'
            )
          }
        }
        this.download(this.Store.data)
      } else {
        this.export = Array.from(this.export)
        for (const key in this.export) {
          if (this.export[key].entry_time) {
            this.export[key].entry_time = moment(this.export[key].entry_time).format(
              'YYYY-MM-DD hh:mm'
            )
          }
        }
        this.download(this.export)
      }
    }
  },
  created() {
    this.hanlderqueryStore()
    this.findName()
  }
}
</script>
<style scoped lang="scss"></style>
