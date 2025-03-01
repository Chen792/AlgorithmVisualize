<template>
     <div>
    <el-header style="text-align: right; font-size: 16px">
        <router-link class="header-link" to="/userinfo"> {{ this.userInfo.username }} </router-link>
    </el-header>
    <keep-alive include="userinfo">
        <router-view></router-view>     
    </keep-alive>
       
    </div> 
</template>

<script>
import {mapState} from 'vuex'
export default {
    computed:{
        ...mapState(['userInfo'])
    }
}
</script>

<style>
.header-link {
    color:black;
    text-decoration: none;
}
.el-header {
background-color: #B3C0D1;
color: #333;
line-height: 60px;
}
</style>