<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="rolesName">
        <el-input
          v-model="params.rolesName"
          placeholder="请输入名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="params.status"
          placeholder="用户状态"
          clearable
          size="small"
          style="width: 240px"
          @change="handleQuery"
        >
          <el-option v-for="dict in statusOptions" :key="dict" :label="dict" :value="dict" />
        </el-select>
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
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="$store.state.app.loading"
      :data="Roles.data"
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="true" />
      <el-table-column
        label="角色名称"
        align="center"
        prop="rolesName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="角色字符" align="" prop="description" />
      <el-table-column label="显示顺序" align="center" prop="orders" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :disabled="scope.row.roles === 2"
            active-value="正常"
            inactive-value="停用"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.time | fmtDateTime }}
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
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮模态框 -->
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="rolesName">
          <el-input v-model="form.rolesName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符" prop="description">
          <el-input v-model="form.description" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orders">
          <el-input-number v-model="form.orders" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="权限" prop="rolese">
          <el-select v-model="form.rolese" placeholder="权限" clearable size="small">
            <el-option v-for="dict in roles" :key="dict" :label="dict" :value="dict" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toSave('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
      :total="Roles.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
/* eslint-disable */

import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  data() {
    return {
      addRoles: {},
      open: false,
      title: '',
      // 选中数组
      roles: ['管理员', '社区医生', '普通用户'],
      openDataScope: false,
      ids: [],
      xg: {},
      form: {},
      statusOptions: ['正常', '停用'],
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
        rolesName: [{ required: true, message: '请输入名字标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入权限描述', trigger: 'blur' }],
        rolese: [{ required: true, message: '请选择权限', trigger: 'blur' }],
        orders: [{ required: true, message: '请选择显示顺序', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState('wroles', ['Roles'])
  },
  methods: {
    ...mapActions('wroles', ['findRoles', , 'deleteRoles', 'saveOrUpdateRoles', 'statusChange']),
    //   点击添加按钮
    hanlderqueryRoles() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (let key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findRoles(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryRoles()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryRoles()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roles_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
    },
    handleStatusChange(row) {
      const text = row.status === '正常' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.rolesName + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let obj = {
            status: row.status,
            roles_id: row.roles_id
          }
          this.statusChange(obj)
            .then(() => {
              this.$message({
                type: 'success',
                message: text + '成功'
              })
            })
            .catch(function () {
              row.status = row.status === '正常' ? '正常' : '停用'
            })
        })
        .catch(function () {
          row.status = row.status === '正常' ? '停用' : '正常'
        })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let id = row.roles_id || Array.from(this.ids).join(',') //数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteRoles({ roles_id: id })
        })
        .then(() => {
          this.hanlderqueryRoles()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function () {})
    },

    handleAdd() {
      this.title = '添加角色'
      this.form = {}
      this.open = true
    },
    //   点击模态框确定按钮
    toSave(from) {
      this.$refs[from].validate(valid => {
        if (valid) {
          if (this.form.rolese == '社区医生') {
            this.form.roles = 1
          } else if (this.form.rolese == '管理员') {
            this.form.roles = 2
          } else {
            this.form.roles = 0
          }
          delete this.form.rolese
          this.saveOrUpdateRoles(this.form).then(res => {
            this.hanlderqueryRoles()
            this.open = false
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
      this.title = '修改角色'
      if (row.roles_id) {
        this.form = _.clone(row)
      } else {
        this.form = this.xg
      }
      if (this.form.roles == 1) {
        this.form.rolese = '社区医生'
      } else if (this.form.roles == 2) {
        this.form.rolese = '管理员'
      } else {
        this.form.rolese = '普通用户'
      }
      this.open = true
    },
    //
    handleQuery() {
      this.hanlderqueryRoles()
    },
    cancel() {
      this.open = false
    }
  },
  created() {
    this.hanlderqueryRoles()
  }
}
</script>
<style scoped lang="scss">
.drawerOps {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
