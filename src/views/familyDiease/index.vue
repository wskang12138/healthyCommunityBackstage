<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="名字" prop="username">
        <el-input
          v-model="params.username"
          placeholder="请输入名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="疾病名称" prop="diease_name">
        <el-input
          v-model="params.diease_name"
          placeholder="请输入疾病名称"
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
      :data="Diease.data"
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="true" />
      <el-table-column label="姓名" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column label="性别" align="center" prop="sex" />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="疾病名称" align="center" prop="diease_name" />

      <el-table-column label="辈分" align="center" prop="beifen" />

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
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="proFrom" :model="adddisease" :rules="rules">
        <el-form-item label="名字" :label-width="formLabelWidth" prop="username">
          <el-select
            v-model.trim="adddisease.username"
            placeholder="请选择名字"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in user"
              :key="index"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="辈分" prop="beifen">
          <el-select v-model="adddisease.beifen" placeholder="请选择">
            <el-option v-for="item in beifen" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="疾病名称" prop="diease_name">
          <el-select v-model="adddisease.diease_name" placeholder="请选择" @change="handleOther">
            <el-option v-for="item in diseases" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="con" :label-width="formLabelWidth" label="疾病名称" prop="other">
          <el-input v-model="adddisease.other" placeholder="请输入疾病名称" />
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
      :total="Diease.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  data() {
    return {
      adddisease: {},
      dialogFormVisible: false,
      title: '',
      diseases: [
        '高血压',
        '糖尿病',
        '结核',
        '肝炎',
        '肺癌',
        '先天畸形',
        '血友病',
        '高血脂',
        '哮喘',
        '其它'
      ],
      beifen: ['祖父辈', '父辈', '同辈', '其它'],
      // 选中数组
      ids: [],
      export: [],
      xg: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formLabelWidth: '80px',
      con: false,
      params: {
        page: 1,
        pageSize: 5
      },
      // 验证规则
      rules: {
        username: [{ required: true, message: '请输入名字标题', trigger: 'blur' }],
        diease_name: [{ required: true, message: '请输入疾病名称', trigger: 'blur' }],
        beifen: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        other: [{ required: true, message: '请选择时间', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('familyDiease', ['Diease', 'user'])
  },
  methods: {
    ...mapActions('familyDiease', [
      'findDiease',
      ,
      'deleteDiease',
      'findUser',
      'saveOrUpdateDiease'
    ]),
    //   点击添加按钮
    hanlderqueryDiease() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findDiease(this.params)
    },
    handleOther() {
      if (this.adddisease.diease_name == '其它') {
        this.con = true
      } else {
        this.con = false
      }
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryDiease()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryDiease()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.fid)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
      this.export = selection.map(item => item)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.fid || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteDiease({ fid: id })
        })
        .then(() => {
          this.hanlderqueryDiease()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },

    handleAdd() {
      this.title = '添加家族病史'
      this.adddisease = {}
      this.dialogFormVisible = true
    },
    //   点击模态框确定按钮
    toSave(proFrom) {
      this.$refs[proFrom].validate(valid => {
        if (valid) {
          if (this.adddisease.diease_name == '其它') {
            this.adddisease.diease_name = this.adddisease.other
          }
          const arr = Array.from(this.user)
          for (const index in arr) {
            if (arr[index].username == this.adddisease.username) {
              this.adddisease.f_user_id = arr[index].user_id
            }
          }
          delete this.adddisease.username
          this.saveOrUpdateDiease(this.adddisease).then(res => {
            this.hanlderqueryDiease(this.params)
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
      this.title = '修改家族病史'
      if (row.fid) {
        this.adddisease = _.clone(row)
      } else {
        this.adddisease = this.xg
      }
      this.dialogFormVisible = true
    },
    //
    handleQuery() {
      this.hanlderqueryDiease()
    },
    download(data) {
      const downloadUrl = `${
        process.env.VUE_APP_BASE_API
      }/familyDiease/download?data=${JSON.stringify(data)}`
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'forum'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    handleExport() {
      console.log(123456666)
      if (this.export.length === 0) {
        this.download(this.Diease.data)
      } else {
        this.export = Array.from(this.export)

        this.download(this.export)
      }
    }
  },
  created() {
    this.hanlderqueryDiease()
    this.findUser()
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
