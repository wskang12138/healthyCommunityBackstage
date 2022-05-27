<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="params" :inline="true" label-width="68px">
      <el-form-item label="食物名称" prop="name">
        <el-input
          v-model="params.name"
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
      </el-col>
    </el-row>
    <div class="level-screening">
      <el-button
        v-for="(item, index) in levelList"
        :key="index"
        size="medium"
        type="primary"
        :class="index == itemType ? 'highlight' : ''"
        @click.prevent="materTay(index, item.code)"
      >
        {{ item.codeValue }}</el-button>
    </div>
    <div class="foods-content">
      <div v-for="(item, index) in food" :key="index" class="foods-box">
        <div class="img">
          <img :src="urlHandle(item.url)" width="200px">
        </div>
        <div class="bottom">
          <div class="name">
            <div>{{ item.name }} 1{{ item.unit }}</div>
            <div>热量:{{ item.calorie }}kcal</div>
          </div>
          <div class="introduce">
            <div>{{ item.description }}</div>
          </div>
          <div class="caozuo">
            <div class="updata" @click="handleUpdate(item)">修改</div>
            <div class="delete" @click="handleDelete(item.food_id)">删除</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="open">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="食物图片" prop="url">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:7001/images/upload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="食物名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-row>
          <el-col :span="6">
            <el-form-item label="热量" prop="username" label-width="80px" />
          </el-col>
          <el-col :span="6">
            <el-form-item label="单位" prop="unit">
              <el-select v-model="form.unit" placeholder="热量单位" clearable size="small">
                <el-option v-for="(item, index) in unit" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="热量" label-width="70px" prop="calorie">
              <el-input v-model="form.calorie" placeholder="热量" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="食疗功能" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="分类" prop="type">
          <el-select v-model="form.type" placeholder="运动类型" clearable size="small">
            <el-option v-for="(item, index) in type" :key="index" :label="item" :value="item" />
          </el-select>
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
export default {
  data() {
    return {
      unit: ['份', '碗', '个', '块', '根', '小团', '杯'],
      type: ['主食', '肉蛋奶', '蔬菜'],
      formLabelWidth: '80px',
      open: false,
      title: '',
      form: {
        types: []
      },
      rules: {
        name: [{ required: true, message: '请选择', trigger: ['blur'] }],
        unit: [{ required: true, message: '请选择', trigger: ['blur'] }],
        calorie: [{ required: true, message: '请选择', trigger: ['blur'] }],
        dietary: [{ required: true, message: '请选择', trigger: ['blur'] }],
        description: [{ required: true, message: '请选择', trigger: ['blur'] }],
        type: [{ required: true, message: '请选择', trigger: ['change'] }]
      },
      url: '',
      params: {},
      imageUrl: '',
      levelList: [
        {
          code: 3,
          codeValue: '全部'
        },
        {
          code: 0,
          codeValue: '主食'
        },
        {
          code: 1,
          codeValue: '肉蛋奶'
        },
        {
          code: 2,
          codeValue: '蔬菜水果'
        }
      ], // 等级筛选数据
      itemType: 0, // 等级筛选选中的标识
      materialCode: '' // 分类的code值
    }
  },
  computed: {
    ...mapState('foods', ['food'])
  },
  methods: {
    ...mapActions('foods', ['findFood', 'deleteFood', 'saveUpdateFood']),
    // 等级筛选互斥效果
    materTay(itemType, code) {
      // 等级筛选选中的标识-高亮效果
      this.itemType = itemType
      // 分类的code值
      this.materialCode = code
      this.handleQuery()
    },
    handleAdd() {
      this.title = '增加食物'
      this.open = true
      this.form = {
        types: [],
        no: []
      }
      this.imageUrl = ''
    },
    urlHandle(url) {
      if (url.includes('http')) {
        return url
      } else {
        return url ? process.env.VUE_APP_BASE_API + `/public/upload/` + url : ''
      }
    },
    handleUpdate(row) {
      this.title = '修改食物'
      this.form = _.clone(row)
      if (this.form.type == 0) {
        this.form.type = '主食'
      } else if (this.form.type == 1) {
        this.form.type = '肉蛋奶'
      } else {
        this.form.type = '蔬菜水果'
      }
      this.imageUrl = this.urlHandle(this.form.url)
      this.open = true
    },
    toSave(from) {
      this.$refs[from].validate(valid => {
        if (valid) {
          if (this.form.type == '主食') {
            this.form.type = 0
          }
          if (this.form.type == '肉蛋奶') {
            this.form.type = 1
          }
          if (this.form.type == '蔬菜水果') {
            this.form.type = 2
          }
          if (this.url == '' && !this.form.url) {
            alert('图片不能为空')
          }
          if (!this.form.url) {
            this.form.url = this.url
          }
          this.saveUpdateFood(this.form).then(res => {
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
      })
        .then(() => {
          return this.deleteFood({ food_id: id })
        })
        .then(() => {
          this.handleQuery()
          this.$message({
            type: 'success',
            message: res.message
          })
        })
        .catch(function() {})
    },
    handleAvatarSuccess(response) {
      try {
        this.imageUrl = process.env.VUE_APP_BASE_API + `/public/upload/` + response.avater
        this.url = response.avater
      } catch (error) {
        console.error(error)
      }
    },
    handleQuery() {
      if (this.materialCode === 0 || this.materialCode === 1 || this.materialCode === 2) {
        this.params.type = this.materialCode
      } else {
        delete this.params.type
      }
      for (const key in this.params) {
        if (this.params[key] == '') {
          delete this.params[key]
        }
      }
      this.findFood(this.params)
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
.level-screening {
  margin-top: 25px;
  padding-left: 40px;
  box-sizing: border-box;
  text-align: left;
  .el-button {
    border-color: #0085f4;
    background-color: #fff;
    color: #0085f4;
  }
  .highlight {
    background-color: #8e66f6 !important;
    color: #fff;
  }
}
.foods-content {
  display: flex;
  flex-wrap: wrap;
  .foods-box {
    width: 220px;
    margin-top: 50px;
    margin-left: 20px;
    box-shadow: 2px 5px 4px 1px rgba(128, 110, 110, 0.5);
    transition: all 0.3s linear;
    &:hover {
      box-shadow: 4px 10px 5px 0px rgba(87, 78, 78, 0.5);
    }
    .img {
      width: 100%;
      overflow: hidden;
      img {
        width: 220px;
        height: 150px;
        transition: all 0.3s linear;
        vertical-align: middle;
        border-style: none;
        &:hover {
          opacity: 0.8;
          -moz-transform: scale(1.35);
          -webkit-transform: scale(1.35);
        }
      }
      &:hover {
        background: rgba(83, 79, 79, 0.8);
      }
    }
    .bottom {
      font-size: 13px;
      color: #636363;
      padding: 10px;
      padding-top: 2px;
      .name {
        display: flex;
        justify-content: space-around;
        height: 20px;
        div {
          position: relative;
          display: inline;
          top: 5px;
        }
      }
      .introduce {
        box-sizing: border-box;
        min-height: 80px;
        word-wrap: break-word;
        margin-top: 15px;
      }
      .caozuo {
        width: 100%;
        display: flex;
        margin-top: 20px;
        position: relative;
        margin-left: 90px;
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
  }
}
</style>
