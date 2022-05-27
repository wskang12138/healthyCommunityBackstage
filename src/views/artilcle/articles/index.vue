<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="params.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="作者" prop="status">
        <el-select
          v-model="params.author"
          placeholder="作者"
          clearable
          size="small"
          @change="handleQuery"
        >
          <el-option
            v-for="(item, index) in auth.data"
            :key="index"
            :label="item.author"
            :value="item.author"
          />
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
      :data="queryArticles.data"
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" />
      <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column
        label="文章内容"
        align="center"
        prop="description"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="浏览量" align="center" prop="count" />
      <el-table-column label="创建者" align="center" prop="author" />
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.publish_time | fmtDateTime }}
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

    <!-- 分页 -->
    <el-pagination
      class="page"
      background
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryArticles.total"
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
      addartilcles: {},
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      params: {
        type: '文章',
        page: 1,
        pageSize: 5
      }
    }
  },
  computed: {
    ...mapState('articles', ['queryArticles', 'auth'])
  },
  methods: {
    ...mapActions('articles', ['queryArticle', 'findAuthor', 'deleteArticle']),
    //   点击添加按钮
    hanlderqueryArticle() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.queryParams[key]
        }
      }
      this.queryArticle(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryArticle()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryArticle()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.deleteArticle(id)
        })
        .then(() => {
          this.hanlderqueryArticle()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },

    handleAdd() {
      this.$router.push({
        path: `/news/addaritcles/0`
      })
    },
    handleUpdate(row) {
      const id = row.id || Array.from(this.ids).join('')
      this.$router.push({
        path: `/news/addaritcles/${id}`
      })
    },
    //
    handleQuery() {
      this.hanlderqueryArticle()
    }
  },
  created() {
    this.hanlderqueryArticle()
    this.findAuthor()
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
