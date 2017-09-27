<style lang="stylus" scoped>
 #app
  width: 1280px
  height: 720px

</style>
<template>
    <div id="app">
        <c-list></c-list>
    </div>
</template>
<script>
 import CList from './CList';
 export default {
     data() {
         return {};
     },

     components: {
         CList
     },

     methods: {
     },

     computed: {},

     watch: {},

     beforeCreated() {
         // init events & lifecycle
     },

     created() {
         // init injections & reactivity
     },

     beforeMount() {
         // handle el -> template -> render
     },

     mounted() {
         // create vm.$el, replace 'el' with it
         this.$nextTick(() => {
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
     }
 }
</script>
