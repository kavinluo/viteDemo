<template>
  <div @click="selectHide">
    <div class="viewFramework-topbar"
         :class="maxIndx ? 'viewFramework-topbar-zindex' : ''">
      <div class="ambuf-console-topbar">
        <div v-if="!headerpage"
             style="text-align: center;margin-top: 100px;">数据请求{{ typeof userInfo.name == 'undefined' ? '失败' : '中……' }}!
        </div>
        <Headers v-if="headerpage" @setZindex="setZindex"
                 @isViewSubNavchange="isViewSubNavchange"
                 @closemeaus="closemeaus"
                 :headerDatas="headerData"
                 :topbarnameshows="topbarnameshow"
                 :copyrightshows="copyrightshow"
                 :noticeshows="noticeshow"
                 :selectionroles="selectionrole"
                 @newmeau="newmeau"></Headers>
      </div>
    </div>
    <div class="viewFramework-body"
         :class="{'viewFramework-sidebar-full': isViewSubNav,'viewFramework-sidebar-mini': !isViewSubNav,'minleft': !minleft, 'leftZero':!Nav}"
         @click="closeelasticframe">
      <div class="sidebar-fold"
           @click="handleViewSubNav"></div>
      <div class="viewFramework-sidebar" v-if="Nav"
           :class="maxMeausIndx?'viewFramework-topbar-zindex':''">
        <div class="sidebar-content"
             :class="maxMeausIndx?'viewFramework-topbar-zindex':''">
          <div class="sidebar-inner"
               :class="maxMeausIndx?'viewFramework-topbar-zindex':''">
            <div v-if="!gotoRouter"
                 style="text-align: center;margin-top: 100px;">
              数据请求{{ typeof userInfo.name == 'undefined' ? '失败' : '中……' }}!
            </div>
            <Left v-if="gotoRouter"
                  :class="maxMeausIndx ? 'viewFramework-topbar-zindex' : ''"
                  @setLeftmeausZindex="setLeftmeausZindex"
                  @isViewSubNavchange="isViewSubNavchange"
                  @clickyijimenu="clickyijimenu"
                  :leftNavData="Nav"
                  :subIndex="subIndex"
                  :dataStructure="dataStructures">
            </Left>

          </div>
        </div>
      </div>
      <!--二级三级菜单-->
      <div class="second-nav"
           v-if="secondlevelflag"
           :class="isViewSubNav ?'leveltwopageleftmax' : 'leveltwopageleftmin'">
        <div id="nav-title"
             class="main-nav-title ng-binding"
             v-text="yijiselectdata.name"></div>
        <div class="ng-isolate-scope"></div>
        <GeminiScrollbar id="leftwrapperids"
                         ref="leftwrapperid"
                         :forceGemini="false"
                         class="fixyiji">
          <div v-for="(item,pIdx) in menusData"
               class="twosidebar-nav"
               :key='pIdx'>
            <router-link class="routerlink-title"
                         :to="item.path"
                         v-if="typeof item.children=='undefined'"
                         @click.native="gotopage(item)"
                         :class="{'erjiseleted': item.index == erjimenuselect}"
                         style="width: 100%;height: 100%;">
              <div class="twonav-icon"
                   data-container="body"
                   data-toggle="tooltip"
                   data-placement="right"
                   :class="{'erjiseleted': item.index == erjimenuselect}"
                   :title="item.name"
                   style="height: 40px;line-height: 40px;">
                <span class="iconfont icon-morenerji">&nbsp;
                </span>
                <span class="twosidebar-title-text ng-binding"
                      v-text="item.name"></span>
              </div>
            </router-link>
            <div class="twosidebar-title"
                 :title="item.name"
                 @click="showAndHide(item)"
                 v-else
                 :class="{'erjiseleted': item.index == erjimenuselect,'twosidebar-nav-fold':item.expand}">
              <span class="iconfont icon-xia"
                    style="position: relative"
                    :class="{'xuanzhuan': item.expand}"></span>
              <span class="twosidebar-title-text ng-binding">{{ item.name }}</span>
            </div>
            <ul class="twosidebar-trans"
                v-if="item.expand&&!item.leaf&&item.children">
              <li class="twonav-item"
                  @click="selectedMenus(item,subitem,subitem.index)"
                  v-for="(subitem,index) in item.children"
                  :key="index">
                <router-link :to="subitem.path">
                  <div class="twonav-icon"
                       data-container="body"
                       data-toggle="tooltip"
                       data-placement="right"
                       :title="subitem.name"
                       style="height: 35px;line-height: 35px">
                    <span class="iconfont icon-morenerji erjicircle"></span>
                    <span class="twonav-title twong-binding"
                          style="float: left"
                          v-text="subitem.name"
                          :class="{'sanjiselected':subitem.index == sanjimeauselect}"></span>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </GeminiScrollbar>
      </div>

      <div class="viewFramework-main"
           @click="closemeau">
        <div v-if="!gotoRouter"
             style="text-align: center;margin-top: 100px;">数据请求{{ typeof userInfo.name == 'undefined' ? '失败' : '中……' }}!
        </div>
        <div v-if="gotoRouter && Nav" id="crumbstyle" :class="{'layout-contentfff':isfff,'layout-contentdce':!isfff}">
          <span style="margin-left: 20px">{{ crumbsdata[crumbsdata.length - 1] }}</span>
          <el-breadcrumb separator=">">
            <!-- 顶部页面提示栏 -->
            <el-breadcrumb-item v-for="(item,index) in crumbsdata" :key="index">{{ item }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <router-view v-if="gotoRouter&&selectedObj && !selectedObj.url || (gotoRouter&&selectedObj=='')"
                     :subNavs="subNavs"
                     :subIndex="subIndex"
                     :dataStructure="dataStructures" class="secondPage"
                     :class="isLeftMenu ? 'isMarginTop' : ''"></router-view>
        <iframe-view v-if="gotoRouter&& selectedObj.url" :url="selectedObj.url"
                     class="secondPage" :class="isLeftMenu ? 'isMarginTop' : ''"></iframe-view>
        <!--        :class="maxIndx ? 'viewFramework-topbar-zindex' : ''"-->
        <!--        :class="{'isMarginTop': Nav}">-->
      </div>
    </div>
    <Modal :mask-closable="false" height="200" v-model="tokenCodeModal" title="对话框标题"
           class-name="vertical-center-modal"
           :width="400">
      <modal-header slot="header" :content="tokenCodeId"></modal-header>
      <div style="height: 300px;text-align: center;margin-top: -10px;font-size: 16px">
        <canvas id="canvass"></canvas>
        <div style="margin-bottom: 10px">初次使用，请使用安卓手机浏览器 <br> 扫描二维码，下载令牌APP</div>
        令牌码：
        <el-input v-model="tokenCode" style="width: 60%;" placeholder="请输入令牌码"></el-input>
        <div style="text-align: center;margin-top: 10px">
          <el-button class="submitBtn" style="width: 290px;" @click="verifyCode">确 定</el-button>
        </div>
      </div>
      <template #footer></template>
    </Modal>
  </div>
</template>
<script>
import headers from './header.vue';
import leftmenus from './leftmenus.vue';
import iframeView from './iframeView.vue';
import QRCode from 'qrcode'
// import {utils} from "@/utils/util";
const utils ={}
// import twolevelmenus from './common/twolevelmenu';
/*
 * 给数据层级设置索引 [{parIdx:0,index:0},……]
 * @param data []  无限极树结构
 */
const structureIndex = {};

function setStructureIndex(data, pobj) {
  if (data.length == 0) {
    return;
  }
  let deepChildren = {
    'pid': [],
    'len': []
  };
  let tempArr = [];
  let count = 0;
  let count1 = 0;
  for (var i = 0, parIdx, index; i < data.length; i++) {
    if (typeof pobj != 'undefined') {
      let len = pobj['len'][count];
      parIdx = (len + count1) - 1 <= i ? (count1 += len) && count++ : count;
    } else {
      parIdx = null;
    }
    data[i]['index'] = i;
    data[i]['expand'] = false;

    structureIndex[data[i]['modName']] = {
      'index': i,
      parIdx: parIdx
    };
    if (typeof data[i].children != 'undefined') {
      deepChildren['pid'].push(i);
      deepChildren['len'].push(data[i].children.length);
      tempArr = tempArr.concat(data[i].children);
    }
  }
  setStructureIndex(tempArr, deepChildren);
}

/*
 * 根据modName取出二级菜单展示数据 {"modName":[{……},{……},……]}
 * @param data []
 * */
function getSubData(data) {
  let tempData = [];
  let dataStructure = {};
  _.forEach(data, function (v, k) {
    if (v.children) {
      tempData.push(v.children);
    }
  });
  tempData = _.flattenDeep(tempData);

  _.forEach(tempData, function (v, k) {
    if (v.modName) {
      dataStructure[v.modName] = v;
    }
  });
  return dataStructure;
}

let Util = null;
export default {
  // props: ['navs', 'dataStructure'],
  data() {
    return {
      QRCode,
      searchmeaushow: true,
      showmeaudata: [],
      keyword: '',
      unread: 'true', // 代表当前有未读的待办事项
      erjiid: '', // 存储当前点击的是哪个二级
      gotoRouter: false,
      headerpage: false,
      routerPath: {},
      homeRouterPath: {},
      Nav: [{}],
      headerData: [],
      subNavs: [{}],
      subIndex: '',
      selectedObj: '',
      dataStructures: [{}],
      isViewSubNav: true,
      secondlevel: '', // 判断点击的一级菜单是否和上次相同
      secondlevelflag: false,
      selected: -1,
      isshow: true,
      isshows: true,
      inittype: true,
      menusData: [],
      topbarnameshow: false,
      noticeshow: false,
      selectionrole: false,
      copyrightshow: false,
      tokenCode: "",
      tokenCodeModal: false,
      tokenCodeId: {id: "tokenCodeModal", title: "令牌码"},
      currentIndex: 0, // 菜单搜索，锁定当前选中
      isLeftMenu: false,
      getMenusData: {
        ajaxSuccess: 'setMeusData',
        ajaxParams: {
          url: '', //this.$globlURLPrefix.passport + '/menu/query-tree-by-user',
          params: {}
        }
      },
      maxIndx: false,
      maxMeausIndx: false,
      timer: null,
      showtowmeaus: false,
      leftTwoNavData: '',
      minleft: true,
      yijiselectdata: '',
      sanjimeauselect: -1,
      searchmeaushowdata: true,
      erjimenuselect: 0,
      crumbsdata: [], // 面包屑导航
      isfff: true,
      QueryDetail: '',
    };
  },
  created() {
    // this.$store.commit('setUserInfo', this); // 再次存一下用户信息
    // this.ajax(this.getMenusData);
    Util = this.$util;
    // var goTo = ''
    /* let infos = this.$store.getters.getUserInfo;
     this.userInfos = infos;*/
    // if (this.userInfo.userType == 'STU') {
    //   goTo = '/stuLogin'
    // } else {
    //   goTo = '/manageLogin'
    // }
    // let goTo = '/login';
    // if (!Util.isLegalToken()) {
    //   this.$router.push(goTo);
    //   this.errorMess('请重新登录！')
    //   return
    // }
    // 单独请求用户信息
    this.keepLife();

    /* if (infos.roleList !== null) {
       this.loginrole = infos.roleList[0].identify // 获取当前登录角色，判断是否显示加号按钮
     }*/
    // this.$root.$on('Hiddensearchmeau', () => {
    //   this.searchmeaushow = true
    // })
    if (JSON.parse(sessionStorage.getItem('sanjimeauselect'))) {
      this.sanjimeauselect = JSON.parse(sessionStorage.getItem('sanjimeauselect')); // 三级菜单选中
    }
    if (JSON.parse(sessionStorage.getItem('erjiselected'))) {
      this.erjimenuselect = JSON.parse(sessionStorage.getItem('erjiselected')); // 二级菜单选中
    }
    // this.$root.$on('minleft', value => {
    //   this.minleft = value
    // })

    // this.$root.$on('minlefttrue', () => {
    //   this.minleft = true
    // })
    // this.$root.$on('newmeau', responseData => {
    //   this.secondlevelflag = false
    //   this.isViewSubNav = true
    //   this.erjimenuselect = -1
    //   this.sanjimeauselect = -1
    //   this.Nav = responseData.data
    //   if (this.Nav) {
    //     this.isLeftMenu = true
    //   } else {
    //     this.isLeftMenu = false
    //   }
    //   console.log(this.Nav, "this.NavIndex");
    // })
    // this.$root.$on('basiceducational', responseData => {
    //   // this.gotoRouter = false
    //   this.Nav = responseData.data
    //   // this.gotoRouter = true
    // })
    // this.$root.$on('clickyijirouter', flag => {
    //   this.isViewSubNav = flag
    //   this.minleft = false
    // })
    // if (this.userInfo.roleList !== null) {
    //   localStorage.setItem('userName', JSON.stringify(this.userInfo.roleList[0].name));
    // }
    // this.$root.$on('changebgcfff', (value, secondIndex, thirdIndex) => {
    //   console.log(value, "valuevaluevalue")
    //   this.isfff = true
    //   this.crumbsdata = []
    //   if (Array.isArray(value)) {
    //     this.crumbsdata[0] = value[secondIndex].yiName
    //     this.crumbsdata[1] = value[secondIndex].name
    //     if (value[secondIndex].children && value[secondIndex].children.length) {
    //       this.crumbsdata[2] = value[secondIndex].children[thirdIndex].name
    //       if (value[0].children[0].children && value[0].children[0].children.length) {
    //         this.crumbsdata[3] = value[0].children[0].children[0].name
    //       } else {
    //         this.passvalue(value[secondIndex].children[thirdIndex])
    //       }
    //     } else {
    //       this.passvalue(value[secondIndex])
    //     }
    //   } else {
    //     this.passvalue(value)
    //     this.crumbsdata[0] = value.parparentName
    //     if (value.parentName) {
    //       this.crumbsdata[1] = value.parentName
    //       if (value.parent) {
    //         this.crumbsdata[2] = value.parent
    //         this.crumbsdata[3] = value.name
    //       } else {
    //         this.crumbsdata[2] = value.name
    //       }
    //     } else {
    //       this.crumbsdata[1] = value.name
    //     }
    //   }
    //   sessionStorage.setItem('crumbsdata', JSON.stringify(this.crumbsdata));
    //   if (!this.crumbsdata.length || !this.crumbsdata[1]) {
    //     this.crumbsdata = this.$store.getters.getCrumbsdata;
    //   }
    //   this.$store.commit('setCrumbsdata', this.crumbsdata);
    // })
    // this.$root.$on('eventName', value => {
    //   this.selectedObj = value
    // })
    // this.$root.$on('openTokenCodeModal', () => {
    //   if (!this.tokenCodeModal) {
    //     const canvas = document.getElementById('canvass')
    //     let networkHttp = this.$store.getters.getEnvPath.networkHttp
    //     // this.QueryDetail = 'http://221.239.23.18:9000/server/static/apk/GK令牌.apk'
    //     this.QueryDetail = networkHttp + 'static/apk/GK令牌.apk'
    //     QRCode.toCanvas(canvas, this.QueryDetail, function (error) {
    //       if (error) console.error(error)
    //     })
    //     this.tokenCodeModal = true
    //   }
    // })
  },
  computed: {
    userInfo() {
      let info = this.$store.getters.getUserInfo || {};
      return info;
    },
  },
  methods: {
    newmeau(res) {
      // this.setMeusData(res)
    },
    // 获取当前用学生路由前缀 还是院校端和认证中心端前缀
    getCurrentRoleRouter() {
      let infos = this.$store.getters.getUserInfo;
      if (infos.userType == 'STU') {
        return '/student';
      } else {
        return '/manage';
      }
    },
    passvalue(value) {
      this.selectedObj = value
    },
    setMeusData(responseData) {
      if (responseData.data[0]) {
        /* for(var i =0; i < responseData.data[0].children.length;i++){
           let item = responseData.data[0].children[i]
           if(!item.children){
             responseData.data[0].children.splice(i,1)
             i--
           }
         }*/
        let data = responseData.data || [];
        if (data.length > 0) {
          data = data[0].children;
          responseData.data.map(item => {
            item.showtowmeaus = false
          })
          // data = data[0].children;
          setStructureIndex(data);
          this.subIndex = data[0]['modName'];
        } else {
        }
        setStructureIndex(data);
        let dataStructure = getSubData(data);
        //将设置完成的structureIndex赋值给 navs
        dataStructure['structureIndex'] = structureIndex;
        // this.Nav = data;\
        // this.headerData = data[1].children
        this.headerData = data
        if (this.headerData.length > 1 && this.headerData[0].modName == 'work') {
          this.headerData.splice(0, 1);
        }
        var headrole = JSON.parse(sessionStorage.getItem('headrole'));
        if (headrole) {
          this.Nav = headrole.children
        } else {
          this.Nav = data[0].children// 先显示一级菜单
        }
        this.subNavs = data;
        this.dataStructures = dataStructure;
        let infos = this.$store.getters.getUserInfo;
        let index = this.getCurrentRoleRouter();
        /* if(infos.userType == 'STU'){
           index = '/student'
         }else {
           index = '/manage'
         }*/
        let myData = data[0].children || [];
        this.setRouterPath(data, true);
        sessionStorage.setItem('leftmenus', JSON.stringify(data));
        let route = this.$route;
        let matched = route.matched;
        //   获得理论考核相关页面信息，url，为了跳转到题库页面
        let currentRoute = matched[matched.length - 1].name;
        if (dataStructure[currentRoute] == undefined) {
          this.selectedObj = {url: ''}//  防止是undefind时没有URL报错
        } else {
          this.selectedObj = dataStructure[currentRoute]
        }
        let currPath = matched[matched.length - 1].path;
        if (myData) {
          for (var i = 0; i < myData.length;) {
            if (typeof myData[i].children != 'undefined') {
              index += '/' + myData[i]['modName'];
              myData = myData[i].children;
            } else {
              index += '/' + myData[i]['modName'];
              break;
            }
          }
        } else {
          index += '/' + data[0]['modName']
        }
        console.log(index, "index")
        this.routerPath['/student/registrationInformation'] = '/student/registrationInformation' // 学生端报名详情
        this.routerPath['/manage/workbench/work'] = '/manage/workbench/work'
        this.routerPath['/manage/workbench/theoryAssess'] = '/manage/workbench/theoryAssess'
        this.routerPath['/manage/internalMenu'] = '/manage/internalMenu'
        let allPath = this.routerPath;
        let goTo = ''
        if (this.userInfo.userType == 'STU') {
          goTo = '/stuLogin'
        } else {
          goTo = '/manageLogin'
        }
        ;
        console.log(typeof allPath[currPath] == 'undefined', "typeof allPath[currPath] == 'undefined'");
        if (typeof allPath[currPath] == 'undefined') {
          this.$router.push(goTo);
        }
        this.$store.commit('setIndexUrl', index);
        setTimeout(() => {
          this.gotoRouter = true;
          this.headerpage = true
        }, 10);
      } else {
        this.headerData = []
        this.Nav = []
        setTimeout(() => {
          this.gotoRouter = true;
          this.headerpage = true
        }, 10);
      }
    },
    handleViewSubNav() {
      this.isViewSubNav = !this.isViewSubNav;
      this.isViewSubNavchange(this.isViewSubNav)
      this.$root.$emit('zhedie', this.isViewSubNav)
      this.$root.$emit('minleft', this.isViewSubNav)
    },
    // 是否折叠左侧菜单
    isViewSubNavchange(flag) {
      this.secondlevelflag = false
      this.isViewSubNav = flag
      this.minleft = true
      this.keyword = ''
      this.searchmeaushow = true
    },
    clickyijimenu(flag) {
      this.isViewSubNav = flag
      if (!this.isViewSubNav && this.secondlevelflag) {
        this.minleft = true
      }
    },
    closemeaus() {
      // this.secondlevelflag = false
      // this.minleft = true
    },

    /*
     * 设置头部导航的z-index
     * @param flag blooean  是否需要设置index
     * */
    setZindex(flag) {
      this.maxIndx = flag;
    },
    setLeftmeausZindex(flag, leftTwoNavData) {
      if (!leftTwoNavData.children) {
        this.secondlevelflag = false
        this.isViewSubNav = true
        return;
      } else {
        leftTwoNavData.children.map(item => {
          item.paridx = leftTwoNavData.index
          if (item.children) {
            item.children.map(Item => {
              Item.paridx = item.index
            })
          }
        })
        this.isViewSubNav = false
      }
      if (this.secondmenusDatalevel == '' || this.secondlevel == leftTwoNavData.id) {
        this.secondlevel = leftTwoNavData.id
        //点击完一级菜单，二级菜单不会再隐藏
        this.secondlevelflag = !this.secondlevelflag
        if (!this.secondlevelflag && !this.isViewSubNav) {
          this.minleft = false
        }
        // this.secondlevelflag = true
        this.menusData = leftTwoNavData.children
      } else {
        if (this.secondlevelflag == '' || this.secondlevelflag == false) {
          //点击完一级菜单，二级菜单不会再隐藏
          this.secondlevelflag = !this.secondlevelflag
          if (!this.secondlevelflag && !this.isViewSubNav) {
            this.minleft = false
          }
          // this.secondlevelflag = true
          this.secondlevel = leftTwoNavData.id
          this.menusData = leftTwoNavData.children
        } else {
          this.menusData = leftTwoNavData.children
          this.secondlevel = leftTwoNavData.id
        }
      }
      this.yijiselectdata = leftTwoNavData
    },
    //点击二级菜单， 如果没有三级菜单
    gotopage(item) {
      this.erjimenuselect = item.index
      this.erjiid = item.id
      item.expand = !item.expand;
      this.menusData.map(Item => {
        Item.erjiselect = false
      })
      item.erjiselect = !item.erjiselect
      this.unread = false
      this.$root.$emit('changebgcfff', item)
      sessionStorage.setItem('erjiselected', JSON.stringify(item.index));
      let currentrouter = item.path.split("/")[0]
      sessionStorage.setItem('currentrouter', JSON.stringify(currentrouter));
      // 点击完二级三级菜单，二三级菜单页面不在隐藏
      // this.secondlevelflag = false
      this.isViewSubNav = false // 让一级页面缩放
    },
    // 控制二级菜单展开合并,点击二级菜单
    showAndHide(item) {
      this.erjimenuselect = item.index
      this.erjiid = item.id
      item.expand = !item.expand;
      this.menusData.map(Item => {
        Item.erjiselect = false
      })
      item.erjiselect = !item.erjiselect
      this.unread = false
      sessionStorage.setItem('erjiselected', JSON.stringify(item.index));
    },
    // 点击三级菜单
    selectedMenus(item, subitem, index) {
      // 点击完二级三级菜单，二三级菜单页面不在隐藏
      // this.secondlevelflag = false
      // console.log(index,"indexindexindex")
      this.isViewSubNav = false // 让一级页面缩放
      this.sanjimeauselect = index
      sessionStorage.setItem('sanjimeauselect', JSON.stringify(index));
      this.$root.$emit('changebgcfff', subitem)
      // if(JSON.parse(sessionStorage.getItem('erjiselected')) != subitem.paridx){
      this.erjimenuselect = subitem.paridx
      // }
    },
    // 点击非一级菜单时，隐藏二三级菜单
    selectHide() {
      // this.secondlevelflag = !this.secondlevelflag
      this.selectionrole = false
      this.noticeshow = false
      this.topbarnameshow = false
      this.copyrightshow = false
    },
    closeelasticframe() {

    },
    // 点击右侧区域，关闭菜单  关闭头部相关弹窗
    closemeau() {
      // this.secondlevelflag = false
      this.$root.$emit('HiddenHeadWindow')
      this.searchmeaushow = true
    },
    /**
     * 获取所有后台配置的路由地址
     * @param data
     * @param first
     * @param parItem
     */
    setRouterPath(data, first, parItem) {
      let index = this.getCurrentRoleRouter();
      for (var i = 0, item; i < data.length; i++) {
        item = data[i];
        if (!item.children || !item.children.length) { //
          item['path'] = index + '/' + item['modName'];
        }
        if (first && !(!item.children || !item.children.length)) {
          item['path'] = index;
          item['level'] = 1;
        } else if (parItem) {
          if (parItem['path'] == -1) {
            item['path'] = parItem['path'] + '/' + item.modName;
          } else {
            item['path'] = parItem['path'] + '/' + item.modName;
          }
          item['level'] = parItem['level'] + 1;
        }
        this.routerPath[item['path']] = item['path'];
        if (typeof item.children != 'undefined' && item.children.length > 0) {
          this.setRouterPath(item.children, false, item);
        }
      }
    },

    // 与服务器保存连接
    keepLife() {
      // console.log('开始心跳检查');
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.getUserInfo();
      }, 1000 * 60 * 15);
    },
    // 当前时间
    getUserInfo() {
      this.ajax({
        ajaxLoading: false,
        ajaxSuccess: () => {
        },
        ajaxParams: {
          url: this.$globlURLPrefix.passport + '/archivesBasicInfo/getUserInfo',
          method: 'get'
        }
      });
    },
    /*   directives: {
         // 注册一个局部的自定义指令 v-focus
         focus: {
           // 指令的定义
           inserted: function (el) {
             // 聚焦元素
             el.querySelector('input').focus()
           }
         }
       },*/
    // 考程验证令牌码
    verifyCode() {
      this.ajax({
        ajaxSuccess: (res) => {
          this.gotoRouter = false
          let otpToken = res.data;
          this.$cookie.set('otpToken', otpToken, 1);
          this.$store.commit('setotpToken', true);
          utils.setAjaxPostToken();
          this.tokenCodeModal = false
          setTimeout(()=>{
            this.gotoRouter = true
          })
        },
        ajaxParams: {
          url: this.$globlURLPrefix.process + '/verifyCode',
          method: 'post',
          data: {
            verifyCode: this.tokenCode,
          }
        }
      })
    },
  },
  components: {
    'Headers': headers,
    'Left': leftmenus,
    iframeView,
    // 'Twolevelmenus': twolevelmenus,
  },
  mounted() {
    let that = this;
    this.$nextTick(() => {
      //    Util.events.addHandler(this.$refs.showLoginMessId, "click", function (e) {
      //      e.stopPropagation();
      //      that.showLoginMess();
      //      that.$refs.popover4.handleDocumentClick('popover4')//隐藏通知弹出层
      //    });

      // Util.events.addHandler(document, "click", function () {
      // });
    })

  },
  beforeDestroy() {
    clearInterval(this.timer);
    console.log('取消心跳检查');
    sessionStorage.clear()
    window.localStorage.removeItem('failuretimes');
    this.$root.Bus.$off('Hiddensearchmeau')
    this.$root.Bus.$off('minleft')
    this.$root.Bus.$off('newmeau')

  }
};

</script>
