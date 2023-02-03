<template>
  <iframe frameborder=0 marginheight=0 marginwidth=0 scrolling="auto" :src='getSrc' class="iframeView"></iframe>
</template>
<script>
  export default {
    name:"iframeView",
    props:['url'],
    data(){
      return{
        token: this.$cookie.get('Token') || '',
        getSrc: '',
      }
    },
    methods:{
      getSrcByUrl(){
        let src = '';
        if (this.url){
          src = this.url + (this.url.indexOf('?') > -1 ? '&' : '?') + 'token=' + this.token
        }
        this.getSrc = src
      },
    },
    watch:{
        url(val){
            this.getSrcByUrl()
        },
    },
    created(){
        this.getSrcByUrl()
    },
//    computed:{
//      getSrc(){
//        let src = '';
//        if (this.url){
//          src = this.url + (this.url.indexOf('?') > -1 ? '&' : '?') + 'token=' + this.token
//        }
//        return src
//      }
//    },
  }
</script>

<style lang="scss">
.iframeView{width: 100%;height: 100%;}
</style>
