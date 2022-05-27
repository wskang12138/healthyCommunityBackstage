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
      <el-form-item label="血型" prop="blood">
        <el-select
          v-model.trim="params.blood"
          placeholder="请选择血型"
          clearable
          filterable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="(item, index) in blood" :key="index" :label="item" :value="item" />
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
      <el-form-item label="健康状态" prop="status">
        <el-select
          v-model.trim="params.status"
          placeholder="请选择健康状态"
          clearable
          filterable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="(item, index) in status" :key="index" :label="item" :value="item" />
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
      :data="Heathy.data"
      style="width: 100%"
      :row-style="{ height: '90px' }"
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="编号" align="center" prop="user_id" height="150" />
      <el-table-column
        label="姓名"
        align="center"
        prop="username"
        :show-overflow-tooltip="true"
        fixed
      />
      <el-table-column
        label="体重(kg)"
        align="center"
        prop="weight"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="身高(cm)"
        align="center"
        prop="height"
        :show-overflow-tooltip="true"
      />

      <el-table-column label="收缩压(mmHg)" align="center" prop="blodpres_shrink" width="150" />
      <el-table-column label="舒张压(mmHg)" align="center" prop="blodpres_relax" width="150" />
      <el-table-column label="血氧值(%)" align="center" prop="oxygen" width="150" />
      <el-table-column label="脉搏(分/次)" align="center" prop="spygmus" width="150" />
      <el-table-column label="体温(.C)" align="center" prop="temperature" width="150" />
      <el-table-column label="指数" align="center" prop="BMI" />
      <el-table-column label="血型" align="center" prop="blood" />
      <el-table-column label="健康状态" align="center" prop="status" />
      <el-table-column label="记录时间" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.time | fmtDateTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="300"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            round
            icon="el-icon-message"
            @click="look(scope.row)"
          >详情</el-button>
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
      <el-form ref="proFrom" :model="addHeathy" :rules="rules">
        <el-form-item label="名字" :label-width="formLabelWidth" prop="username">
          <el-select
            v-model.trim="addHeathy.username"
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

        <el-form-item label="身高(cm)" :label-width="formLabelWidth" prop="height">
          <el-input v-model="addHeathy.height" placeholder="输入身高" />
        </el-form-item>
        <el-form-item label="体重(kg)" :label-width="formLabelWidth" prop="weight">
          <el-input v-model="addHeathy.weight" placeholder="输入体重" />
        </el-form-item>
        <el-form-item label="体温(.C)" :label-width="formLabelWidth" prop="temperature">
          <el-input v-model="addHeathy.temperature" placeholder="输入体温" />
        </el-form-item>
        <el-form-item label="收缩压(mmHg)" :label-width="formLabelWidth" prop="blodpres_shrink">
          <el-input v-model="addHeathy.blodpres_shrink" placeholder="输入收缩压" />
        </el-form-item>
        <el-form-item label="舒张压(mmHg)" :label-width="formLabelWidth" prop="blodpres_relax">
          <el-input v-model="addHeathy.blodpres_relax" placeholder="输入舒张压" />
        </el-form-item>
        <el-form-item label="血氧(%)" :label-width="formLabelWidth" prop="oxygen">
          <el-input v-model="addHeathy.oxygen" placeholder="输入血氧" />
        </el-form-item>
        <el-form-item label="脉搏(分/次)" :label-width="formLabelWidth" prop="spygmus">
          <el-input v-model="addHeathy.spygmus" placeholder="输入脉搏" />
        </el-form-item>
        <el-form-item label="血型" :label-width="formLabelWidth" prop="blood">
          <el-select v-model.trim="addHeathy.blood" placeholder="请选择血型" clearable>
            <el-option v-for="(item, index) in blood" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="记录时间" :label-width="formLabelWidth" prop="time">
          <el-date-picker
            v-model="addHeathy.time"
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

    <el-dialog title="查看详情" :visible.sync="open">
      <div ref="dowloadimg" class="classborder">
        <el-descriptions title="用户健康生理数据信息">
          <el-descriptions-item label="用户名">{{ openData.username }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ openData.age }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ openData.sex }}</el-descriptions-item>
          <el-descriptions-item label="身高(cm)">{{ openData.height }}</el-descriptions-item>
          <el-descriptions-item label="体重(kg)">{{ openData.weight }}</el-descriptions-item>
          <el-descriptions-item label="舒张压(mmHg)">{{
            openData.blodpres_relax
          }}</el-descriptions-item>
          <el-descriptions-item label="收缩压(mmHg)">{{
            openData.blodpres_shrink
          }}</el-descriptions-item>
          <el-descriptions-item label="温度(C)">{{ openData.temperature }}</el-descriptions-item>
          <el-descriptions-item label="血氧(%)">{{ openData.oxygen }}</el-descriptions-item>
          <el-descriptions-item label="血型">
            <el-tag size="small">{{ openData.blood }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="BMI">{{ openData.BMI }}</el-descriptions-item>
          <el-descriptions-item label="健康状态">{{ openData.status }}</el-descriptions-item>
          <el-descriptions-item label="记录时间">{{
            openData.time | fmtDateTime
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
      :total="Heathy.total"
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
import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      addHeathy: {},
      dialogFormVisible: false,
      open: false,
      title: '',
      openData: {},
      mode: {},
      action: process.env.VUE_APP_BASE_API + '/heathy/upload',
      // 选中数组
      ids: [],
      flageData: ['是', '否'],
      flage: true,
      xg: {},
      // 非单个禁用
      // 导出数组
      export: [],
      status: ['正常', '低烧', '高烧', '心率过高', '低血压', '高血压', '偏胖', '偏瘦'],
      blood: ['A型', 'B型', 'AB型', 'C型', '其它'],

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
        username: [{ required: true, message: '请选择', trigger: ['blur'] }],
        height: [{ required: true, message: '请选择', trigger: ['blur'] }],
        temperature: [{ required: true, message: '请选择', trigger: ['blur'] }],

        weight: [{ required: true, message: '请选择', trigger: ['blur'] }],
        blodpres_shrink: [{ required: true, message: '请选择', trigger: ['blur'] }],
        blodpres_relax: [{ required: true, message: '请选择', trigger: ['blur'] }],
        blood: [{ required: true, message: '请选择', trigger: ['blur'] }],
        time: [{ required: true, message: '请选择', trigger: ['blur'] }]
      }
    }
  },
  computed: {
    ...mapState('heathys', ['Heathy', 'user'])
  },
  methods: {
    ...mapActions('heathys', ['findHeathy', , 'deleteHeathy', 'findUser', 'saveOrUpdateHeathy']),
    modeUpload(item) {
      // console.log(item.file);
      this.mode = item.file
      this.upload()
    },
    look(row) {
      this.openData = row
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
        a.setAttribute('download', `${this.openData.username}用户生理数据`) // 这个是必须的，否则会报错
        a.setAttribute('target', '_self')
        a.click()
        this.open = false
      })
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
      request.post('/heathy/upload', fd).then(res => {
        // 提示成功操作信息
        this.$message({
          type: 'success',
          message: res.message
        })
        setTimeout(() => {
          window.location.reload()
        }, 0)
      })
    },
    //   点击添加按钮
    hanlderqueryHeathy() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findHeathy(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryHeathy()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryHeathy()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.hid)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
      this.export = selection.map(item => item)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.hid || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteHeathy({ hid: id })
        })
        .then(() => {
          this.hanlderqueryHeathy()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },

    handleAdd() {
      this.title = '添加健康生理数据'
      this.addHeathy = {}
      this.dialogFormVisible = true
    },

    //   点击模态框确定按钮
    toSave(proFrom) {
      this.$refs[proFrom].validate(valid => {
        if (valid) {
          const arr = Array.from(this.user)
          for (const index in arr) {
            if (arr[index].username == this.addHeathy.username) {
              this.addHeathy.cf_user_id = arr[index].user_id
            }
          }
          this.saveOrUpdateHeathy(this.addHeathy).then(res => {
            this.hanlderqueryHeathy(this.params)
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
      if (row.hid) {
        this.addHeathy = _.clone(row)
      } else {
        this.addHeathy = this.xg
      }
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
      this.hanlderqueryHeathy()
    },
    download(data) {
      const downloadUrl = `${process.env.VUE_APP_BASE_API}/heathy/download?data=${JSON.stringify(
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
        for (const key in this.Heathy.data) {
          if (this.Heathy.data[key].time) {
            this.Heathy.data[key].time = moment(this.Heathy.data[key].time).format(
              'YYYY-MM-DD hh:mm'
            )
          }
        }
        this.download(this.Heathy.data)
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
    this.hanlderqueryHeathy()
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
.classborder {
  border: 1px solid #dcdfe6;
  padding: 10px;
  border-radius: 5px;
}
</style>
