<template>
  <div id="leftwrapperid" ref="leftwrapperid" style="position: relative;height: 100%;width: 100%"
       @click="closetopwindow">
    <div v-for="(item,pIdx) in menusData" class="sidebar-nav"
         :class="{'yijiselected':item.index == yijimenuselect,'yijiselectedFont' : item.index == yijimenuselect}"
         :key='pIdx'>
      <router-link class="sidebar-title" :to="'/manage/'+item.modName"
                   v-if="typeof item.children == 'undefined'"
                   :class="{'yijiselected' : item.index == yijimenuselect,'yijiselectedFont' : item.index == yijimenuselect}"
                   @click.native="toshortcutMenu(item)">
        <div class="twonav-icon" data-container="body" data-toggle="tooltip" data-placement="right"
             :class="{'erjiseleted':item.erjiselect}"
             :title="item.name" style="height: 49px;line-height: 49px;">
          <span class="iconfont" style="margin-left: 20px;margin-right: 13px;font-size: 18px"
                :class="[foldfont?'':'foldfont',item.icon?item.icon:'icon-morenyiji']">&nbsp;</span>
          <span class="sidebar-title-text ng-binding">{{ item.name }}</span>
          <!--<span class="todonumber">3</span>-->
        </div>
      </router-link>

      <div class="sidebar-title" :title="item.name"
           :class="{'yijiselected' : item.index == yijimenuselect,'yijiselectedFont' : item.index == yijimenuselect}"
           v-else @click="showAndHide(item)" style="position: relative">
        <span class="iconfont" style="margin-left: 20px;margin-right: 13px;"
              :class="[foldfont?'':'foldfont', item.icon?item.icon:'icon-morenyiji']">&nbsp;</span>
        <span class="sidebar-title-text ng-binding">{{ item.name }}</span>
        <!--<span class="todonumber">3</span>-->
      </div>
    </div>

  </div>
</template>
<script>
// import twolevelmenus from './twolevelmenu';
import $ from 'jquery';
// import twolevelmenus from './common/twolevelmenu';
let Util = null;
export default {
  props: ["leftNavData", "subIndex", "dataStructure"],
  data() {
    return {
      parIdx: 0,
      selected: -1,
      onlyOnce: true,
      menusData: [{        //每一项
        children: [],
        name: ""
      }],
      leftNavDatas: this.leftNavData,  //每个头部下面不同的数据
      showtowmeaus: false,
      searchmeaushow: true,
      searchmeaudata: '',
      keyword: '',
      showmeaudata: '',
      foldfont: true,
      query: {},
      isViewSubNav: true,
      yijimenuselect: -1,
      structureIndex: {},
    }
  },
  computed: {
    router() {
      let getStrIndex = this.getStructureIndex(2);
      let currSubIdx = getStrIndex.currSubIdx;
      let parIdx = getStrIndex.parIdx;
      this.selectedMenus(currSubIdx, parIdx);
      return this.getRouterName(2);
    }
  },
  created() {
    Util = this.$util;
    this.init();
    this.query = {
      activeName: 'needtodo',
      types: '',
    }
    this.$root.$on('zhedie', value => {
      this.foldfont = value
    })
    this.$root.$on('newmeau', responseData => {
      if (!responseData.data || !responseData.data.length) return; // 如果只有一级菜单
      let data = responseData.data || [];
      // this.setStructureIndexs(data);
      let dataStructure = this.getSubData(data);
      //将设置完成的structureIndex赋值给 navs
      dataStructure['structureIndex'] = this.structureIndex;
      this.leftNavDatas = data;
      this.subNavs = data;
      this.dataStructures = dataStructure;

      let index = '/manage', myData = data[0].children || [];

      this.yijimenuselect = -1
      this.init()
    })
  },
  methods: {
    init() {
      this.getMenusData(this.leftNavDatas);
      this.getyijimenuselect(this.leftNavDatas)
    },
    // 更改刷新页面后一级菜单锁定获取方式
    getyijimenuselect(dataArr, router) {
      let route = ''
      setTimeout(() => {
        if (router) {
          route = router
        } else {
          route = this.$route;
        }
        for (var i = 0; i < dataArr.length; i++) {
          let item1 = dataArr[i]
          if (item1.path == route.path || item1.modName == route.name) {
            this.yijimenuselect = item1.index
            continue
          } else if (item1.children) {
            for (var k = 0; k < item1.children.length; k++) {
              let item2 = item1.children[k]
              if (item2.path == route.path || item2.modName == route.name) {
                this.yijimenuselect = item1.index
                continue
              } else if (item2.children) {
                for (var j = 0; j < item2.children.length; j++) {
                  let item3 = item2.children[j]
                  if (item3.path == route.path || item3.modName == route.name) {
                    this.yijimenuselect = item1.index
                    continue
                  }
                }
              }
            }
          }
        }
        if (JSON.parse(sessionStorage.getItem('yijiselected')) || JSON.parse(sessionStorage.getItem('yijiselected')) == 0) {
          if (!this.yijimenuselect) {
            this.yijimenuselect = JSON.parse(sessionStorage.getItem('yijiselected'));// 一级级菜单选中
          }
        }
      })
      console.log('this.yijimenuselect', this.yijimenuselect)
    },
    setStructureIndexs(data, pobj) {
      const structureIndex = {};
      if (data.length == 0) {
        return;
      }
      let deepChildren = {'pid': [], 'len': []};
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

        structureIndex[data[i]['modName']] = {'index': i, parIdx: parIdx};
        this.structureIndex = structureIndex
        if (typeof data[i].children != 'undefined') {
          deepChildren['pid'].push(i);
          deepChildren['len'].push(data[i].children.length);
          tempArr = tempArr.concat(data[i].children);
        }
      }
      this.setStructureIndexs(tempArr, deepChildren);
    },

    /*
* 根据modName取出二级菜单展示数据 {"modName":[{……},{……},……]}
* @param data []
* */
    getSubData(data) {
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
    },
    /**
     * 获取所有后台配置的路由地址
     * @param data
     * @param first
     * @param parItem
     */
    setRouterPath(data, first, parItem) {
      for (var i = 0, item; i < data.length; i++) {
        item = data[i];
        if (first) {
          item['path'] = '/manage';
          item['level'] = 1;
        } else {
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

    getStructureIndex(n) {
      let currentRoute = ''
      currentRoute = this.getRouterName(n);
      let currSubIdx = this.dataStructure["structureIndex"][currentRoute].index;
      let parIdx = this.dataStructure["structureIndex"][currentRoute].parIdx;
      if (currentRoute != "workbench") {
        parIdx--;
      }
      return {currSubIdx: currSubIdx, parIdx: parIdx};
    },
    getMenusData(data) {              
      //console.log(data)                                       //点击的头部和头部以下的分类
      var data2 = JSON.parse(sessionStorage.getItem('headrole'));
      //console.log(data2)                                        //当前点击的头部

      var toproleoneindex = JSON.parse(sessionStorage.getItem('toproleone'));
      //console.log(toproleoneindex)                             // 0 

      var toproleone = data[toproleoneindex]
      //console.log(toproleone)                                  //点击头部中的第一项

      data.map(Item => {
        if (data2) {
          Item.parparentName = data2.name
        } else {
          if (toproleone) {
            Item.parparentName = toproleone.name
          }
        }
        if (Item.children) {
          Item.children.map(item => {
            // item.path = Item.modName+'/'+item.modName
            item.parentName = Item.name
            if (data2) {
              item.parparentName = data2.name
            } else {
              if (toproleone) {
                item.parparentName = toproleone.name
              }
            }
            if (item.children) {
              item.children.map(ite => {
                // ite.path = Item.modName+'/'+item.modName+'/'+ite.modName
                ite.parent = item.name
                ite.parentName = Item.name
                if (data2) {
                  ite.parparentName = data2.name
                } else {
                  if (toproleone) {
                    ite.parparentName = toproleone.name
                  }

                }
              })

            }
          })
        }
      })
      this.menusData = data;
    },
    showAndHide(item) {
      this.yijimenuselect = item.index
      item.expand = !item.expand
      this.menusData.map(Item => {
        Item.yijiselect = false
      })
      item.yijiselect = !item.yijiselect
      item.expand = true
      item.showtowmeaus = !item.showtowmeaus
      this.$emit("setLeftmeausZindex", item.showtowmeaus, item, item.modName);
      sessionStorage.setItem('yijiselected', JSON.stringify(item.index));
      // 点击完一级菜单就把一级菜单缩放
      this.isViewSubNav = false;
      this.$emit("clickyijimenu", this.isViewSubNav);
      this.foldfont = false
    },
    // 点击快捷菜单  改变背景颜色(只有一级菜单)
    toshortcutMenu(item) {
      this.yijimenuselect = item.index
      this.$root.$emit('changebgcfff', item)
      item.expand = !item.expand
      this.menusData.map(Item => {
        Item.yijiselect = false
      })
      item.yijiselect = !item.yijiselect
      item.expand = true
      item.showtowmeaus = !item.showtowmeaus
      this.$emit("setLeftmeausZindex", item.showtowmeaus, item);
      sessionStorage.setItem('yijiselected', JSON.stringify(item.index));
      // sessionStorage.setItem('yijiselected', JSON.stringify(item));
      // 点击完一级菜单就把一级菜单缩放
      // this.isViewSubNav = false;
      // this.$emit("clickyijimenu", this.isViewSubNav);
      // this.foldfont = false
      this.$root.$emit('minlefttrue')
    },
    selectedMenus(currSubIdx, parIdx) {
      this.selected = currSubIdx;
      this.parIdx = parIdx;
    },
    getRouterName(n) {
      let len = 0;
      let route = this.$route;
      let matched = route.matched
      if (n != 0) {
        len = matched.length - n;
      }
      let currentRoute = matched[len].name;
      return currentRoute;
    },
    searchmeau() {
      this.searchmeaushow = false
      this.searchmeaudata = []
      this.leftNavDatas.map(Item => {
        Item.children.map(item => {
          item.children.map(items => {
            this.searchmeaudata.push(items)
          })
        })
      })
    },
    // 点击左侧区域，关闭头部已打开窗口
    closetopwindow() {
      this.$root.$emit('HiddenHeadWindow')
      this.$root.$emit('Hiddensearchmeau')
    },

    /*
* 给数据层级设置索引 [{parIdx:0,index:0},……]
* @param data []  无限极树结构
*/
  },
  watch: {
    keyword(val) {
      if (val == "") {
        this.searchmeaushow = false
      }
    },
    $route: 'init'
  },
  mounted() {
    Util = this.$util;

  },
  components: {
    // 'Twolevelmenus': twolevelmenus,
  },
  beforeDestroy() {
    this.$root.Bus.$off('newmeau')
    this.$root.Bus.$off('zhedie')
  }
}
</script>
<style>
/* .searchmeau {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #008cf8;
  box-shadow: 0px 0px 15px 0px rgba(24, 111, 204, 0.07);
  position: absolute;
  left: 10px;
  bottom: 10px;
  line-height: 40px;
  text-align: center;
} */

</style>
