<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >移除</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="$store.state.app.loading"
      :data="log.data"
      class="table"
      :row-style="{ height: '60px' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="true" />
      <el-table-column label="姓名" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column label="方法" align="center" prop="method" />
      <el-table-column label="路劲" align="center" prop="url" />
      <el-table-column label="请求ip" align="center" prop="ip" />
      <el-table-column label="操作时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.by_time | fmtDateTime }}
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
      :page-sizes="[5, 10, 20, 30, 100, 500]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="log.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
/* eslint-disable */

import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      dialogFormVisible: false,
      title: '',
      // 选中数组
      ids: [],
      multiple: true,
      formLabelWidth: '80px',
      params: {
        page: 1,
        pageSize: 5
      }
    }
  },
  computed: {
    ...mapState('logs', ['log'])
  },
  methods: {
    ...mapActions('logs', ['findLog', 'deleteLog']),
    //   点击添加按钮
    hanlderqueryLog() {
      this.findLog(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderqueryLog()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderqueryLog()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.log_id)
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let id = row.log_id || Array.from(this.ids).join(',') //数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLog({ log_id: id }).then(() => {
          this.hanlderqueryLog()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
      })
    },
    handleQuery() {
      this.hanlderqueryLog()
    }
  },
  created() {
    this.hanlderqueryLog()
  }
}
</script>
<style scoped lang="scss"></style>
