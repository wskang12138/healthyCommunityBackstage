<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="params.username"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="地址" prop="address">
        <el-input
          v-model="params.address"
          placeholder="请输入地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="政治面貌" prop="political">
        <el-select
          v-model.trim="params.political"
          placeholder="请选择政治面貌"
          clearable
          filterable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="(item, index) in political" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="文化程度" prop="level">
        <el-select
          v-model.trim="params.level"
          placeholder="请选择文化程度"
          clearable
          filterable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="(item, index) in level" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-select
          v-model.trim="params.sex"
          placeholder="请选择性别"
          clearable
          filterable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="(item, index) in sex" :key="index" :label="item" :value="item" />
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
          v-if="qxuan"
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
    <div class="table">
      <el-table
        v-loading="$store.state.app.loading"
        :data="Resident.data"
        border
        style="width: 100%"
        :row-style="{ height: '90px' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="序号" align="center" type="index" height="150" />
        <el-table-column
          label="姓名"
          align="center"
          prop="username"
          :show-overflow-tooltip="true"
          fixed
        />
        <el-table-column label="性别" align="center" prop="sex" :show-overflow-tooltip="true" />
        <el-table-column label="年龄" align="center" prop="age" :show-overflow-tooltip="true" />

        <el-table-column label="电话" align="center" prop="phone" width="150" />
        <el-table-column
          label="住址"
          align="center"
          prop="address"
          :show-overflow-tooltip="true"
          width="150"
        />
        <el-table-column
          label="电子邮件"
          align="center"
          prop="sendEmail"
          :show-overflow-tooltip="true"
          width="150"
        />
        <el-table-column label="出生日期" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.borth | borthdate }}
          </template>
        </el-table-column>
        <el-table-column label="qq号" align="center" prop="qq" width="150" />
        <el-table-column label="文化水平" align="center" prop="level" />
        <el-table-column label="是否已婚" align="center" prop="marriage" />
        <el-table-column label="政治面貌" align="center" prop="political" />
        <el-table-column label="门牌号" align="center" prop="number" />
        <el-table-column label="身份证号" align="center" prop="identity" />

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
              v-if="qxuan"
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
    </div>
    <!-- 添加按钮模态框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="proFrom" :model="addResident" :rules="rules">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addResident.username" placeholder="输入姓名" />
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="identity">
          <el-input v-model.lazy="addResident.identity" placeholder="输入" @blur="getInfo" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select
            v-model.trim="addResident.sex"
            placeholder="请选择性别"
            clearable
            filterable
            size="small"
            :disabled="true"
          >
            <el-option v-for="(item, index) in sex" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="addResident.phone" placeholder="输入手机" />
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="addResident.address" placeholder="输入地址" />
        </el-form-item>
        <el-form-item label="电子邮件" :label-width="formLabelWidth" prop="sendEmail">
          <el-input v-model="addResident.sendEmail" placeholder="输入电子邮件" />
        </el-form-item>
        <el-form-item label="qq号" :label-width="formLabelWidth" prop="qq">
          <el-input v-model="addResident.qq" placeholder="输入" />
        </el-form-item>
        <el-form-item label="门牌号" :label-width="formLabelWidth" prop="number">
          <el-input v-model="addResident.number" placeholder="输入" />
        </el-form-item>

        <el-form-item label="文化程度" :label-width="formLabelWidth" prop="level">
          <el-select
            v-model.trim="addResident.level"
            placeholder="请选择文化程度"
            clearable
            filterable
            size="small"
          >
            <el-option v-for="(item, index) in level" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="政治面貌" :label-width="formLabelWidth" prop="political">
          <el-select
            v-model.trim="addResident.political"
            placeholder="请选择政治面貌"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="(item, index) in political"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否已婚" :label-width="formLabelWidth" prop="marriage">
          <el-select
            v-model.trim="addResident.marriage"
            placeholder="请选择"
            clearable
            filterable
            size="small"
          >
            <el-option v-for="(item, index) in marriage" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" :label-width="formLabelWidth" prop="borth">
          <el-date-picker
            v-model="addResident.borth"
            :disabled="true"
            type="date"
            placeholder="选择日期"
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
        <el-descriptions title="用户基本信息">
          <el-descriptions-item label="用户名">{{ openData.username }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ openData.age }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ openData.sex }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ openData.phone }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ openData.address }}</el-descriptions-item>
          <el-descriptions-item label="电子邮件">{{ openData.sendEmail }}</el-descriptions-item>
          <el-descriptions-item label="出生日期">{{
            openData.borth | borthdate
          }}</el-descriptions-item>
          <el-descriptions-item label="qq号">{{ openData.qq }}</el-descriptions-item>
          <el-descriptions-item label="文化水平">{{ openData.level }}</el-descriptions-item>
          <el-descriptions-item label="是否已婚">
            <el-tag size="small">{{ openData.marriage }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="政治面貌">{{ openData.political }}</el-descriptions-item>
          <el-descriptions-item label="门牌号">{{ openData.number }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ openData.identity }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关闭</el-button>
        <el-button type="primary" @click="downloadcanvas">下载</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="params.pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="Resident.total"
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
import { validateMobilePhone, IdentityCodeValid, isIdCard, address } from '@/utils/validate'

export default {
  data() {
    return {
      addResident: {},
      dialogFormVisible: false,
      open: false,
      qxuan: false,
      title: '',
      openData: {},
      mode: {},
      action: process.env.VUE_APP_BASE_API + '/Resident/upload',
      // 选中数组
      ids: [],
      flage: true,
      xg: {},
      // 非单个禁用
      // 导出数组
      export: [],

      single: true,
      sex: ['男', '女'],
      level: ['初中', '高中', '本科', '专科', '硕士', '博士', '其它'],
      // 非多个禁用
      political: ['中共党员', '中共预备党员', '共青团员', '群众', '其它'],
      marriage: ['是', '否'],
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
        sex: [{ required: true, message: '请选择', trigger: ['blur'] }],
        borth: [{ required: true, message: '请选择', trigger: ['change'] }],
        phone: [
          { required: true, message: '请选择', trigger: ['blur'] },
          {
            validator: validateMobilePhone,
            message: '请输入正确手机号',
            trigger: 'blur'
          }
        ],
        identity: [
          { required: true, message: '请选择', trigger: ['blur'] },
          {
            validator: IdentityCodeValid,
            message: '请输入正确的身份证号',
            trigger: 'blur'
          }
        ],
        level: [{ required: true, message: '请选择', trigger: ['change'] }],
        address: [{ required: true, message: '请选择', trigger: ['blur'] }],
        marriage: [{ required: true, message: '请选择', trigger: ['change'] }],
        political: [{ required: true, message: '请选择', trigger: ['change'] }]
      }
    }
  },
  computed: {
    ...mapState('Residents', ['Resident'])
  },
  methods: {
    ...mapActions('Residents', ['findResident', , 'deleteResident', 'saveOrUpdateResident']),
    modeUpload(item) {
      // console.log(item.file);
      this.mode = item.file
      this.upload()
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
        a.setAttribute('download', `${this.openData.username}用户基本数据`) // 这个是必须的，否则会报错
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
      request.post('/resident/upload', fd).then(res => {
        // 提示成功操作信息
        this.$message({
          type: 'success',
          message: res.message
        })
        window.location.reload()
      })
    },
    //   点击添加按钮
    hanlderqueryResident() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findResident(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryResident()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryResident()
    },
    getInfo() {
      if (isIdCard(this.addResident.identity)) {
        const idCard = this.addResident.identity
        let sex = null
        let birth = null
        const myDate = new Date()
        const month = myDate.getMonth() + 1
        const day = myDate.getDate()
        let age = 0

        if (idCard.length === 18) {
          age = myDate.getFullYear() - idCard.substring(6, 10) - 1
          sex = idCard.substring(16, 17)
          birth =
            idCard.substring(6, 10) +
            '-' +
            idCard.substring(10, 12) +
            '-' +
            idCard.substring(12, 14)
          if (
            idCard.substring(10, 12) < month ||
            (idCard.substring(10, 12) === month && idCard.substring(12, 14) <= day)
          )
            age++
        }
        if (idCard.length === 15) {
          age = myDate.getFullYear() - idCard.substring(6, 8) - 1901
          sex = idCard.substring(13, 14)
          birth =
            '19' +
            idCard.substring(6, 8) +
            '-' +
            idCard.substring(8, 10) +
            '-' +
            idCard.substring(10, 12)
          if (
            idCard.substring(8, 10) < month ||
            (idCard.substring(8, 10) === month && idCard.substring(10, 12) <= day)
          )
            age++
        }

        if (sex % 2 === 0) this.addResident.sex = '女'
        // 性别代码 1代表男，0代表女，暂时不涉及其他类型性别
        else this.addResident.sex = '男'
        this.addResident.borth = birth
        this.addResident.address = address(this.addResident.identity)
      }
    },

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
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.user_id || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteResident({ user_id: id })
        })
        .then(() => {
          this.hanlderqueryResident()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },

    handleAdd() {
      this.title = '添加用户数据'
      this.addResident = {}
      this.dialogFormVisible = true
    },

    //   点击模态框确定按钮
    toSave(proFrom) {
      console.log(123456, this.food)

      this.$refs[proFrom].validate(valid => {
        if (valid) {
          this.saveOrUpdateResident(this.addResident).then(res => {
            this.hanlderqueryResident()
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
      this.title = '修改用户信息'
      if (row.user_id) {
        this.addResident = _.clone(row)
      } else {
        this.addResident = this.xg
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
      this.hanlderqueryResident()
    },
    download(data) {
      const downloadUrl = `${process.env.VUE_APP_BASE_API}/resident/download?data=${JSON.stringify(
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
        for (const key in this.Resident.data) {
          if (this.Resident.data[key].borth) {
            this.Resident.data[key].borth = moment(this.Resident.data[key].borth).format(
              'YYYY-MM-DD'
            )
          }
        }
        this.download(this.Resident.data)
      } else {
        this.export = Array.from(this.export)
        for (const key in this.export) {
          if (this.export[key].borth) {
            this.export[key].borth = moment(this.export[key].borth).format('YYYY-MM-DD')
          }
        }
        this.download(this.export)
      }
    }
  },
  created() {
    this.hanlderqueryResident()
    this.qxuan = window.localStorage.getItem('roles') == 2
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
.table {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
