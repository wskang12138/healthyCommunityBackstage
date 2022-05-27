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
      <el-form-item label="确诊时间" prop="time">
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
      <el-form-item label="是否治愈" prop="flage">
        <el-select
          v-model="params.flage"
          placeholder="是否治愈"
          clearable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="(item, index) in flageData" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="diease_name">
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
      <el-table-column
        label="序号"
        align="center"
        type="index"
        fixed
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="姓名"
        align="center"
        prop="username"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="性别" align="center" prop="sex" width="150" />
      <el-table-column label="年龄" align="center" prop="age" width="150" />
      <el-table-column label="电话" align="center" prop="phone" width="150" />
      <el-table-column label="疾病名称" align="center" prop="diease_name" width="150" />
      <el-table-column label="是否治愈" align="center" prop="flage" width="150" />
      <el-table-column label="过敏物质" align="center" prop="allergen" width="150" />
      <el-table-column label="有无残疾" align="center" prop="disabled_orno" width="150" />
      <el-table-column label="残疾证号" align="center" prop="disabled_con" width="150" />
      <el-table-column label="确诊时间" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.q_time | fmtDateTime }}
        </template>
      </el-table-column>
      <el-table-column label="治愈时间" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.z_time | fmtDateTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
        fixed="right"
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
      <el-form ref="proFrom" :model="addhistorydisease" :rules="rules">
        <el-form-item label="名字" :label-width="formLabelWidth" prop="username">
          <el-select
            v-model.trim="addhistorydisease.username"
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
        <el-form-item label="疾病名称" :label-width="formLabelWidth" prop="diease_name">
          <el-input v-model="addhistorydisease.diease_name" placeholder="请输入疾病名称" />
        </el-form-item>
        <el-form-item label="过敏物质" :label-width="formLabelWidth" prop="allergen">
          <el-input v-model="addhistorydisease.allergen" placeholder="请输入疾病名称" />
        </el-form-item>
        <el-form-item label="确诊时间" :label-width="formLabelWidth" prop="q_time">
          <el-date-picker
            v-model="addhistorydisease.q_time"
            type="datetime"
            format="yyyy-MM-dd hh:mm"
            value-format="yyyy-MM-dd hh:mm"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="是否治愈" :label-width="formLabelWidth" prop="flage">
          <el-switch
            v-model="flage"
            active-text="是"
            inactive-text="否"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item
          v-if="flage"
          key="z_time"
          label="治愈时间"
          :label-width="formLabelWidth"
          prop="z_time"
        >
          <el-date-picker
            v-model="addhistorydisease.z_time"
            type="datetime"
            format="yyyy-MM-dd hh:mm"
            value-format="yyyy-MM-dd hh:mm"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item key="cno" label="有无残疾" :label-width="formLabelWidth" prop="cno">
          <el-switch
            v-model="cno"
            active-text="有"
            inactive-text="无"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item v-if="cno" label="残疾编号" :label-width="formLabelWidth" prop="disabled_con">
          <el-input v-model="addhistorydisease.disabled_con" placeholder="请输入残疾编号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSave('proFrom')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看详情" :visible.sync="open">
      <div ref="dowloadimg" class="classboder">
        <el-descriptions title="用户历史疾病信息">
          <el-descriptions-item label="用户名">{{ openData.username }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ openData.age }}</el-descriptions-item>
          <el-descriptions-item
            label="电话"
          ><el-tag size="small">{{ openData.phone }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="疾病名称">{{ openData.diease_name }}</el-descriptions-item>
          <el-descriptions-item
            label="是否治愈"
          ><el-tag size="small">{{ openData.flage }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="过敏物质">{{ openData.allergen }}</el-descriptions-item>
          <el-descriptions-item label="有无残疾">{{ openData.disabled_orno }}</el-descriptions-item>
          <el-descriptions-item label="残疾证号">{{ openData.disabled_con }}</el-descriptions-item>
          <el-descriptions-item label="确诊时间">{{
            openData.q_time | fmtDateTime
          }}</el-descriptions-item>
          <el-descriptions-item label="治愈时间">{{
            openData.z_time | fmtDateTime
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
import html2canvas from 'html2canvas'
import moment from 'moment'
export default {
  data() {
    return {
      addhistorydisease: {},
      dialogFormVisible: false,
      title: '',
      // 选中数组
      ids: [],
      open: false,
      openData: {},
      flageData: ['是', '否'],
      flage: true,
      xg: {},
      // 非单个禁用
      // 导出数组
      export: [],
      single: true,
      // 非多个禁用
      multiple: true,
      value2: '',
      formLabelWidth: '80px',
      cno: true,
      params: {
        page: 1,
        pageSize: 5
      },
      // 验证规则
      rules: {
        username: [{ required: true, message: '请输入名字标题', trigger: 'blur' }],
        diease_name: [{ required: true, message: '请输入疾病名称', trigger: 'blur' }],
        q_time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        disabled_con: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        z_time: [{ required: true, message: '请输入治愈时间', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('historyDieases', ['Diease', 'user'])
  },
  methods: {
    ...mapActions('historyDieases', [
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
    look(row) {
      this.openData = row
      console.log(row)
      this.open = true
    },
    downloadcanvas() {
      const content = this.$refs.dowloadimg
      html2canvas(content, {
        useCORS: true
      }).then(canvas => {
        // 处理你生成的canvas
        const a = document.createElement('a')
        a.setAttribute('href', canvas.toDataURL()) // toDataUrl：将canvas画布信息转化为base64格式图片
        a.setAttribute('download', `${this.openData.username}用户历史疾病`) // 这个是必须的，否则会报错
        a.setAttribute('target', '_self')
        a.click()
        this.open = false
      })
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
      this.ids = selection.map(item => item.j_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
      this.export = selection.map(item => item)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.j_id || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteDiease({ j_id: id })
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
      this.title = '添加病人'
      this.addhistorydisease = {}
      this.dialogFormVisible = true
    },
    //   点击模态框确定按钮
    toSave(proFrom) {
      this.$refs[proFrom].validate(valid => {
        if (valid) {
          const arr = Array.from(this.user)
          for (const index in arr) {
            if (arr[index].username == this.addhistorydisease.username) {
              this.addhistorydisease.x_user_id = arr[index].user_id
            }
          }
          delete this.addhistorydisease.username
          this.cno
            ? (this.addhistorydisease.disabled_orno = '有')
            : (this.addhistorydisease.disabled_orno = '无')
          this.flage ? (this.addhistorydisease.flage = '是') : (this.addhistorydisease.flage = '否')
          this.saveOrUpdateDiease(this.addhistorydisease).then(res => {
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
      this.title = '修改病人'
      if (row.j_id) {
        this.addhistorydisease = _.clone(row)
      } else {
        this.addhistorydisease = this.xg
      }
      this.addhistorydisease.flage == '是' ? (this.flage = true) : (this.flage = false)
      this.addhistorydisease.disabled_orno == '有' ? (this.cno = true) : (this.cno = false)
      this.dialogFormVisible = true
    },
    //
    handleQuery() {
      if (this.value2 !== '') {
        this.value2 = Array.from(this.value2)
        this.params.beginTime = this.value2[0]
        this.params.EndTime = this.value2[1]
      }
      this.hanlderqueryDiease()
    },
    download(data) {
      const downloadUrl = `${
        process.env.VUE_APP_BASE_API
      }/historyDiease/download?data=${JSON.stringify(data)}`
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
        for (const key in this.Diease.data) {
          if (this.Diease.data[key].q_time) {
            this.Diease.data[key].q_time = moment(this.Diease.data[key].q_time).format(
              'YYYY-MM-DD hh:mm'
            )
          }
          if (this.Diease.data[key].z_time) {
            this.Diease.data[key].z_time = moment(this.Diease.data[key].z_time).format(
              'YYYY-MM-DD hh:mm'
            )
          }
        }
        this.download(this.Diease.data)
      } else {
        this.export = Array.from(this.export)
        for (const key in this.export) {
          if (this.export[key].q_time) {
            this.export[key].q_time = moment(this.export[key].q_time).format('YYYY-MM-DD hh:mm')
          }
          if (this.export[key].z_time) {
            this.export[key].z_time = moment(this.export[key].z_time).format('YYYY-MM-DD hh:mm')
          }
        }
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
.classboder {
  border: 1px solid #dcdfe6;
  padding: 10px;
  border-radius: 5px;
}
</style>
