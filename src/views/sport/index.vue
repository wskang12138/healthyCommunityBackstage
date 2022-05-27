<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="params.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运动类型" prop="status">
        <el-select
          v-model="params.type"
          placeholder="运动类型"
          clearable
          size="small"
          @change="handleQuery"
        >
          <el-option v-for="(item, index) in sportData" :key="index" :label="item" :value="item" />
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
      :data="sport.data"
      class="table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="运动名称:">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="预计时间:">
              <span>{{ props.row.time }}分钟</span>
            </el-form-item>
            <el-form-item label="训练次数:">
              <span>{{ props.row.per }}*{{ props.row.groupes }}组</span>
            </el-form-item>
            <el-form-item label="作用">
              <span>{{ props.row.effect }}</span>
            </el-form-item>
            <el-form-item label="要点: " label-position="left">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="适宜人群: " label-position="left">
              <span>{{ props.row.suit }}</span>
            </el-form-item>
            <el-form-item label="视频连接: ">
              <span>{{ props.row.video }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" />
      <el-table-column label="运动名称" prop="name" />
      <el-table-column label="运动类型" prop="type" />
      <el-table-column
        label="运动描述"
        align="center"
        prop="description"
        max-width="300px"
        :show-overflow-tooltip="true"
      />

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

    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="运动名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-row>
          <el-col :span="6">
            <el-form-item label="训练次数" prop="username" label-width="80px" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="个/秒" label-width="70px" prop="per">
              <el-input v-model="form.per" placeholder="个/秒" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="组" label-width="70px" prop="groupes">
              <el-input v-model="form.groupes" placeholder="组" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="预计时间" prop="time">
          <el-input v-model="form.time" placeholder="分钟" />
        </el-form-item>
        <el-form-item label="特征" prop="effect">
          <el-input v-model="form.effect" type="textarea" />
        </el-form-item>
        <el-form-item label="运动描述" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="视频地址" prop="video">
          <el-input v-model="form.video" placeholder="请输入视频地址" />
        </el-form-item>
        <el-form-item label="推荐人群">
          <el-checkbox-group v-model="form.types">
            <el-checkbox label="未成年人" name="type" />
            <el-checkbox label="青年人" name="type" />
            <el-checkbox label="中年人" name="type" />
            <el-checkbox label="老年人" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="运动类型" prop="type">
          <el-select v-model="form.type" placeholder="运动类型" clearable size="small">
            <el-option
              v-for="(item, index) in sportData"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="toSave('form')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      class="page"
      background
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="sport.total"
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
      sportData: ['有氧运动', '无氧运动', '屈曲和伸展运动'],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      open: false,
      // 非多个禁用
      multiple: true,
      xg: {},
      title: '',
      form: {
        type: []
      },

      params: {
        page: 1,
        pageSize: 5
      },
      rules: {
        name: [{ required: true, message: '请选择', trigger: ['blur'] }],
        groupes: [{ required: true, message: '请选择', trigger: ['blur'] }],
        per: [{ required: true, message: '请选择', trigger: ['blur'] }],
        time: [{ required: true, message: '请选择', trigger: ['blur'] }],
        description: [{ required: true, message: '请选择', trigger: ['blur'] }],
        type: [{ required: true, message: '请选择', trigger: ['change'] }],
        video: [{ required: true, message: '请选择', trigger: ['blur'] }],
        effect: [{ required: true, message: '请选择', trigger: ['blur'] }]
      }
    }
  },
  computed: {
    ...mapState('sports', ['sport'])
  },
  methods: {
    ...mapActions('sports', ['findSport', 'deleteSport', 'saveUpdateSport']),
    //   点击添加按钮
    hanlderfindSport() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findSport(this.params)
    },
    // 分页size-change
    handleSizeChange(pageSizes) {
      // 点击分页容量，将最新的pageSize设置到数据模型中，重新调用
      this.params.pageSize = pageSizes
      this.hanlderfindSport()
    },
    // 分页current-change
    handleCurrentChange(page) {
      this.params.page = page
      this.hanlderfindSport()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.sport_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      if (!this.multiple) {
        this.xg = selection[0]
      }
    },
    toSave(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.form.suit = this.form.types.join(',')

          this.saveUpdateSport(this.form).then(res => {
            this.hanlderfindSport()
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.sport_id || Array.from(this.ids).join(',') // 数据类型得转化不然无法实现批量删除
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(id)
          return this.deleteSport({ sport_id: id })
        })
        .then(() => {
          this.hanlderfindSport()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },

    handleAdd() {
      (this.form = {
        types: [],
        no: []
      }),
        (this.title = '添加运动')
      this.open = true
    },
    handleUpdate(row) {
      this.title = '修改运动'
      if (row.sport_id) {
        this.form = _.clone(row)
      } else {
        this.form = this.xg
      }
      if (this.form.suit == '' || this.form.suit == null) {
        this.$set(this.form, 'types', [])
      } else {
        this.$set(this.form, 'types', this.form.suit.split(','))
      }
      this.open = true
    },
    //
    handleQuery() {
      this.hanlderfindSport()
    }
  },
  created() {
    this.hanlderfindSport()
  }
}
</script>
<style scoped lang="scss">
.drawerOps {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
