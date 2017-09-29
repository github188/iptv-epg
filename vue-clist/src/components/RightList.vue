<template>
  <div>
    <div class="right-list">
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
         updateIndex(direction) {
             console.log('update index: ' + direction);

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

             return channels;
         }
     },

     created() {
         // init injections & reactivity
         this.channels = FateChannels;
     },

     mounted() {
         // create vm.$el, replace 'el' with it
         this.$nextTick(() => {
         });
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
<style lang="stylus" scoped>
 .right-list
  float: left
  display: inline-block
  height: 100%
  width: 235px
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
</style>
