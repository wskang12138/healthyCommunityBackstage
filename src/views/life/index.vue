<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="名字" prop="username">
        <el-select
          v-model.trim="params.username"
          placeholder="请选择名字"
          clearable
          filterable
          size="small"
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in user"
            :key="index"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="记录时间" prop="time">
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
        <el-col :span="1.5">
          <el-button
            class="pull-right right-10"
            icon="el-icon-download"
            type="primary"
            size="mini"
            @click="downloadFile"
          >模板下载</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5">
        <el-upload
          accept=".xlsx"
          :action="action"
          :http-request="modeUpload"
          :before-upload="beforeUploadFile"
        >
          <el-button type="info" plain icon="el-icon-upload2" size="mini">导入</el-button>
        </el-upload>
      </el-col>
    </el-row>

    <el-table
      v-loading="$store.state.app.loading"
      :data="Life.data"
      :row-style="{ height: '90px' }"
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" height="150" />
      <el-table-column label="姓名" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column
        label="体育锻炼"
        align="center"
        prop="physical"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="锻炼时间"
        align="center"
        prop="exercise"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="饮食爱好" align="center" prop="dietary" />
      <el-table-column label="睡眠情况" align="center" prop="sleep" />
      <el-table-column label="吸烟情况" align="center" prop="smoking" />
      <el-table-column label="喝酒情况" align="center" prop="drinking" />
      <el-table-column label="记录时间" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.time | fmtDateTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
        height="300"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            round
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            class="delete"
            size="mini"
            type="danger"
            round
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加按钮模态框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="proFrom" :model="addLife" :rules="rules">
        <el-form-item label="名字" :label-width="formLabelWidth" prop="username">
          <el-select v-model.trim="addLife.username" placeholder="请选择名字" clearable filterable>
            <el-option
              v-for="(item, index) in user"
              :key="index"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="体育锻炼" :label-width="formLabelWidth" prop="physical">
          <el-select v-model.trim="addLife.physical" placeholder="请选择体育锻炼" clearable>
            <el-option v-for="(item, index) in physical" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="锻炼时间" :label-width="formLabelWidth" prop="exercise">
          <el-select v-model.trim="addLife.exercise" placeholder="请选择时间" clearable>
            <el-option v-for="(item, index) in exercise" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="饮食爱好" :label-width="formLabelWidth" prop="dietary">
          <el-input v-model="addLife.dietary" placeholder="请输入饮食爱好" />
        </el-form-item>
        <el-form-item label="睡眠情况" :label-width="formLabelWidth" prop="sleep">
          <el-select v-model="addLife.sleep" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in sleep" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否吸烟" :label-width="formLabelWidth" prop="smoking">
          <el-select v-model.trim="addLife.smoking" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in pan" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="喝酒情况" :label-width="formLabelWidth" prop="drinking">
          <el-select v-model.trim="addLife.drinking" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in pan" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="记录时间" :label-width="formLabelWidth" prop="time">
          <el-date-picker
            v-model="addLife.time"
            type="datetime"
            format="yyyy-MM-dd hh:mm"
            value-format="yyyy-MM-dd hh:mm"
            placeholder="选择日期时间"
          />
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
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="params.pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="Life.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import request from '@/utils/request'
import moment from 'moment'
export default {
  data() {
    return {
      addLife: {},
      dialogFormVisible: false,
      title: '',
      mode: {},
      action: process.env.VUE_APP_BASE_API + '/life/upload',
      // 选中数组
      ids: [],
      flageData: ['是', '否'],
      flage: true,
      xg: {},
      // 非单个禁用
      // 导出数组
      export: [],
      sleep: ['6小时以下', '6-7小时', '八小时', '八小时以上'],
      physical: ['每周<3次', '每周3-5次', '每周6-8次', '每周8-10次', '每周>10次'],
      exercise: ['10以下', '10-20分钟', '20-40分钟', '40-60分钟', '60分钟以上'],
      pan: ['是', '否'],
      single: true,
      // 非多个禁用
      multiple: true,
      value2: '',
      formLabelWidth: '180px',
      cno: true,
      params: {
        page: 1,
        pageSize: 5
      },
      // 验证规则
      rules: {
        username: [{ required: true, message: '请选择' }],
        exercise: [{ required: true, message: '请选择', trigger: 'change' }],
        dietary: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],

        physical: [{ required: true, message: '请选择', trigger: 'change' }],

        smoking: [{ required: true, message: '请选择', trigger: 'change' }],
        drinking: [{ required: true, message: '请选择', trigger: 'change' }],
        time: [{ required: true, message: '请选择', trigger: 'change' }],
        sleep: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState('lifes', ['Life', 'user'])
  },
  methods: {
    ...mapActions('lifes', ['findLife', , 'deleteLife', 'findUser', 'saveOrUpdateLife']),
    modeUpload(item) {
      // console.log(item.file);
      this.mode = item.file
      this.upload()
    },
    beforeUploadFile(file) {
      const FileExt = file.name.replace(/.+\./, '')
      if (['xlsx'].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message({
          type: 'warning',
          message: '请上传后缀名为xlsx的附件！'
        })
        return false
      }
    },
    upload() {
      const fd = new FormData()
      fd.append('templateFile', this.mode)
      request.post('/life/upload', fd).then(res => {
        // 提示成功操作信息
        this.$message({
          type: 'success',
          message: res.message
        })
        window.location.reload()
      })
    },
    //   点击添加按钮
    hanlderqueryLife() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findLife(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryLife()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryLife()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.l_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
      this.export = selection.map(item => item)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.l_id || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteLife({ l_id: id })
        })
        .then(() => {
          this.hanlderqueryLife()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },

    handleAdd() {
      this.title = '添加生活爱好数据'
      this.addLife = {}
      this.dialogFormVisible = true
    },

    //   点击模态框确定按钮
    toSave(proFrom) {
      console.log(123456, this.food)

      this.$refs[proFrom].validate(valid => {
        if (valid) {
          const arr = Array.from(this.user)
          for (const index in arr) {
            if (arr[index].username == this.addLife.username) {
              this.addLife.l_user_id = arr[index].user_id
            }
          }
          this.saveOrUpdateLife(this.addLife).then(res => {
            this.hanlderqueryLife(this.params)
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
      this.title = '修改生活爱好'
      if (row.l_id) {
        this.addLife = _.clone(row)
      } else {
        this.addLife = this.xg
      }
      this.$set(this.addLife, 'food', this.addLife.dietary.split(','))
      this.dialogFormVisible = true
    },
    downloadFile() {
      const data = []
      this.download(data)
    },
    //
    handleQuery() {
      if (this.value2 !== '') {
        this.value2 = Array.from(this.value2)
        this.params.beginTime = this.value2[0]
        this.params.EndTime = this.value2[1]
      }
      this.hanlderqueryLife()
    },
    download(data) {
      const downloadUrl = `${process.env.VUE_APP_BASE_API}/life/download?data=${JSON.stringify(
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
        for (const key in this.Life.data) {
          if (this.Life.data[key].time) {
            this.Life.data[key].time = moment(this.Life.data[key].time).format('YYYY-MM-DD hh:mm')
          }
        }
        this.download(this.Life.data)
      } else {
        this.export = Array.from(this.export)
        for (const key in this.export) {
          if (this.export[key].time) {
            this.export[key].time = moment(this.export[key].time).format('YYYY-MM-DD hh:mm')
          }
        }
        this.download(this.export)
      }
    }
  },
  created() {
    this.hanlderqueryLife()
    this.findUser()
  }
}
</script>
<style scoped lang="scss"></style>
