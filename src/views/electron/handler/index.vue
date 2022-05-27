<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
    <el-button
      class="pull-right right-10"
      icon="el-icon-download"
      type="primary"
      size="mini"
      @click="downloadFile"
    >下载</el-button>
    <el-button type="primary" size="mini" @click="comeBack">返回</el-button>
    <div ref="box" class="content">
      <el-form ref="queryForm" :model="forms" :inline="true" label-width="68px">
        <div class="resident">
          <el-descriptions v-if="users.data" title="基本信息" :column="4" border>
            <el-descriptions-item label="用户名">{{ users.data.username }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ users.data.age }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ users.data.sex }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ users.data.phone }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ users.data.address }}</el-descriptions-item>
            <el-descriptions-item label="电子邮件">{{ users.data.sendEmail }}</el-descriptions-item>
            <el-descriptions-item label="出生日期">{{
              users.data.borth | fmtDateTime
            }}</el-descriptions-item>
            <el-descriptions-item label="qq号">{{ users.data.qq }}</el-descriptions-item>
            <el-descriptions-item label="文化水平">{{ users.data.level }}</el-descriptions-item>
            <el-descriptions-item label="是否已婚">
              <el-tag size="small">{{ users.data.marriage }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="政治面貌">{{ users.data.political }}</el-descriptions-item>
            <el-descriptions-item label="门牌号">{{ users.data.number }}</el-descriptions-item>
            <el-descriptions-item label="身份证号">{{ users.data.identity }}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions v-if="users.heathy" :column="4" border>
            <el-descriptions-item label="身高(cm)">{{ users.heathy.height }}</el-descriptions-item>
            <el-descriptions-item label="体重(kg)">{{ users.heathy.weight }}</el-descriptions-item>
            <el-descriptions-item label="舒张压(mmHg)">{{
              users.heathy.blodpres_relax
            }}</el-descriptions-item>
            <el-descriptions-item label="收缩压(mmHg)">{{
              users.heathy.blodpres_shrink
            }}</el-descriptions-item>
            <el-descriptions-item label="温度(C)">{{
              users.heathy.temperature
            }}</el-descriptions-item>
            <el-descriptions-item label="血氧(%)">{{ users.heathy.oxygen }}</el-descriptions-item>
            <el-descriptions-item label="血型">
              <el-tag size="small">{{ users.heathy.blood }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="BMI">{{ users.heathy.BMI }}</el-descriptions-item>
            <el-descriptions-item label="健康状态">{{ users.heathy.status }}</el-descriptions-item>
            <el-descriptions-item label="记录时间">{{
              users.heathy.time | fmtDateTime
            }}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions v-if="users.life" :column="4" border>
            <el-descriptions-item label="体育锻炼">{{ users.life.physical }}</el-descriptions-item>
            <el-descriptions-item label="锻炼时间">{{ users.life.exercise }}</el-descriptions-item>
            <el-descriptions-item label="饮食喜好">{{ users.life.dietary }}</el-descriptions-item>
            <el-descriptions-item label="睡眠情况">{{ users.life.sleep }}</el-descriptions-item>
            <el-descriptions-item label="吸烟情况">{{ users.life.smoking }}</el-descriptions-item>
            <el-descriptions-item label="饮酒情况">{{ users.life.drinking }}</el-descriptions-item>
            <el-descriptions-item label="记录时间">{{
              users.life.time | fmtDateTime
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="table">
          <h4>历史疾病</h4>
          <el-table v-if="users.diease" v-loading="$store.state.app.loading" :data="users.diease">
            <el-table-column
              label="序号"
              align="center"
              type="index"
              fixed
              width="150"
              :show-overflow-tooltip="true"
            />

            <el-table-column label="疾病名称" align="center" prop="diease_name" width="150" />
            <el-table-column label="是否治愈" align="center" prop="flage" width="150" />
            <el-table-column label="过敏物质" align="center" prop="allergen" width="150" />
            <el-table-column label="有无残疾" align="center" prop="disabled_orno" width="150" />
            <el-table-column label="残疾证号" align="center" prop="disabled_con" width="150" />
            <el-table-column label="确诊时间" align="center" width="150">
              <template slot-scope="scope">
                {{ scope.row.q_time | fmtDateTime }}
              </template>
            </el-table-column>
            <el-table-column label="治愈时间" align="center" width="150">
              <template slot-scope="scope">
                {{ scope.row.z_time | fmtDateTime }}
              </template>
            </el-table-column>
          </el-table>
          <h4>家族病史</h4>
          <el-table
            v-if="users.familyDiease"
            v-loading="$store.state.app.loading"
            :data="users.familyDiease"
          >
            <el-table-column
              label="序号"
              align="center"
              type="index"
              :show-overflow-tooltip="true"
            />

            <el-table-column label="疾病名称" align="center" prop="diease_name" />

            <el-table-column label="辈分" align="center" prop="beifen" />
          </el-table>
          <h4>用药记录</h4>
          <el-table
            v-if="users.electron"
            v-loading="$store.state.app.loading"
            :data="users.electron"
          >
            <el-table-column
              label="序号"
              align="center"
              type="index"
              :show-overflow-tooltip="true"
            />

            <el-table-column label="疾病名称" align="center" prop="diease_name" />
            <el-table-column label="病情描述" align="center" prop="description" />
            <el-table-column label="用药" align="center" prop="content_count" />
            <el-table-column label="补充说明" align="center" prop="suggestion" />
            <el-table-column label="建议运动" align="center" prop="sport" width="150" />
            <el-table-column label="建议膳食" align="center" prop="food" width="150" />
            <el-table-column label="记录时间" align="center" width="150">
              <template slot-scope="scope">
                {{ scope.row.count_time | fmtDateTime(scope.count_time) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-descriptions v-if="users.data" title="基本信息" :column="4" style="margin-bottom: 10px">
          <el-descriptions-item label="用户名">{{ users.data.username }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ users.data.age }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ users.data.sex }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ users.data.phone }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ users.data.identity }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions v-if="users.heathy" :column="4" style="margin-bottom: 10px">
          <el-descriptions-item label="血型">
            <el-tag size="small">{{ users.heathy.blood }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="BMI">{{ users.heathy.BMI }}</el-descriptions-item>
          <el-descriptions-item label="健康状态">{{ users.heathy.status }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ users.data.identity }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions v-if="users.life" :column="4" style="margin-bottom: 20px">
          <el-descriptions-item label="体育锻炼">{{ users.life.physical }}</el-descriptions-item>
          <el-descriptions-item label="锻炼时间">{{ users.life.exercise }}</el-descriptions-item>
          <el-descriptions-item label="饮食喜好">{{ users.life.dietary }}</el-descriptions-item>
          <el-descriptions-item label="睡眠情况">{{ users.life.sleep }}</el-descriptions-item>
          <el-descriptions-item label="吸烟情况">{{ users.life.smoking }}</el-descriptions-item>
          <el-descriptions-item label="饮酒情况">{{ users.life.drinking }}</el-descriptions-item>
          <el-descriptions-item label="记录时间">{{
            users.life.time | fmtDateTime
          }}</el-descriptions-item>
        </el-descriptions>
        <el-form-item label="疾病名称" :label-width="formLabelWidth" prop="diease_name">
          <el-input v-model="form.diease_name" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="过敏物质" :label-width="formLabelWidth" prop="allergen">
          <el-input v-model="form.allergen" placeholder="请输入" maxlength="11" />
        </el-form-item>
        <el-form-item key="cno" label="有无残疾" :label-width="formLabelWidth" prop="cno">
          <el-switch
            v-model="cno"
            active-text="有"
            inactive-text="无"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item v-if="cno" label="残疾编号" :label-width="formLabelWidth" prop="disabled_con">
          <el-input v-model="form.disabled_con" placeholder="请输入残疾编号" />
        </el-form-item>

        <el-form-item label="病情描述" :label-width="formLabelWidth" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10 }"
            placeholder="输入病情描述"
          />
        </el-form-item>

        <template>
          <div class="medicine" style="margin: 30px">
            <p style="text-align: center; margin: 50px 0 20px">用药选择</p>
            <div style="text-align: center">
              <el-transfer
                v-model="rightArr"
                style="text-align: left; display: inline-block"
                filterable
                :filter-method="filterMethod"
                :left-default-checked="[2, 3]"
                :right-default-checked="[1]"
                :titles="['药库', '用药']"
                :button-texts="['移除', '用药']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                :data="mdata"
                @change="handleChange"
              >
                <span
                  slot-scope="{ option }"
                  :title="option.label"
                >{{ option.key }} - {{ option.scale }}</span>
                <el-button slot="right-footer" class="transfer-footer" size="small">操作</el-button>
              </el-transfer>
            </div>
          </div>
        </template>

        <el-form-item label="用药" :label-width="formLabelWidth" prop="content_count">
          <el-input
            v-model="form.content_count"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10 }"
            placeholder="输入用药"
          />
        </el-form-item>
        <el-form-item label="补充说明" :label-width="formLabelWidth" prop="suggestion">
          <el-input
            v-model="form.suggestion"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10 }"
            placeholder="补充说明"
          />
        </el-form-item>
        <el-form-item label="建议运动" :label-width="formLabelWidth" prop="sport">
          <el-select v-model="form.sport" placeholder="运动类型" clearable size="small">
            <el-option
              v-for="(item, index) in sportData"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="膳食建议" :label-width="formLabelWidth" prop="food">
          <el-select v-model="form.food" multiple placeholder="膳食建议" clearable size="small">
            <el-option v-for="(item, index) in type" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="确诊时间" :label-width="formLabelWidth" prop="q_time">
          <el-date-picker
            v-model="form.q_time"
            type="datetime"
            format="yyyy-MM-dd hh:mm"
            value-format="yyyy-MM-dd hh:mm"
            placeholder="选择日期时间"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toSave('form')">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'
import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      open: false,
      form: {},
      forms: {},
      sportData: ['有氧运动', '无氧运动', '屈曲和伸展运动', '需静养'],
      type: ['多吃肉蛋奶', '多吃蔬菜水果'],
      title: '',
      formLabelWidth: '180px',
      cno: false,
      rules: {
        diease_name: [{ required: true, message: '请输入疾病名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入疾病名称', trigger: 'blur' }],
        disabled_con: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        q_time: [{ required: true, message: '请输入确诊时间', trigger: 'blur' }],
        sport: [{ required: true, message: '请输入运动推荐', trigger: 'change' }],
        content_count: [{ required: true, message: '请输入用药记录', trigger: 'blur' }]
      },
      mdata: [],
      value: [],
      rightArr: [],
      ids: [],
      filterMethod(query, item) {
        return item.key.indexOf(query) > -1 || item.label.indexOf(query) > -1
      },
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.scale}
          </span>
        )
      }
    }
  },
  computed: {
    ...mapState('Electrons', ['users'])
  },
  methods: {
    ...mapActions('Electrons', ['findPeple', 'saveOrUpdateElectron']),
    comeBack() {
      this.$router.go(-1)
    },
    //   点击添加按钮.dialogFormVisible = true;
    downloadFile() {
      const content1 = this.$refs.box
      html2canvas(content1, {
        useCORS: true
      }).then(canvas => {
        // 处理你生成的canvas
        const a = document.createElement('a')
        a.setAttribute('href', canvas.toDataURL()) // toDataUrl：将canvas画布信息转化为base64格式图片
        a.setAttribute('download', `${this.users.data.username}电子病历`) // 这个是必须的，否则会报错
        a.setAttribute('target', '_self')
        a.click()
      })
    },
    //   点击模态框确定按钮
    toSave(proFrom) {
      this.$refs[proFrom].validate(valid => {
        if (valid) {
          this.form.b_user_id = this.form.jw_user_id = this.form.x_user_id = this.users.data.user_id
          this.cno ? (this.form.disabled_orno = '有') : (this.form.disabled_orno = '无')
          this.form.flage = '否'
          this.form.a_id = this.$route.query.a_id
          this.form.a_status = '完成'
          this.form.food = this.form.food.join(',')
          if (this.ids.length > 0) {
            this.form.ids = this.ids.join(',')
          }
          this.saveOrUpdateElectron(this.form).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            if (this.$route.query.user_id) {
              window.location.reload()
            }
            this.open = false
            // 提示成功操作信息
          })
        } else {
          alert('error submit!!')
          return false
        }
      })
    },
    handleAdd() {
      this.open = true
      this.form = {}
      ;(this.rightArr = []), (this.title = '增加病历')
    },
    generateData() {
      if (this.users.medicine) {
        const medicine = this.users.medicine
        for (let i = 0; i < medicine.length; i++) {
          this.mdata.push({
            key: medicine[i].medicine_name,
            scale: medicine[i].scale,
            label: medicine[i].effects,
            consumption: medicine[i].consumption,
            num: medicine[i].num,
            id: medicine[i].id,
            disabled: medicine[i].num === 0
          })
        }
      }
    },
    handleChange() {
      const arr = Array.from(this.rightArr)
      const temp = []
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < this.mdata.length; j++) {
          if (arr[i] == this.mdata[j].key) {
            temp.push(this.mdata[j])
          }
        }
      }
      let name = ''
      let consumption = ''
      for (let i = 0; i < temp.length; i++) {
        name += temp[i].key + ','
        consumption += temp[i].key + ':' + temp[i].consumption + ' '
        this.ids.push(temp[i].id)
      }
      this.form.content_count = name
      this.form.suggestion = consumption
    }
  },

  created() {
    if (this.$route.query.user_id) {
      this.findPeple({ user_id: this.$route.query.user_id }).then(() => {
        this.generateData()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  width: 100%;
  border: 1px solid #dcdfe6;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  .table {
    margin-top: 20px;
  }
  .medicine {
    margin: 20px;
  }

  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
}
</style>
<style lang="scss">
.el-transfer-panel {
  min-width: 413px !important;
  height: 500px !important;
}
.el-transfer-panel__list.is-filterable {
  height: 356px !important;
}
</style>
