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
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
      </el-form-item>
      <el-form-item label="当前日期" prop="date">
        {{ date }}
      </el-form-item>
      <el-form-item label="预约人数" prop="date">{{ Electron.total }}</el-form-item>
    </el-form>

    <el-table
      v-loading="$store.state.app.loading"
      :data="Electron.data"
      :row-style="{ height: '90px' }"
    >
      <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="true" />
      <el-table-column label="姓名" align="center" prop="username" :show-overflow-tooltip="true" />
      <el-table-column label="性别" align="center" prop="sex" />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="联系方式" align="center" prop="phone" />
      <el-table-column
        label="身份证"
        align="center"
        prop="identity"
        :show-overflow-tooltip="true"
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
      <el-table-column label="开始时间" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.b_time | fmtDateTime }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="quanxuan == 1"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.a_status == '待处理' ? true : false"
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="handler(scope.row)"
          >去处理</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

import moment from 'moment'
export default {
  data() {
    return {
      dialogFormVisible: false,
      title: '',

      date: moment().format('YYYY-MM-DD'),
      status: ['完成', '待处理', '取消'],
      // 非单个禁用
      value2: '',
      quanxuan: window.localStorage.getItem('roles'),
      formLabelWidth: '180px',
      cno: true,
      params: {
        roles_id: window.localStorage.getItem('roles')
      }
      // 验证规则
    }
  },
  computed: {
    ...mapState('Electrons', ['Electron', 'user', 'doctor'])
  },
  methods: {
    ...mapActions('Electrons', [
      'findElectron',
      ,
      'deleteElectron',
      'findUser',
      'saveOrUpdateElectron',
      'queryDoctor'
    ]),
    //   点击添加按钮
    hanlderqueryElectron() {
      // 过滤查询参数，将空字符串的键值对删除掉
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      if (this.params.roles_id == 1) {
        this.params.doctor = window.localStorage.getItem('user_id')
      }
      this.findElectron(this.params)
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
    handleDoctor(id) {
      for (const key in this.doctor) {
        if (this.doctor[key].user_id == id) {
          return this.doctor[key].rolesName
        }
      }
      return ''
    },
    handler(row) {
      this.$router.push({
        path: '/handlerE/handlerE',
        query: { user_id: row.a_user_id, a_id: row.a_id }
      })
    },
    //
    handleQuery() {
      if (this.value2 !== '') {
        this.value2 = Array.from(this.value2)
        this.params.beginTime = this.value2[0]
        this.params.EndTime = this.value2[1]
      }
      this.hanlderqueryElectron()
    }
  },
  created() {
    this.queryDoctor().then(res => {
      this.hanlderqueryElectron()
    })
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
</style>
