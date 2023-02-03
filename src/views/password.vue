<!--
****--修改密码(password)
****--@date     2017/7/7
****--@author   zyc<332533011@qq.com
-->
<template>
  <div style="margin: 0 20px;" ref='pssword'>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="ruleForm2.oldPassword" placeholder="输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="newPassword">
        <el-input type="password" v-model="ruleForm2.newPassword" auto-complete="off" placeholder="输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <load-btn @listenSubEvent="editPwd" :btnData="loadBtn"></load-btn>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>


  let Util = null;
  export default {
    data() {
      /*var checkOldPass = (rule, value, callback) => {
        let oldPass = this.$cookie.get('passWord')
        if (value !== oldPass) {
          return callback(new Error('旧密码不正确!'));
        } else {
          callback();
        }
      };*/
      var validatePass = (rule, value, callback) => {
        let rules = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,20}$/
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          console.log("rule", rules.test(this.ruleForm2.newPassword));
          if(!rules.test(this.ruleForm2.newPassword)) {
            callback(new Error('需要长度为8-20位包含数字、字母及特殊字符的组合!'))
            return
          }
          if (this.ruleForm2.checkPass !== '' ) {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },

        //form bind的数据
        ruleForm2: {
          oldPassword: '',
          newPassword: '',
          checkPass: '',
        },

        //form 验证规则
        rules2: {
          newPassword: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          },],
          /*oldPassword: [{
            required: true,
            validator: checkOldPass,
            trigger: 'blur'
          }]*/
        },

        //修改密码后台提交参数设置
        editMessTitle: {
          type: 'password',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url:this.$globlURLPrefix.passport + '/account/modify-password',
            method: 'put',
            data: {}
          }
        },
      };
    },
    created() {
      Util = this.$util;
    },
    methods: {

      /**
       * 提交密码
       * @param isLoadingFun {function}  提交中的回调用于删除提交按钮loading状态
       */
      editPwd(isLoadingFun) {
        let isSubmit = this.submitForm("ruleForm2");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          let data = this.ruleForm2;
          /*data.oldPassword = Util.encrypt(data.oldPassword)
          data.newPassword = Util.encrypt(data.newPassword);
          data.checkPass = Util.encrypt(data.checkPass);*/
         /* data.oldPassword =data.oldPassword;
          data.newPassword = data.newPassword;
          data.checkPass = data.checkPass;*/
          this.editMessTitle.ajaxParams.data = this.getFormData(data);

          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },





      //重置密码
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
    },
   mounted () {
      let that = this;
      this.$nextTick(() => { // 点击通知列表 继续保持让头部的 z-index 大于内容区域 保证弹框显示
        Util.events.addHandler(this.$refs.pssword, "click", function (e) { // 点击时让top 的z-index 大于内容区域的
          e.stopPropagation();
        });
        Util.events.addHandler(document, "click", function (e) {
          // that.$emit("setZindex", true);
        });
      })
    },
  }

</script>
