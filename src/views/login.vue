<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="loginMain" v-loading.fullscreen.lock="isLogin">
    <div class="loginBoxAll">
      <div class="leftLogo">
        <img src="/static/image/KwLogo.png" alt="">
        <span v-if="evnData.systemType === 'college'"
          style="font-size: 30px;color: #fff;margin-left: 15px">人机对话考试系统</span>
        <span v-else style="font-size: 30px;color: #fff;margin-left: 15px">中医学类专业（本科）水平测试考务管理系统</span>
      </div>
      <el-row style="height:100%;width: 100%;z-index: 50">
        <el-col :span="24" align="center" style="position:relative;height:100%">
          <div class="login-form">
            <div style="font-size: 19px;color: #313131;margin-top: 22px;margin-bottom: 20px">登录 / LOGIN</div>
            <div style="width: 410px;position: relative;">
              <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="0"
                class="demo-ruleForm noinputleft">
                <el-form-item prop="username" style="margin-bottom: 0">
                  <el-input v-model="ruleForm.username" clearable size="large" placeholder="请输入用户名">
                    <template #suffix>
                      <el-icon class="el-input__icon">
                        <Avatar />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item style="margin: 30px 0" prop="password">
                  <el-input v-model="ruleForm.password" type="password" clearable size="large" placeholder="请输入密码"
                    show-password>
                    <template #suffix>
                      <el-icon class="el-input__icon">
                        <Lock />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
                <div class="signin">
                  <el-button class="btn_" type="primary" @click="submitForm(ruleFormRef)">登录
                  </el-button>
                </div>
                <div></div>

                <div @click="retrievethepassword" style="text-align: right; margin: 10px 00;">忘记密码了？<span
                    style="color: #008cf8;cursor: pointer">找回密码</span></div>
                <div class="puzzle-box" style="">
                  <Vcode :imgs="imgs" :show="isVerificationModel" @success="handleSuccess" @close="onClose" />
                </div>
            </div>
          </div>
          <div id="copy">
            <p>Copyright © www.tcmtest.org.cn.All Rights Reserved.</p>
            <p>国家中医药管理局中医师资格认证中心 国家中医药管理局职业技能鉴定指导中心</p>
            <p>京ICP备08101629号-1 京公网安备110402450006号</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <Modal close-on-click-modal="false"
           height="200"
           cancel-text=""
           v-model="reportModal"
           class-name="vertical-center-modal"
           :width="500">
           <!-- <slot name="header" :content="{title:'fghfgh'}"></slot> -->
           <template #header>
            <modal-header
                    :content="{title:'找回密码'}"></modal-header>
            </template>
        
      <div>
        <p class="remove"
           align="center">请联系系统管理员重置密码！</p>
      </div>
        <template #footer>
          <!-- <div></div> -->
        </template>
    </Modal>
</template>

<script setup>
// import {
//   Modal
// } from 'view-ui-plus'
import Vcode from "vue3-puzzle-vcode";
// import { getEnvs } from '@/api/envs.js'
// import { login } from '@/api/login.js'
// import { setCookie } from '@/utils/util'
import { ref } from 'vue'
import { useStore } from 'vuex'
// import { getMenuTree } from '../api/common.js'
import img1 from '@/assets/verificationImage/1j.jpg'
import img3 from '@/assets/verificationImage/3j.jpeg'
import img4 from '@/assets/verificationImage/4j.png'
import img5 from '@/assets/verificationImage/5j.png'
import img6 from '@/assets/verificationImage/6j.png'
import img7 from '@/assets/verificationImage/7j.jpg'
import img8 from '@/assets/verificationImage/8j.png'
import img9 from '@/assets/verificationImage/9j.png'
const imgs = [img1, img3, img4, img5, img6, img7, img8, img9];
const ruleFormRef = ref({})
const evnData = ref({
  hospitalName: '',
  version: '',
  chinaName: '',
  copyright: '',
  pwdTerminalEncrypt: '',
  systemType: '',
  haveReCode: false
})
const reportModal = ref(false)
const isLogin = ref(false)
const isVerificationModel = ref(false)
const ruleForm = ref({
  username: '',
  password: '',
  reCode: '',
  key: '',
})
const rules = ref({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }],
  reCode: [{
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  }]
})


const store = useStore()

// store.dispatch('envsAction')

const {
  hospitalName,
  version,
  chinaName,
  copyright,
  sysSecurityConfig,
  businessInfoConfig
} = store.state.envs
  evnData.value.hospitalName = hospitalName || '';
  evnData.value.version = version || '';
  evnData.value.chinaName = chinaName || '';
  evnData.value.copyright = copyright || '';
  evnData.value.pwdTerminalEncrypt = sysSecurityConfig && sysSecurityConfig.pwdTerminalEncrypt
  evnData.value.systemType = businessInfoConfig && businessInfoConfig.systemType || ''
  evnData.value.haveReCode = businessInfoConfig?.haveReCode === "Y"

const onClose = () => {
  isVerificationModel.value = false;
};


function openVerificationModel() {
  isVerificationModel.value = true
}

function submitForm(formEl) {
  formEl?.validate((valid) => {
    if (valid) {
      openVerificationModel()
    } else {
      console.log('error submit!')
      return false
    }
  })
}
async function handleSuccess() {
    onClose(); // 验证成功，需要手动关闭模态框
  // const loginRes = await login(ruleForm.value)
  store.dispatch('loginActions',ruleForm.value)
  // console.log('loginRes', loginRes)
    // .then(res =>{
    //   console.log('res', res)

    // })
    // let userName = Util._.trim(this.ruleForm.username);
    // let that = this;
    // let myPromise = Util.queryData({
    //   url: this.$globlURLPrefix.passport + '/manage/login',
    //   method: 'post',
    //   data: {
    //     username: userName,
    //     // password: Util.encrypt(this.ruleForm.password),// 密码加密
    //     password: this.pwdTerminalEncrypt ? Util.encrypt(this.ruleForm.password) : this.ruleForm.password,
    //     reCode: this.ruleForm.reCode,
    //     key: this.ruleForm.key
    //   }
    // })();
    // myPromise
    // .then(function (res) {
    //   let responseData = res.data;
    //   console.log('responseData', responseData)
    //   //   that.isVerificationModel = false
    //   //   that.errorMess(responseData['status']['msg']);
    //   // }
    //   // if (Util._.isObject(responseData['status']) && responseData['status']['code'] == 2) {
    //   //   // that.failuretimes = parseInt(responseData.data)
    //   //   // localStorage.setItem('failuretimes', JSON.stringify(that.failuretimes));
    //   // }
    // }).catch(function (response) {
    //   if (response instanceof Error) {
    //     // that.errorMess(response.message);
    //   } else {
    //     // that.errorMess(response.status + '错误!');
    //   }
    //   isLogin.value = false;
    // });
}
function retrievethepassword() {
    reportModal.value = true
  }
</script>

<style lang="scss">
.loginMain {
  width: 100%;
  height: 100%;
  // position: relative;

  .loginBoxAll {
    background-image: url(/static/image/loginbg.jpg);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    position: relative;

    .leftLogo {
      position: absolute;
      left: 40px;
      top: 40px
    }
  }
}

.loginBox {
  height: 410px;
  width: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -177px 0 0 -155px;
}

.loginBox h2 {
  text-align: center;
}

.loginLeft {
  background-image: url('/static/image/logoBG.jpg');
  background-position: center center;
  background-repeat: repeat-x;
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover
}

.loginLeft .login {
  background-image: url('/static/image/transparentBG.png');
  background-position: center center;
  background-repeat: no-repeat;
  width: 430px;
  height: 524px;
  margin: -262px 0 0 -215px;
  position: absolute;
  top: 50%;
  left: 50%;
}

.loginLeft .login .logo-text {
  color: #fff;
  text-align: center;
}

.loginLeft .logo-ambuf {
  position: relative;
  top: -23px;
}

.loginLeft .login .logo-button {
  display: inline-block;
  height: 51px;
  width: 100%;
  font-size: 15px;
  margin-top: 10px;
}

.h-full {
  height: 100% !important;
  background-image: url(/static/image/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  position: relative
}

.loginMain .loginbg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%
}

.loginMain .loginbg .firstchild {
  font-family: PingFang-SC-Heavy;
  font-size: 36px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #ffffff;
}

.loginMain .loginbg .lastchild {
  margin-top: 26px;
  font-family: PingFang-SC-Regular;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #ffffff;
}

.loginMain .username {
  position: relative;
  margin-bottom: 0;
}

.loginMain .username span {
  position: absolute;
  top: 4px;
  right: 12px;
  z-index: 1;
  color: rgb(205, 212, 217);
}

.loginMain .username input {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  padding-left: 17px;
  outline: 0;
  /*border: 1px solid #e2e5e8;*/
  color: #434343;
  background-color: #fff !important;
}

.loginMain .username .el-input__inner {
  /*border: none;*/
  background-color: #fff !important;
}

.loginMain .username .blueborder {
  border: 1px solid #008cf8 !important;
  border-radius: 3px !important;
}

/*cccborder*/
.loginMain .username .cccborder {
  border: 1px solid #e2e5e8;
  border-radius: 3px !important;
  float: left;
  margin-right: 5px
}

.loginMain .username input {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  padding-left: 17px;
  outline: 0;
  border: 1px solid #e2e5e8;
  color: #434343;
}

.loginMain .password {
  position: relative;
  /*margin-top: 30px*/
}

.loginMain .recode .el-input {
  width: 245px !important;
  float: left;
  margin-right: 10px
}

.loginMain .recode input {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  padding-left: 17px;
  outline: 0;
  border: 1px solid #e2e5e8;
  color: #434343;
}

.loginMain .password span {
  position: absolute;
  top: 4px;
  right: 12px;
  z-index: 1;
  color: rgb(205, 212, 217);
}

.loginMain .password input {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  padding-left: 17px;
  outline: 0;
  border: 1px solid #e2e5e8;
  color: #434343;
}

.loginMain .password .blueborder {
  border: 1px solid #008cf8;
  border-radius: 20px !important;
}

.loginMain .password .cccborder {
  border: 1px solid #e2e5e8;
  border-radius: 20px !important;
}

.loginMain .recode .blueborder {
  border: 1px solid #008cf8;
  border-radius: 20px !important;
}

.loginMain .signin {
  position: relative;
  cursor: pointer
}

.loginMain .signin .btn_ {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  background-color: #00a0e9;
  color: #fff;
  font-size: 14px;
  outline: 0;
  border: 1px solid #00a0e9;
  // right: 0;
}


.loginMain .noinputleft .el-form-item__content {
  margin-left: 0 !important;
}

.loginMain .username input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #434343;
}

.login-form {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 470px;
  height: 300px;
  background-color: #fff;

  .el-form-item {
    margin-bottom: 28px !important;
  }
}

.login-logo {
  position: relative;
  width: 470px;
  height: 300px;
}

.loginMain .password input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #434343;
}

#copy {
  position: absolute;
  bottom: 40px;
  width: 100%
}

#copy p {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0;
  color: #fff;
  opacity: 0.3 !important;
}

.logo-text {
  text-align: center;
  position: relative;
  /*left: 50%;*/
  /*-webkit-transform: translate(-41%, -64%);*/
  /*transform: translate(-41%, -64%);*/
  font-size: 16px;
  letter-spacing: 2px;
  white-space: nowrap;
}

.puzzle-box {
  position: absolute;
  top: -45px;
  box-shadow: 7px 9px 20px 1px #635858;
  -moz-box-shadow: 7px 9px 20px 1px #635858;
  -webkit-box-shadow: 7px 9px 20px 1px #635858;
  left: 24px;
}
</style>
