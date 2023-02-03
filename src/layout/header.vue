<template>
  <div class="topbar-wrap topbar-clearfix" style="position: relative" @click="hiddenframe">
    <!--导航条左侧-->
    <div class="topbar-left">
      <div class="topbar-yylogo-imgBox">
        <img src="/static/image/headerLogo.png" alt="" style="width: 45px">
        <div class="hesderTitle" v-if="systemType === 'college'">
          <span v-if="userType == 'STU'">中医学类专业（专科）<br>水平测试考生应用系统</span>
          <span v-else>中医学类专业（专科）<br>水平测试考务管理系统</span>
        </div>
        <div class="hesderTitle" v-else>
          <span v-if="userType == 'STU'">中医学类专业（本科）<br>水平测试考生应用系统</span>
          <span v-else>中医学类专业（本科）<br>水平测试考务管理系统</span>
        </div>
      </div>
    </div>
    <!--导航条中间-->
    <div class="topbar-middle">
      <div class="topbar-in">
        <el-button :class="{opcyAc:!item.showtype,colorb:item.showtype}" @click.stop="studentchoose(item)"
                   class="headerBtn" v-for="(item,index) in selectstudentdata" :key="index">
          <span class="iconfont" :class="[item.icon?item.icon:'icon-morenyiji',item.showtype?'fontColor':'']"
                style="margin-right:3px;font-size: 24px"></span>
          <span>{{ item.name }}</span>
        </el-button>
      </div>
    </div>
    <!--导航条右侧-->
    <div class="topbar-info topbar-clearfix topbar-right">
      <!-- 通知公告图标   只有院校端显示通知公告信息-->
      <div v-if="userInfo.userType === 'SCHOOL'" class="tongzhi" @click="notifyDataChange">
        <el-badge :value="notifyShowData.length">
          <i class="iconfont icon-tongzhi"></i>
        </el-badge>
        <div v-if="notifyDataShow" class="notifyDataBox">
          <div v-for="item in notifyData" class="notifyData" @click="showNotify(item)" :key="item.id">
            <span v-if="item.receiveStatus == 'N'"
                  style="width: 7px;height: 7px;background-color: red;border-radius: 50%;display: inline-block"> </span>
            关于{{ item.title }}的通知内容 {{ item.createTime | formatDate('MM-dd HH:mm') }}
          </div>
        </div>
      </div>
      <!--修改密码，个人档案-->
      <div class='userInFo'>
        <div class="topbarname" @mouseenter="clicktopbarnameshow" v-if="userInfo.headPhoto">
          <img :src="imgSrc" alt="" style="width: 100%;margin-top: -5px;">
        </div>
        <div class="topbarname" @mouseenter="clicktopbarnameshow" v-else>{{ userInfo.name | aim }}</div>
        <!-- 考官和学生登录时不需要右上角基本资料信息 个人资料弹出框 考官和考生设置一样的高度-->
        <div class="topbarnameframe boxshadow"
             :class="userInfos.userType == 'STU' || userInfos.userType == 'EXAMINER' ? 'sixHeight' : ''"
             ref='showTopIndex'
             v-if="topbarnameshow">
          <div v-if="userInfos.userType == 'STU'" class="personalmessage">{{ userInfos.account }}</div>
          <div v-if="userInfos.userType != 'STU'" class="personalmessage">{{ userInfos.roleList[0].name }}:</div>
          <div v-if="userInfos.userType != 'STU'" class="personalmessage">{{ userInfos.name }}</div>
          <!-- 考官和学生登录时不需要右上角基本资料信息 -->
          <div v-if="userInfos.userType != 'STU' && userInfos.userType != 'EXAMINER'" class="personalmessage olyColor"
               @click="eidtArchives">基本资料
          </div>
          <div class="personalmessage olyColor"
               @click="eidtPass">修改密码
          </div>
          <div class="personalmessage onltHeigth"
               @click="loginOut">
            <el-button style="width: 132px;padding: 3px 0 " class="submitBtn" type="primary">退出登录</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--修改密码-->
    <Modal :mask-closable="false"
           v-model="passwordModal"
           height="200"
           class-name="vertical-center-modal"
           :width="460">
      <modal-header slot="header" :content="passwordId"></modal-header>
      <pwd v-if="passwordModal" @cancel="cancel" @password="subCallback" :operaility-data="operailityData"></pwd>
      <div slot="footer"></div>
    </Modal>
    <!--修改档案-->
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      class-name="vertical-center-modal"
      :width="700">
      <modal-header slot="header" :content="editId"></modal-header>
      <personal-information v-if="editModal" :operailityData="operailityData" @cancel="cancel"
                            @setInfo="subCallback"></personal-information>
      <div slot="footer"></div>
    </Modal>
    <!--vpn工具下载-->
    <Modal
      :mask-closable="false"
      v-model="vpnModal"
      height="200"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="vpnId"></modal-header>
      <div style="text-align: center;font-size: 16px">
        <p>当前考程控制菜单无法访问，请登录VPN后继续访问</p>
        <p style="color: red;margin: 20px 0">VPN连接成功后，在访问系统过程中请不要断开VPN连接</p>
        <a href="/static/vpn/GWSetup.exe" download="GWSetup.exe">
          <el-button class="blueBtn">VPN连接工具下载</el-button>
        </a>
      </div>
      <div slot="footer"></div>
    </Modal>

    <!-- 通知公告 -->
    <Modal :mask-closable="false"
           v-model="noticeModal"
           height="auto"
           class-name="vertical-center-modal"
           :width="810">
      <modal-header slot="header" :content="ationID"></modal-header>
      <!--和认证中心端查看相同格式-->
      <show-notice v-if="noticeModal" :row-data="announcement"></show-notice>
      <div v-if="announcement.receiveStatus == 'N'" style="text-align: center">
        <el-button style="width: 132px;padding: 3px 0 " class="submitBtn" @click="acknowledgeReceipt">确认收到</el-button>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
let Util = null;
// 修改密码弹窗
import pwd from '@/views/password.vue';
import personalInformation from './personalInformation'
import showNotice from '../examinationManagement/notice/showNotice' // 通知公告内容

export default {
  props: ['selectionroles', 'noticeshows', 'topbarnameshows', 'headerDatas', 'copyrightshows'],
  data() {
    return {
      systemType: '', // 系统配置 专科/本科
      notifyData: [],//每一条
      notifyShowData: [], // 未确认收到的  通知公告数据
      announcement: {}, //第一条数据
      timer: '', // v7
      expendLogin: false,
      userInfoname: false,
      selectionrole: false,
      noticeshow: false,
      topbarnameshow: false,
      showLogin: false,
      copyrightshow: false,
      operailityData: {},
      headerData: this.headerDatas,
      isViewSubNav: true,
      passwordModal: false, // 修改密码弹窗
      noticeModal: false, // 通知公告
      editModal: false,
      userType: '', // 普通人员
      auditType: 'basic',
      isreadshowL: true, // 通知公告是否已读
      userId: '',
      imgSrc: '',
      shows: true,
      showtype: true,
      notifyDataShow: false,
      vpnModal: false,
      vpnId: {id: 'vpnId', title: 'VPN下载'},
      allroledata: {},
      firstheaderroler: [],
      defaultPath: '/manage/workbench/',
      tkMangementPath: '/manage/workbench/theoryAssess', // 理论考核
      passwordId: {
        id: 'password',
        title: '修改密码'
      },
      ationID: {
        id: 'ation',
        title: '通知公告'
      },
      editId: {
        id: 'editId',
        title: '修改用户信息'
      },
      button: {
        showId: {
          id: "showId",
          title: "查看"
        },
      },
      clickNum: 0,  // v7
      loginrole: '',
      userInfos: "",
      fullscreen: false, // 控制是否全屏显示
      queryQption: {},
      // 根据头部不同生源，获取不同左侧菜单
      querytree: {
        ajaxSuccess: 'querytreeSuccess',
        ajaxParams: {
          url: this.$globlURLPrefix.passport + '/menu/query-tree-by-user',
          method: 'get',
          params: {
            menuId: '',
          }
        }
      },
      // 获取头部所选生源
      queryMenu: {
        ajaxSuccess: 'queryMenuSuccess',
        ajaxParams: {
          url: this.$globlURLPrefix.passport + '/menu/queryMenu',
          method: 'get',
          params: {
            userId: '',
          }
        }
      },
      // 选择完后向后台提交所选生源
      addCommon: {
        ajaxSuccess: 'addCommonSuccess',
        ajaxParams: {
          url: this.$globlURLPrefix.passport + '/menu/addCommon',
          method: 'post',
          data: {
            menuIds: '',
            menuNames: '',
            userId: '',
          }
        }
      },
      selectstudentdata: [],
      alternativesourcedata: [],
      vpnHrefs: '', // vpn下载地址
      VPNConnection: false,

    }
  },
  created() {
    Util = this.$util;
    this.systemType = this.getSystemType() // undergraduate 专科  college  专科
    let infos = this.$store.getters.getUserInfo;
    this.userInfos = infos;
    console.log(this.userInfos, "this.userInfos");
    if (infos.roleList !== null) {
      this.loginrole = infos.roleList[0].identify // 获取当前登录角色，判断是否显示加号按钮
      this.role = infos.roleList[0].name;
    }
    this.userType = this.userInfos.userType
    if (!Util.isLegalToken()) {
      if (this.userType == 'STU') {
        this.$router.push('/stuLogin');
      } else {
        this.$router.push('/manageLogin');
      }
      this.errorMess('请重新登录！')
      return
    }
    this.queryQptions = {
      curPage: 1,
      pageSize: this.$util.pageInitPrams.pageSize
    }
    this.init()
    this.$root.$on('isread', (flag) => {
      this.isreadshowL = flag
    })
    this.$root.$on('HiddenHeadWindow', () => {
      this.copyrightshow = false
      this.noticeshow = false
      this.selectionrole = false
    })
    this.$root.$on('Selectedshortcuts', () => {
      var leftmenus = JSON.parse(sessionStorage.getItem('leftmenus'));
      if (leftmenus && leftmenus[0].modName == 'control') {
        sessionStorage.setItem('headrole', JSON.stringify(leftmenus[0]));
      }
      this.init()
    })
  },
  filters: {
    aim: function (value) {
      if (!value) return ''
      return value.slice(0, 1)
    }
  },
  methods: {
    // 获取除认证中心外 通知公告信息
    getNoticeData() {
      this.ajax({
        ajaxSuccess: (res) => {
          this.notifyData = res.data
          this.notifyShowData = res.data.filter(item => {
            return item.receiveStatus == 'N'
          })
          console.log(this.notifyShowData)
          if (this.notifyShowData && this.notifyShowData.length) {
            this.announcement = this.notifyShowData.reverse()[0]
            this.noticeModal = true
          } else {
            this.noticeModal = false
          }
        },
        ajaxParams: {
          url: '/passport/pc/notify/getNotify/',
          method: 'get'
        }
      })
    },
    // 确认收到通知公告
    acknowledgeReceipt() {
      this.ajax({
        ajaxSuccess: (res) => {
          this.getNoticeData()
          // this.noticeModal = false
        },
        ajaxParams: {
          url: '/passport/pc/notify/receivedNotify/' + this.announcement.id,
          method: 'post'
        }
      })
    },
    // 控制通知公告列表显示和隐藏
    notifyDataChange(e) {
      this.topbarnameshow = false
      e.stopPropagation();
      this.notifyDataShow = !this.notifyDataShow
      this.$emit("setZindex", this.notifyDataShow);
    },
    showNotify(item) {
      this.announcement = item
      this.noticeModal = true
    },
    init() {
      //  头部头像
      let env = this.$store.getters.getEnvPath;
      if (this.userInfos.headPhoto) {
        this.imgSrc = env["http"] + this.userInfos.headPhoto;
      } else {
        this.imgSrc = "";
      }
      let objs = {
        data: this.headerDatas
      }
      this.allroledata = this.$util._.defaultsDeep({}, objs)
      let info = this.$store.getters.getUserInfo
      // 如果是院校登录  才去接收通知公告信息
      if (info.userType === 'SCHOOL') {
        this.getNoticeData()
      }
      var allroledata = JSON.parse(localStorage.getItem('selectMenus' + info.id));
      if (allroledata) {
        this.headerData = allroledata
      }
      let obj = {
        data: this.headerData
      }
      this.headerDatas.map(item => {
        if (item.modName == 'control') {
          this.firstheaderroler = []
          this.firstheaderroler.push(this.$util._.defaultsDeep([], this.headerDatas)[0])
        }
      })
      /* this.vpnHrefs = env["http"] + this.userInfos.headPhoto;*/
      this.queryMenuSuccess(obj)

    },
    // 获取头部所选生源
    queryMenuSuccess(res) {
      // 陕中医
      // sessionStorage.setItem('firstheaderroler', JSON.stringify(this.firstheaderroler));
      // var data2 = JSON.parse(sessionStorage.getItem('headrole'));

      //  v7
      let route = this.$route;
      let matched = route.matched;
      var datas = {}
      let resdata = res.data
      let firstIndex = 0
      let secondIndex = 0
      let thirdIndex = 0
      // 找到刷新页面后头部锁定的菜单setMeusData
      for (var i = 0; i < resdata.length; i++) {
        let item1 = resdata[i]
        if (item1.path == route.path) {
          datas = this.$util._.defaultsDeep({}, item1)
          firstIndex = i
          break;
        } else if (item1.children) {
          for (var k = 0; k < item1.children.length; k++) {
            let item2 = item1.children[k]
            if (item2.path == route.path) {
              datas = this.$util._.defaultsDeep({}, item1)
              secondIndex = k
              break;
            } else if (item2.children) {
              for (var j = 0; j < item2.children.length; j++) {
                let item3 = item2.children[j]
                if (item3.path == route.path) {
                  datas = this.$util._.defaultsDeep({}, item1)
                  thirdIndex = j
                  break;
                } else if (item3.children) {
                  for (var r = 0; r < item3.children.length; r++) {
                    let item4 = item3.children[r]
                    if (item4.path == route.path) {
                      datas = this.$util._.defaultsDeep({}, item1)
                      break;
                    } else {

                    }
                  }
                }
              }
            }
          }
        }
      }
      var data2 = datas

      let currentIndex = 0
      res.data.map((item, index) => {
        item.chosed = true
        if (data2) {
          if (item.modName == data2.modName) {
            item.showtype = true
            currentIndex = index
          } else {
            item.showtype = false
          }
        } else {
          item.showtype = false
        }
        if (data2 && data2.modName == 'control' || !data2) {
          this.firstheaderroler[0].showtype = true
        }
      })
      if (res.data[0]) {
        sessionStorage.setItem('toproleone', JSON.stringify(res.data[0].index));
      }
      this.selectstudentdata = this.$util._.defaultsDeep([], res.data)
      /*  let firstIndex  = 0
        let secondIndex  = 0
        let thirdIndex  = 0*/
      this.studentchoose(this.selectstudentdata[currentIndex], firstIndex, secondIndex, thirdIndex)
      // this.studentchoose(data2)
      /* this.selectstudentdata.map((item, index) => {
         if (item.modName == 'control') {
           this.selectstudentdata.splice(index, 1)
         }

       })*/
    },
    loginOut() {
      //退出登陆
      Util.loginOut(this);
      sessionStorage.clear()
      window.localStorage.removeItem('failuretimes');
      // window.localStorage.removeItem('selectMenus');
      this.$cookie.delete('userName'); // 门户
    },
    show(item) {
      this.operailityData = item;
      this.showModal = true;
      this.$refs.popover4.handleDocumentClick('popover4') //隐藏通知弹出层
      this.$emit("setZindex", true);

    },
    //  修改密码  退出
    clicktopbarnameshow(e) {
      this.copyrightshow = false
      this.selectionrole = false
      this.noticeshow = false
      this.sebanshoow = false
      e.stopPropagation();
      this.topbarnameshow = !this.topbarnameshow;
      this.$emit("setZindex", this.topbarnameshow);
    },
    handleViewSubNav() {
      this.isViewSubNav = !this.isViewSubNav;
      this.$emit("isViewSubNavchange", this.isViewSubNav);
      this.$root.$emit('zhedie', this.isViewSubNav)
      this.$root.$emit('minleft', this.isViewSubNav)
    },
    // 点击头部导航栏  关闭二 三级菜单
    hiddenframe() {
      this.notifyDataShow = false
      this.$emit('closemeaus')
    },
    // 选择生源
    selectstudents(item) {
      this.shows = false;
      item.chosed = !item.chosed
      setTimeout(() => {
        this.shows = true;
      })
    },
    // 点击 技能中心 理论考核  在线学习跳转到第一个菜单
    mergeRouter(modName, firstIndex, secondIndex, thirdIndex) {
      var leftmenus = JSON.parse(sessionStorage.getItem('leftmenus'));
      let firstLevel, secondLevel, mergeRouter;
      leftmenus.map((items, index) => {
        if (items.modName == modName) {
          for (let i = 0; i < items.children.length; i++) {
            let firsts = items.children[secondIndex || 0]
            firstLevel = firsts.modName;
            if (firsts.children) {
              secondLevel = firsts.children[0].modName;
              mergeRouter = '/manage/' + firstLevel + '/' + secondLevel;
              this.$root.$emit('eventName', firsts.children[0])  // 传参
            } else {
              mergeRouter = '/manage/' + firstLevel
              this.$root.$emit('eventName', firsts)  // 传参
            }
            // this.$root.$emit('SelectedActive', modName, items.children[secondIndex || 0].index)
          }
          items.children[secondIndex || 0].yiName = items.name
          this.$root.$emit('changebgcfff', items.children, secondIndex || 0, thirdIndex || 0)
        }
      })
      this.$router.push(mergeRouter);

    },
    testVpn(item, firstIndex, secondIndex, thirdIndex) {
      let that = this
      that.ajaxCreateLoading(true);
      let myPromise = Util.queryData({
        url: this.$globlURLPrefix.process + '/envs',
        method: 'get',
      })();
      myPromise.then(function (res) {
        let responseData = res.data;
        if (Util._.isObject(responseData['status']) && responseData['status']['code'] == 0) {
          that.VPNConnection = true
          that.ajaxCreateLoading(false);
          that.continueNextStup(item, firstIndex, secondIndex, thirdIndex)
        } else {
          that.vpnModal = true
          that.VPNConnection = false
          that.ajaxCreateLoading(false);
          return
        }
      }).catch(function (response) {
        that.vpnModal = true
        that.VPNConnection = false
        that.ajaxCreateLoading(false);
        return
      });
    },

    continueNextStup(item, firstIndex, secondIndex, thirdIndex) {
      this.showtype = false
      this.selectstudentdata.map(ite => {
        ite.showtype = false
      })
      if (this.firstheaderroler[0]) {
        this.firstheaderroler[0].showtype = false
      }
      item.showtype = !item.showtype
      this.selectionrole = false
      window.sessionStorage.removeItem('yijiselected')
      window.sessionStorage.removeItem('erjiselected')
      window.sessionStorage.removeItem('sanjimeauselect')
      if (!item.children || !item.children.length) {
        setTimeout(() => {
          this.$router.push(item.path);
        })
        let obj = {
          data: undefined
        }
        this.$root.$emit('newmeau', obj)
        return;
      } else {
        let obj = {
          data: item.children
        }
        this.$root.$emit('newmeau', obj)
        setTimeout(() => {
          this.showtype = true
        })
      }
      // 点击头部各个生源角色，重新获取左侧菜单
      sessionStorage.setItem('headrole', JSON.stringify(item));
      this.mergeRouter(item.modName, firstIndex, secondIndex, thirdIndex);
      this.$emit("isViewSubNavchange", true);
    },

    // 点击头部各个生源
    studentchoose(item, firstIndex, secondIndex, thirdIndex) {
      if (item.modName == 'examProcessControl') { // 如果点击的是考程控制  先判断是否连接VPN
        // 测试是否连接vpn
        this.testVpn(item, firstIndex, secondIndex, thirdIndex)
      } else {
        this.continueNextStup(item, firstIndex, secondIndex, thirdIndex)
      }
      // this.continueNextStup(item, firstIndex, secondIndex, thirdIndex)
    },
    // 个人档案
    eidtArchives(e) {
      e.stopPropagation();
      this.operailityData = this.userInfo;
      this.editModal = true;
      this.$emit("setZindex", this.topbarnameshow);
    },
    // 修改密码
    eidtPass(e) {
      e.stopPropagation();
      this.operailityData = this.userInfo;
      this.passwordModal = true;
      this.$emit("setZindex", this.topbarnameshow);
    },
    //模态窗操作完成后的回调
    subCallback(target, title, updata) {
      if (this.topbarnameshow) {
        this.topbarnameshow = !this.topbarnameshow
      }
      this.cancel(target);
      if (title) {
        this.successMess(title);
      }
      if (target == 'edit') {
        this.$store.commit('setUserInfo', this);
      }
    },
    cancel(targer) {
      if (this.topbarnameshow) {
        this.topbarnameshow = !this.topbarnameshow
      }
      this[targer + 'Modal'] = false;
    },
  },
  computed: {
    userInfo() {
      let info = this.$store.getters.getUserInfo || {};
      this.userInfos = info;
      if (!Util.isEmptyObject(info)) {
        this.operailityData = info;
        if (info.roleList !== null) {
          this.userType = info.roleList[0].identify;
        }
        //          if (this.isOnce) {
        if (info.auditStatus) {
          if (info.archivesAuditStatus == 'NOT_SUBMIT') {
            this.archivesModal = true;
          }
          if (info.archivesAuditStatus == 'NOT_SUBMIT') { //未提交
            //              if (info.auditStatus == "NOT_SUBMIT") { //未提交
            this.currAuditStatus = '请先完善个人档案！';
            //              } else if (info.auditStatus == "NOT_AUDIT") { //未审核
            //                this.currAuditStatus = "您的档案审核中,请等待!";
            //              } else { //AUDIT_FAILURE  审核拒绝
            //                this.currAuditStatus = "您的档案审核拒绝,请检查并重新填写!";
          }

          // 实习生的基本信息在未审核通过之前一直都要显示修改资料弹窗
          if (this.userType == 'SXS') {
            if (info.auditStatus != 'AUDIT_SUCCESS') {
              this.archivesModal = true;
              if (info.auditStatus == 'NOT_SUBMIT') { //未提交
                this.currAuditStatus = '请先完善个人档案并提交审核！';
              } else if (info.auditStatus == 'NOT_AUDIT') { //未审核
                this.currAuditStatus = '您的档案审核中,请等待!';
              } else { //AUDIT_FAILURE  审核拒绝
                this.currAuditStatus = '您的档案审核被驳回,请检查并重新填写!';
              }
            }
          }

        }

        // 没有弹窗的研究生就加载研究生报到须知
        this.loadYjsbdxz = !this.archivesModal && this.userType == 'YJS';
        //       }

      }
      return info;
    },
  },
  mounted() {
    let that = this;
    this.$nextTick(() => {
      Util.events.addHandler(document, "click", function () {
        that.topbarnameshow = false;
        that.sebanshoow = false;
        // that.$emit("setZindex", false);

      });
    })
    /*
          // v7
          if(this.userInfo.account.id == '-99999'){
            this.timer = setInterval(()=>{
              this.clickNum = 0
            }, 2000);
          }*/
  },
  components: {
    pwd,
    personalInformation,
    showNotice
  },
  beforeDestroy() {
    this.$root.Bus.$off('HiddenHeadWindow')
    clearTimeout(this.timer); // v7
  }
}

</script>
<style>
.span-in span {
  display: inline
}

.sixHeight {
  height: 120px !important;
}

</style>
