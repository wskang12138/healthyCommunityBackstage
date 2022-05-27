<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="药品名称" prop="medicine_name">
        <el-input
          v-model="params.medicine_name"
          placeholder="请输入标题"
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
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          class="pull-right right-10"
          icon="el-icon-download"
          type="primary"
          size="mini"
          @click="downloadFile"
        >模板下载</el-button>
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

    <div class="content">
      <div v-for="(item, index) in medicine" :key="index" class="box">
        <div class="medicine_img">
          <img :src="urlHandle(item.url)">
          <div class="operation">
            <div class="updata" @click="handleUpdate(item)">修改</div>
            <div class="delete" @click="handleDelete(item.id)">删除</div>
          </div>
        </div>
        <div class="right">
          <div class="data">
            <h3>药品名称:{{ item.medicine_name }}</h3>
            <h3>批准文号:{{ item.approval_num }}</h3>
            <h3>批次号:{{ item.batch_num }}</h3>
            <h3>规　格:{{ item.scale }}</h3>
            <h3>用法用量:{{ item.consumption }}</h3>
            <h3>疗效:{{ item.effects }}</h3>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="药品图片" prop="url">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:7001/images/upload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="药品名称" prop="medicine_name">
          <el-input v-model="form.medicine_name" />
        </el-form-item>
        <el-form-item label="批准文号" prop="approval_num">
          <el-input v-model="form.approval_num" />
        </el-form-item>
        <el-form-item label="批次号" prop="batch_num">
          <el-input v-model="form.batch_num" />
        </el-form-item>
        <el-form-item label="规格" prop="scale">
          <el-input v-model="form.scale" />
        </el-form-item>
        <el-form-item label="用法用量" prop="consumption">
          <el-input v-model="form.consumption" />
        </el-form-item>
        <el-form-item label="药品疗效" prop="effects">
          <el-input v-model="form.effects" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="toSave('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import request from '@/utils/request'

export default {
  data() {
    return {
      formLabelWidth: '80px',
      open: false,
      title: '',
      mode: {},
      action: process.env.VUE_APP_BASE_API + '/medicine/upload',
      form: {},
      rules: {
        medicine_name: [{ required: true, message: '请输入', trigger: ['blur'] }],
        approval_num: [{ required: true, message: '请输入', trigger: ['blur'] }],
        batch_num: [{ required: true, message: '请输入', trigger: ['blur'] }],
        scale: [{ required: true, message: '请输入', trigger: ['blur'] }],
        consumption: [{ required: true, message: '请输入', trigger: ['blur'] }],
        effects: [{ required: true, message: '请输入', trigger: ['change'] }]
      },
      url: '',
      params: {},
      imageUrl: ''
    }
  },
  computed: {
    ...mapState('medicines', ['medicine'])
  },
  methods: {
    ...mapActions('medicines', ['findMedicine', 'deleteMedicine', 'saveUpdateMedicine']),
    // 等级筛选互斥效果

    handleAdd() {
      this.title = '增加药品'
      this.form = {}
      ;(this.imageUrl = ''), (this.url = ''), (this.open = true)
    },
    urlHandle(url) {
      if (url.includes('http')) {
        return url
      } else {
        return url ? process.env.VUE_APP_BASE_API + `/public/upload/` + url : ''
      }
    },
    modeUpload(item) {
      this.mode = item.file
      this.upload()
      window.location.reload()
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
      request.post('/medicine/upload', fd).then(res => {
        // 提示成功操作信息
        this.$message({
          type: 'success',
          message: res.message
        })
      })
    },
    downloadFile() {
      this.download(0)
    },
    handleUpdate(row) {
      this.title = '修改药品'
      this.form = _.clone(row)
      this.imageUrl = this.urlHandle(this.form.url)
      this.open = true
    },
    toSave(from) {
      this.$refs[from].validate(valid => {
        if (valid) {
          if (this.title == '修改药品') {
            if (this.url) {
              this.form.url = this.url
            }
          } else {
            this.form.url = this.url
          }
          this.saveUpdateMedicine(this.form).then(res => {
            this.handleQuery()
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
    handleDelete(id) {
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMedicine({ id: id })
          .then(() => {
            this.handleQuery()
            this.$message({
              type: 'success',
              message: res.message
            })
          })
          .catch(function() {})
      })
    },
    handleAvatarSuccess(response) {
      try {
        this.imageUrl = process.env.VUE_APP_BASE_API + `/public/upload/` + response.avater
        this.url = response.avater
      } catch (error) {
        console.error(error)
      }
    },
    download(data) {
      const downloadUrl = `${process.env.VUE_APP_BASE_API}/medicine/download?id=${data}`
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'forum'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    handleExport() {
      this.download(1)
    },
    handleQuery() {
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findMedicine(this.params).then(() => {})
    }
  },
  created() {
    this.handleQuery()
  }
}
</script>
<style scoped lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px !important;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.content {
  display: flex;
  flex-wrap: wrap;
  .box {
    margin-top: 40px;
    margin-left: 15px;
    box-shadow: 2px 5px 4px 1px rgba(128, 110, 110, 0.5);
    border: 1px solid #dcdfe6;
    transition: all 0.3s linear;
    border-radius: 2px;
    display: flex;
    &:hover {
      box-shadow: 4px 10px 5px 0px rgba(87, 78, 78, 0.5);
    }
    .medicine_img {
      overflow: hidden;
      img {
        width: 160px;
        height: 150px;
        transition: all 1s ease 0s;
        &:hover {
          -moz-transform: scale(1.35);
          -webkit-transform: scale(1.35);
        }
      }
      .operation {
        display: flex;
        padding: 10px;
        margin-top: 20px;
        .updata {
          background-color: green;
          color: white;
          height: 40px;
          width: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 15%;
          &:hover {
            cursor: pointer;
          }
        }
        .delete {
          background-color: rgb(119, 28, 28);
          color: white;
          margin-left: 10px;
          height: 40px;
          width: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 15%;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .right {
      padding: 2px;
      .data {
        width: 220px;
        font-size: 11px;
        color: #636363;
        padding: 10px;
        padding-top: 2px;
      }
    }
  }
}
</style>
