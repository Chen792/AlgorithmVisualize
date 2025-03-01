<template>
  <div id="app">

    <keep-alive :include="['login','/^main/','register']">
      <router-view></router-view>    
    </keep-alive>

  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
  #app {
    height:100vh
  }
</style>
