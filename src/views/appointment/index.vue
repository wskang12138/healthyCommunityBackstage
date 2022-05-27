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

      <el-form-item label="电话" prop="phone">
        <el-input
          v-model="params.phone"
          placeholder="请输入电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="identity">
        <el-input
          v-model="params.identity"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="预约状态" prop="a_status">
        <el-select
          v-model.trim="params.a_status"
          placeholder="请预约状态"
          clearable
          filterable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="(item, index) in status" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="params.sex"
          placeholder="用户状态"
          clearable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="dict in sex" :key="dict" :label="dict" :value="dict" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="time">
        <el-date-picker
          v-model="value2"
          value-format="yyyy-MM-dd hh:mm"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          size="small"
          @change="handleQuery"
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

    <div class="anniu">
      <el-row :gutter="10">
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
    </div>
    <el-table
      v-loading="$store.state.app.loading"
      :data="Appoint.data"
      :row-style="{ height: '90px' }"
      border
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="true" />
      <el-table-column label="姓名" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column label="性别" align="center" prop="sex" width="100" />
      <el-table-column label="年龄" align="center" prop="age" width="100" />
      <el-table-column label="联系方式" align="center" prop="phone" width="150" />
      <el-table-column
        label="身份证"
        align="center"
        prop="identity"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column v-if="params.roles_id == 2" label="预约医生" align="center" width="150">
        <template slot-scope="scope">
          {{ handleDoctor(scope.row.doctor) }}
        </template>
      </el-table-column>
      <el-table-column label="排号" align="center" prop="cno" width="100" />
      <el-table-column label="状态" align="center" prop="a_status" width="100">
        <template slot-scope="scope">
          <el-tag :type="handleColor(scope.row.a_status)">{{ scope.row.a_status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.a_time | fmtDateTime }}
        </template>
      </el-table-column>
      <el-table-column label="预计到达时间" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.b_time | fmtDateTime }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="look(scope.row)"
          >查看</el-button>
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
      <el-form ref="proFrom" :model="addappoint" :rules="rules">
        <el-form-item label="名字" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addappoint.username" :disabled="true" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-input v-model="addappoint.sex" :disabled="true" />
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
          <el-input v-model="addappoint.age" :disabled="true" />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="addappoint.phone" :disabled="true" />
        </el-form-item>
        <el-form-item label="身份证" :label-width="formLabelWidth" prop="identity">
          <el-input v-model="addappoint.identity" :disabled="true" />
        </el-form-item>
        <el-form-item label="预约时间" :label-width="formLabelWidth" prop="a_time">
          <el-input v-model="addappoint.a_time" :disabled="true" />
        </el-form-item>
        <el-form-item label="预计到达时间" :label-width="formLabelWidth" prop="b_time">
          <el-input v-model="addappoint.b_time" :disabled="true" />
        </el-form-item>
        <el-form-item label="预约状态" :label-width="formLabelWidth" prop="a_status">
          <el-select
            v-model.trim="addappoint.a_status"
            placeholder="请预约状态"
            clearable
            filterable
            size="small"
          >
            <el-option v-for="(item, index) in status" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSave('proFrom')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看详情" :visible.sync="open">
      <div ref="dowloadimg" class="classboder">
        <el-descriptions title="预约信息">
          <el-descriptions-item label="用户名">{{ openData.username }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ openData.age }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ openData.sex }}</el-descriptions-item>
          <el-descriptions-item
            label="电话"
          ><el-tag size="small">{{ openData.phone }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="身份证">{{ openData.identity }}</el-descriptions-item>
          <el-descriptions-item
            label="状态"
          ><el-tag size="small">{{ openData.a_status }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="排号">{{ openData.cno }}</el-descriptions-item>
          <el-descriptions-item label="预约时间">{{
            openData.a_time | fmtDateTime
          }}</el-descriptions-item>
          <el-descriptions-item label="预计到达时间">{{
            openData.b_time | fmtDateTime
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关闭</el-button>
        <el-button type="primary" @click="downloadcanvas">下载</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      class="page"
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="params.pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="Appoint.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      addappoint: {},
      dialogFormVisible: false,
      title: '',
      // 选中数组
      ids: [],
      open: false,
      openData: [],
      status: ['完成', '待处理', '取消'],
      sex: ['男', '女'],
      export: [],
      xg: {},
      // 非单个禁用
      single: true,
      value2: '',
      // 非多个禁用
      multiple: true,
      formLabelWidth: '100px',
      params: {
        page: 1,
        pageSize: 5,
        roles_id: window.localStorage.getItem('roles'),
        doctor: window.localStorage.getItem('user_id')
      },
      // 验证规则
      rules: {
        a_status: [{ required: true, message: '预约状态', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState('appoints', ['Appoint', 'user', 'doctor'])
  },
  methods: {
    ...mapActions('appoints', [
      'findAppoint',
      ,
      'deleteAppoint',
      'findUser',
      'saveOrUpdateAppoint',
      'queryDoctor'
    ]),
    look(row) {
      this.openData = row
      this.open = true
    },
    handleDoctor(id) {
      for (const key in this.doctor) {
        if (this.doctor[key].user_id == id) {
          return this.doctor[key].rolesName
        }
      }
      return ''
    },
    handleColor(row) {
      switch (row) {
        case '待处理':
          return 'danger'
        case '完成':
          return 'success'
        case '取消':
          return 'info'
        default:
          return ''
      }
    },
    downloadcanvas() {
      const content = this.$refs.dowloadimg
      html2canvas(content, {
        useCORS: true
      }).then(canvas => {
        // 处理你生成的canvas
        const a = document.createElement('a')
        a.setAttribute('href', canvas.toDataURL()) // toDataUrl：将canvas画布信息转化为base64格式图片
        a.setAttribute('download', `${this.openData.username}预约信息`) // 这个是必须的，否则会报错
        a.setAttribute('target', '_self')
        a.click()
        this.open = false
      })
    },
    //   点击添加按钮
    hanlderqueryAppoint() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      if (this.value2 !== '') {
        this.value2 = Array.from(this.value2)
        this.params.beginTime = this.value2[0]
        this.params.EndTime = this.value2[1]
      } else {
        delete this.params.beginTime
        delete this.params.EndTime
      }
      this.findAppoint(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryAppoint()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryAppoint()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.a_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
      this.export = selection.map(item => item)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.a_id || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteAppoint({ a_id: id })
        })
        .then(() => {
          this.hanlderqueryAppoint()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },

    //   点击模态框确定按钮
    toSave(proFrom) {
      this.$refs[proFrom].validate(valid => {
        if (valid) {
          this.saveOrUpdateAppoint(this.addappoint).then(res => {
            this.hanlderqueryAppoint(this.params)
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
      this.title = '修改预约'
      if (row.a_id) {
        this.addappoint = _.clone(row)
      } else {
        this.addappoint = this.xg
      }
      this.addappoint.a_time = moment(this.addappoint.a_time).format('YYYY-MM-DD hh:mm')
      this.addappoint.b_time = moment(this.addappoint.b_time).format('YYYY-MM-DD hh:mm')
      this.dialogFormVisible = true
    },
    //
    handleQuery() {
      this.hanlderqueryAppoint()
    },
    download(data) {
      const downloadUrl = `${process.env.VUE_APP_BASE_API}/appoint/download?data=${JSON.stringify(
        data
      )}`
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'forum'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    handleExport() {
      if (this.export.length === 0) {
        for (const key in this.Appoint.data) {
          if (this.Appoint.data[key].a_time) {
            this.Appoint.data[key].a_time = moment(this.Appoint.data[key].a_time).format(
              'YYYY-MM-DD hh:mm'
            )
          }
          if (this.Appoint.data[key].b_time) {
            this.Appoint.data[key].b_time = moment(this.Appoint.data[key].b_time).format(
              'YYYY-MM-DD hh:mm'
            )
          }
          if (this.Appoint.data[key].e_time) {
            this.Appoint.data[key].e_time = moment(this.Appoint.data[key].e_time).format(
              'YYYY-MM-DD hh:mm'
            )
          }
        }
        this.download(this.Appoint.data)
      } else {
        this.export = Array.from(this.export)
        for (const key in this.export) {
          if (this.export[key].a_time) {
            this.export[key].a_time = moment(this.export[key].a_time).format('YYYY-MM-DD hh:mm')
          }
          if (this.export[key].b_time) {
            this.export[key].b_time = moment(this.export[key].b_time).format('YYYY-MM-DD hh:mm')
          }
          if (this.export[key].e_time) {
            this.export[key].e_time = moment(this.export[key].e_time).format('YYYY-MM-DD hh:mm')
          }
        }
        this.download(this.export)
      }
    }
  },
  created() {
    this.findUser()
    this.queryDoctor().then(() => {
      this.hanlderqueryAppoint()
    })
  }
}
</script>
<style scoped lang="scss">
.drawerOps {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.anniu {
  margin-bottom: 20px;
}
.page {
  margin-top: 50px;
}
.classboder {
  border: 1px solid #dcdfe6;
  padding: 10px;
  border-radius: 5px;
}
</style>
