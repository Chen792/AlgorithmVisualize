 <template>
  <div class="main">
    <el-container style="height: 100vh; border: 1px solid #eee">
        <MyAside></MyAside>
        <el-container direction="vertical">
            <MyHeader></MyHeader>
            <!-- <MySuanfa></MySuanfa> -->
          <!-- <router-view></router-view> -->
        </el-container>
    </el-container>
  </div>
</template>

 <script>
import MyAside from '../components/MyAside.vue';
import MyHeader from '../components/MyHeader.vue';
export default {
  components: { MyAside,MyHeader },
}
</script> 

<style>




</style>