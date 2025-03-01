<!-- 别人对这个算法的一些评论，用axios像后端请求 -->
<template>
  <div class="showContainer" style="width:48%">
    <el-table :data="tableData">
        <el-table-column prop="comment_content" label="评论">
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import bus from '../bus.js'
import axios from 'axios'
export default {
  data() {
      return {
        dialogVisible:false,
        tableData:['123','123'],
        currentPage:1,
        pageSize:3,
        algoName:''
      }
    },
    methods:{
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
      },
    },
    created() {
      bus.$on('algoName',algoName=>{
        this.algoName = algoName
      })
    },
    mounted() {
      axios({
        url:'http://localhost:3000/getComment',
        params:{
          algoName:this.algoName
        }
      }).then(res=>{
        this.tableData=res.data
      }).catch(err=>{
        console.log('err is',err);
      })
    },
    watch:{
      '$route.params.algorithmName': {
      immediate: true,
      handler(newAlgorithmName) {
        this.algorithmName = newAlgorithmName;
        axios({
        url:'http://localhost:3000/getComment',
        params:{
          algoName:this.algoName
        }
      }).then(res=>{
        console.log('res is',res);
        this.tableData=res.data
        console.log('tabledata is',this.tableData);
      }).catch(err=>{
        console.log('err is',err);
      })
      }
    }
    }
}
</script>

<style>
  .showContainer {
    max-height: 240px; /* 设置最大高度 */
  overflow-y: auto; /* 启用垂直滚动 */
  }
</style>