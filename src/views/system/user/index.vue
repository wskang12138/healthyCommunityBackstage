<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="rolesName"
            placeholder="请输入角色名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
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
          :data="Users.data"
          class="table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="用户名" align="center" prop="username" />
          <el-table-column label="账号" align="center" prop="account" />
          <el-table-column label="角色名称" align="center" prop="rolesName" />
          <el-table-column label="手机号码" align="center" prop="phone" width="120" />
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
          <el-table-column label="记录时间" align="center" prop="registerDate" width="160">
            <template slot-scope="scope">
              {{ scope.row.registerDate | fmtDateTime }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="240"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-if="scope.row.roles !== 2"
                class="delete"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
              >重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="page"
          background
          :current-page="queryParams.page"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="Users.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="username">
              <el-input v-model="form.username" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" placeholder="请输入用户账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="title === '添加用户'" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" prop="rolesName">
              <el-select v-model="form.rolesName" placeholder="请选择">
                <el-option
                  v-for="item in user"
                  :key="item.rolesName"
                  :label="item.rolesName"
                  :value="item.rolesName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toSave('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */

import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import { validateMobilePhone } from '@/utils/validate'
export default {
  name: 'Users',
  data() {
    return {
      rolesName: '',
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,

      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: [
        {
          label: '全部',
          roles: -1,
          children: [
            {
              label: '管理员',
              roles: 2
            },
            {
              label: '社区医生',
              roles: 1
            },
            {
              label: '普通用户',
              roles: 0
            }
          ]
        }
      ],
      xg: {},
      // 是否显示弹出层
      open: false,
      // 部门名称
      // 状态数据字典
      statusOptions: ['正常', '停用'],
      // 性别状态字典
      sexOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10
      },
      // 表单校验
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            validator: validateMobilePhone,
            message: '请输入正确手机号',
            trigger: 'blur'
          }
        ],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
        rolesName: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('users', ['Users', 'user'])
  },
  created() {
    this.handlefindUsers()
    this.findUser()
  },
  methods: {
    ...mapActions('users', [
      'findUsers',
      ,
      'deleteUsers',
      'findUser',
      'saveOrUpdateUsers',
      'statusChange',
      'passwordChange'
    ]),
    handlefindUsers() {
      if (this.rolesName !== '') {
        this.queryParams.rolesName = this.rolesName
      } else {
        delete this.queryParams.rolesName
      }
      this.findUsers(this.queryParams)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.handlefindUsers()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.handlefindUsers()
    },

    // 节点单击事件
    handleNodeClick(data) {
      if (data.roles == -1) {
        delete this.queryParams.roles
      } else {
        this.queryParams.roles = data.roles
      }
      this.handlefindUsers()
    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === '正常' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let obj = {
            status: row.status,
            roles_id: row.r_id
          }
          this.statusChange(obj)
            .then(() => {
              this.$message({
                type: 'success',
                message: text + '成功'
              })
            })
            .catch(function () {
              row.status = row.status === '正常' ? '启用' : '停用'
            })
        })
        .catch(function () {
          row.status = row.status === '正常' ? '停用' : '正常'
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.handlefindUsers()
    },

    // 多选框选中数据
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.user_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
      this.export = selection.map(item => item)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.title = '添加用户'
      this.form = {}
      this.open = true
    },

    //   点击模态框确定按钮
    toSave(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let arr = Array.from(this.user)
          for (let index in arr) {
            if (arr[index].rolesName == this.form.rolesName) {
              this.form.r_id = arr[index].roles_id
            }
          }
          delete this.form.rolesName
          this.saveOrUpdateUsers(this.form).then(res => {
            this.handlefindUsers()
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
      this.title = '修改用户'
      if (row.user_id) {
        this.form = _.clone(row)
      } else {
        this.form = this.xg
      }
      this.open = true
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.username + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          const query = {
            password: value,
            user_id: row.user_id
          }
          this.passwordChange(query).then(res => {
            this.$message({
              type: 'success',
              message: '新密码是' + value
            })
          })
        })
        .catch(() => {})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let id = row.user_id || Array.from(this.ids).join(',') //数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteUsers({ user_id: id })
        })
        .then(() => {
          this.handlefindUsers()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function () {})
    }
  }
}
</script>
