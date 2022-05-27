<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="params"
      :inline="true"
      label-width="68px"
      @submit.native.prevent
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="params.title"
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
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addNews">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="update"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="delNews"
        >删除</el-button>
      </el-col>
    </el-row>
    <!-- 添加按钮 -->
    <div class="add">
      <!-- 添加按钮模态框 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form ref="proFrom" :model="addnews" :rules="rules">
          <el-form-item label="新闻标题" :label-width="formLabelWidth" prop="title">
            <el-input v-model="addnews.title" placeholder="输入新闻标题" />
          </el-form-item>
          <el-form-item label="发布时间" :label-width="formLabelWidth" prop="publish_time">
            <el-date-picker
              v-model="addnews.publish_time"
              type="datetime"
              format="yyyy-MM-dd hh:mm"
              value-format="yyyy-MM-dd hh:mm"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="新闻内容" :label-width="formLabelWidth" prop="description">
            <el-input
              v-model="addnews.description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10 }"
              placeholder="输入新闻内容"
            />
          </el-form-item>
          <el-form-item label="图标" :label-width="formLabelWidth" prop="icon">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:7001/images/upload"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 640px">
              <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 640px" />
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="toSave('proFrom')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 表格 -->
    <el-table
      :data="article.data"
      style="width: 100%"
      size="small"
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" />
      <el-table-column
        prop="title"
        label="新闻标题"
        align="center"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column
        prop="description"
        label="新闻描述"
        align="center"
        :show-overflow-tooltip="true"
        width="350"
      />
      <el-table-column label="图片">
        <template v-slot="scope">
          <el-popover placement="right" width="200px" trigger="hover">
            <img :src="urlHandle(scope.row.url)" width="200px">
            <img slot="reference" :src="urlHandle(scope.row.url)" alt="" height="50">
          </el-popover> </template></el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.publish_time | fmtDateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
          <el-button
            type="text"
            size="small"
            style="color: red"
            @click="delNews(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
      background
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="article.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapState, mapActions } from 'vuex'
import qs from 'qs'
import _ from 'lodash'
export default {
  data() {
    return {
      addnews: {},
      dialogFormVisible: false,
      title: '',
      imageUrl: '',
      url: '',
      ids: [],
      xg: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      formLabelWidth: '80px',
      params: {
        type: '新闻',
        page: 1,
        pageSize: 5
      },
      // 验证规则
      rules: {
        title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('articles', ['article'])
  },
  methods: {
    ...mapActions('articles', ['findAllArticle', 'deleteArticle']),
    //   点击添加按钮
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.findAllArticle(this.params)
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
    //
    urlHandle(url) {
      return url ? process.env.VUE_APP_BASE_API + `/public/upload/` + url : ''
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.handleQuery()
    },
    handleQuery() {
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findAllArticle(this.params)
    },
    addNews() {
      this.title = '添加新闻'
      this.addnews = {}
      this.imageUrl = ''
      this.dialogFormVisible = true
    },
    // 点击编辑按钮
    update(row) {
      this.title = '修改新闻信息'
      if (row.id) {
        this.addnews = _.clone(row)
      } else {
        this.addnews = this.xg
      }
      this.imageUrl = process.env.VUE_APP_BASE_API + `/public/upload/` + this.addnews.url
      this.dialogFormVisible = true
    },
    handleAvatarSuccess(response) {
      try {
        this.imageUrl = process.env.VUE_APP_BASE_API + `/public/upload/` + response.avater
        this.url = response.avater
      } catch (error) {
        console.error(error)
      }
    },
    //   点击模态框确定按钮
    toSave(proFrom) {
      this.$refs[proFrom].validate(valid => {
        if (valid) {
          if (this.title == '修改新闻信息') {
            if (this.url != '') {
              this.addnews.url = this.url
            }
          }
          // 临时加上
          this.addnews.author = window.localStorage.getItem('name')
          this.addnews.type = '新闻'
          request.post('/artilcle/saveOrUpdateArticle', qs.stringify(this.addnews)).then(res => {
            this.handleQuery()
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
    delNews(id) {
      const did = id || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('此操作将删除该新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request
          .get('/artilcle/deleteById', {
            params: {
              id: did
            }
          })
          .then(res => {
            this.handleQuery()
            this.$message({
              type: 'success',
              message: res.message
            })
          })
      })
    }
  },
  created() {
    this.handleQuery()
  }
}
</script>
<style>
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
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
