<template>
  <div class="marginBTen">
    <el-form :model="formInline" class="demo-form-inline" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名：">
            <span>{{ operailityData.account }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色：">
            <span>{{ operailityData.roleList[0].name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位：">
            <span>{{ operailityData.schoolName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="院校编号：">
            <span>{{ operailityData.schoolCode }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人：">
            <el-input v-model="formInline.name" placeholder="联系人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门：">
            <el-input v-model="formInline.department" placeholder="部门"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话：">
            <el-input v-model="formInline.telephone" placeholder="电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机：">
            <el-input v-model="formInline.mobile" placeholder="手机"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="职务：">
            <el-input v-model="formInline.post" placeholder="职务"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="传真：">
            <el-input v-model="formInline.fax" placeholder="传真"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align: center;margin-top: 20px">
        <el-button class="submitBtn" type="primary" @click="submit">保存</el-button>
        <el-button class="cancelBtn" type="primary" @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
// import baseRules from "../../formRules/base";

let Util = null
export default {
  name: "personalInformation",
  props: ['operailityData'],
  data() {
    return {
      formInline: {
        department: '',
        telephone: '',
        mobile: '',
        name: '',
        account:'',
        post:'',
        fax:'',
      },
    }
  },
  methods: {
    init() {
      this.getArchivesBasicInfo()
    },
    getArchivesBasicInfo() {
      this.ajax({
        ajaxSuccess: (res) => {
          for (let k in this.formInline) {
            this.formInline[k] = res.data[k]
          }
        },
        ajaxParams: {
          url: this.$globlURLPrefix.passport + '/archivesBasicInfo/get/' + this.operailityData.id,
          method: 'get',
        }
      })
    },
    submit() {
      // 添加电话格式验证
      let reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/
      if (this.formInline.telephone && !reg.test(this.formInline.telephone)) {
        this.errorMess(`请填写正确的电话号码`)
        return;
      }
      let myreg = /^1[3456789]\d{9}$/;
      if (this.formInline.mobile && !myreg.test(this.formInline.mobile)) {
        this.errorMess(`请填写正确的手机号`)
        return;
      }
      this.ajax({
        ajaxSuccess: () => {
          this.$emit('setInfo', 'edit', '修改成功')
        },
        ajaxParams: {
          url: this.$globlURLPrefix.passport + '/archivesBasicInfo/modify/' + this.operailityData.id,
          method: 'put',
          jsonString: true,
          data: this.getFormData(this.formInline)
        }
      })
    },
    getFormData(data) {
      let myData = Util._.defaultsDeep({}, data);
      return myData;
    },
    cancel() {
      this.$emit('cancel', 'edit')
    },
  },
  created() {
    Util = this.$util
    this.init()
  },
}
</script>

<style scoped>

</style>
