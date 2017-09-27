<style lang="stylus" scoped>
 .clist
  display: inline-block
  height: 100%
  width: 235px
  margin-left: 45px
  background-color: #856B52
  .top, .bottom
    width: 227px
    height: 59px
    color: #856B52
    margin-bottom: 2px
    background-color: #0E1619
    text-align: center
    line-height: 59px
  .top
    postion: relative
  ul
    li
      width: 227px
      margin-bottom: 2px
      background-color: #0E1619
      list-style: none
      height: 50px
      color: #A4A5A7
      padding: 4px 0
      .info
        height: 48px
        background-color: #0E1619
        span
          display: inline-block
          height: 100%
          color: #AAACAB
          font-size: 28px
          line-height: 48px
        .no
          width: 20%
          display: block
          float: left
          text-align: center
        .name
          width: 80%
          display: inline-block
          float: right
          text-align: left
          text-indent: 5px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
    .focus
      background-color: #856B52
      .info
        background-color: #856B52

 .right-list
   width: 950px
   height: 100%
   display: inline-block
   position: absolute
   left: 280px
   background-color: red
</style>
<template>
    <div>
        <div class="clist">
            <div class="top" v-show="isTop">
                上箭头
            </div>
            <ul>
                <li class="row"
                    v-for="(item, index) in filterChannels"
                    :class="{ focus: index === dataIndex % rows }"
                >
                    <div class="info">
                        <span class="no">
                            {{ dataIndex - Math.floor(dataIndex % rows) + index + 1 }}
                        </span>
                        <span class="name">{{ item.ChannelName }}</span>
                    </div>
                </li>
            </ul>
            <div class="bottom" v-show="isBottom">
                下箭头
            </div>
        </div>
        <div class="right-list">

        </div>
    </div>

</template>
<script>
 import FateChannels from '../channel-datas.js';
 export default {
     data() {
         return {
             rows: 10,
             channels: [],
             isTop: true,
             isBottom: true,
             dataIndex: 0,
             zone: 0
         };
     },
     components: {},

     methods: {
         eventHandler(keycode) {
             console.log(keycode);
             switch (keycode) {
                 case 38: this.move(1); break;
                 case 40: this.move(-1); break;
                 case 37: this.horiMove(1); break;
                 case 39: this.horiMove(-1); break;
                 default: break;
             }
         },

         leftMove(direction) {
             let count = this.channels.length;

             if (direction !== 1 && direction !== -1) {
                 return false;
             }

             // 焦点在第一页第一行，不响应上键
             if ( direction > 0 && this.dataIndex <= 0 ) {
                 return false; // 上到头了
             }

             if (direction < 0 && this.dataIndex >= this.channels.length - 1) {
                 return false;
             }

             (direction > 0 ? this.dataIndex-- : this.dataIndex++);
         },

         rightMove() {},

         horiMove(direction) {
             if (direction === 1) {
                 this.zone = 0;
             } else if (direction === -1) {
                 this.zone = 1;
             }
             console.log(direction === 1 ? 'left' : 'right', this.zone === 0 ? 'left' : 'right');
         },

         move(direction) {
             if (this.zone === 0) {
                 this.leftMove(direction);
             } else {
                 this.rightMove(direction);
             }
             return true;
         }
     },

     computed: {
         filterChannels: function () {
             let start = this.dataIndex - Math.floor(this.dataIndex % this.rows);
             let len = this.channels.length;
             let last = len - start;
             let count = (last >= this.rows ? this.rows : last);

             // control the bottom arrow show or hide
             if (count < this.rows || start + this.rows >= len) {
                 this.isBottom = false;
             } else {
                 this.isBottom = true;
             }

             let channels = this.channels.slice(start, start + count);

             console.log('next rows: ' + count + ', start: ' + start + ', last: ' + last);
             console.log(channels, channels.length, this.channels.length);

             return channels;
         }
     },

     watch: {},

     beforeCreated() {
         // init events & lifecycle
     },

     created() {
         // init injections & reactivity
         this.channels = FateChannels;

     },

     beforeMount() {
         // handle el -> template -> render
     },

     mounted() {
         // create vm.$el, replace 'el' with it
         this.$nextTick(() => {
             window.onkeydown = (event) => {
                 let e = event ? event : window.event;
                 let keycode = e.which ? e.which : e.keyCode;
                 this.eventHandler(keycode);
                 return false;
             };
         });
     },

     beforeUpdate() {
         // data changes, before update
     },

     updated() {
         // vdom re-render and patch
     },

     beforeDestroy() {
         // when vm.$destroy called
     },

     destroyed() {
         // teardown watchers, child-comp, event-listeners
     },

     directives: {
         focus(el, binding) {
             if (binding.value) {
                 el.classList.add('focus');
             } else {
                 el.classList.remove('focus');
             }
         }
     }
 }
</script>
