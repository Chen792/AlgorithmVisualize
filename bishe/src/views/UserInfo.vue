<template>
  <el-container>
    <el-container>
      <el-header style="height:200px">
        <div class="HeaderOp">
          <a href="" @click.prevent="returnAlgo" class="btn">返回</a>
          <a href="" @click.prevent="dialogVisible=true" class="btn">修改个人信息</a>
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>修改个人信息</span>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
              </el-form-item>
              <el-form-item>       
                <el-button @click="submitForm('ruleForm')">确定</el-button>
                <el-button @click="dialogVisible=false">返回</el-button>
              </el-form-item>
            </el-form>
  
          </el-dialog>
          <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="50%"
            :before-close="handleClose">
          <span>编辑评论内容</span>
          <el-form status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="评论" prop="comment">
                <el-input type="textarea" resize="none" v-model="newComment" rows="15" cols="75"></el-input>
              </el-form-item>
              <el-form-item>       
                <el-button @click="changeComment">确定</el-button>
                <el-button @click="editDialogVisible=false">返回</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>        
        </div>
        <div class="HeaderInfo">
          <img src="../assets/avatar.jpg">
          <div class="userInfo">
            <div class="username">用户名 {{ userInfo.username }}</div>   
            <div class="email">邮箱: {{ userEmail }} </div>    
          </div>
        </div>
  
      </el-header>
      
      <el-main class="allMain">
       <!-- 发布过的评论 -->
       <div class="leftMain">
        发布过的评论:
        <el-table
      :data="dataToShow.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%">
      <el-table-column
        label="日期"
        prop="comment_date">
      </el-table-column>
      <el-table-column
        label="算法名称"
        prop="algo_name">
      </el-table-column>
      <el-table-column
        label="评论内容"
        prop="comment_content">
      </el-table-column>
      <el-table-column
        align="right">
        <template v-slot:header="{ }">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入算法名称搜索"/>
        </template>
        <template v-slot:default="{ $index, row }">
          <el-button
            size="mini"
            @click="handleEdit($index, row)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete($index, row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size="8"
          :total="this.tableData.length"
          @current-change="handleCurrentChange">
        </el-pagination>
       </div>
       <div class="rightMain">
        <canvas ref="pieChart"></canvas>
        <MyCanlender></MyCanlender>
       </div>
      </el-main>
    </el-container>
  </el-container>
</template>
  
<style scoped>
  .allMain {
    display: flex;
    justify-content: space-between;
    align-items: top;
    height: 500px;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .leftMain {
    width: 50%;
    margin-right: auto;
    height: 100%;
  }
  .rightMain {
    width: 50%;
    margin-left:auto;
    height: 100%;
  }
  .HeaderOp {
    display: flex;
    align-items: flex-start;
    justify-content:left;
  }
  .HeaderOp > * {
    margin-right:20px
  }
  .btn {
    display: flex;
    justify-content: left;
    font-size: 20px;
    color: white;
    text-decoration: none;
  }
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
  .username {
    vertical-align: top;
    color:white;
    font-size:24px;
    margin-left:20px;
    font-weight:bold
  }
  .email {
    vertical-align: top;
    color:white ;
    font-size:16px;
    margin-left:20px;
  }
  .HeaderInfo {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  
  .userInfo {
    display: flex;
    flex-direction: column;
    margin-left: 10px; /* 图片和文本之间的间距 */
  }
  
  .userInfo div {
    margin-bottom: 5px; /* 每行之间的间距 */
  }
</style>
  
<script>
var myChart;
  import * as echarts from 'echarts'
  import {mapState,mapMutations} from 'vuex'
  import axios from 'axios'
  import MyCanlender from '@/components/MyCanlender.vue';
  //用户名，手机号，邮箱，生日日期，头像
  export default {
    data() {
      var validateUsername = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入用户名'));
          } 
          callback()
        };
      return {
        editDialogVisible:false,
        dialogVisible:false,
        tableData:[],
        currentPage:1,
        pageSize:8,
        ruleForm:{
          username:'', 
          email:''         
        },
        rules: {
          username:[
            {validator: validateUsername,trigger:'blur'}
          ],
        },
        imageUrl:'',
        search:'',
        comment:'',
        newComment:'',
        id:'',
        chart: null,
        topComments: []
      }
    },
    methods:{
      ...mapMutations(['updateUserInfo']),
      returnAlgo(){
        this.$router.replace('/main')
      },
      async getMostComment(){
        try {
          console.log('id is',this.userID);
          await axios({
            url:'http://localhost:3000/getMostComment',
            params:{
              id:this.userID
            }
          }).then(res=>{
            let data = res.data
            this.topComments = data.map(item=>({
              value: item.comment_count,
              name: item.algo_name
            }))
            this.initPieChart()
          }).catch(err=>{
            console.log(err);
          })
          
        } catch (error) {
          console.error('Error fetching top comments:', error);
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {});
      },
      handleCurrentChange(newPage) {
        this.currentPage = newPage;
      },
      submitForm(formName){
        console.log('denglu',this.$refs);
        this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            method:'post',
            url:'http://localhost:3000/changeInfo',
            params:{
              oldname:this.userInfo.username,//旧名字
              username:this.ruleForm.username//新名字
            }
          }).then(()=>{
            this.userInfo.username=this.ruleForm.username
          }).catch(err=>{
            console.log(err);
          })
          this.dialogVisible=false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      },
      handleEdit(index, row) {
        this.editDialogVisible=true;
        this.id = row.comment_id;
        this.comment=row.comment_content
        this.newComment = this.comment
      },
      changeComment(){
        axios({
          method:'post',
          url:'http://localhost:3000/changeComment',
          data:{
            newData:this.newComment,
            comment_id:this.id
          }
        }).then(()=>{
          this.getUserComments(this.userID)
          alert('修改成功')
          this.editDialogVisible=false
        }).catch(err=>{
          console.log('err',err);
        })
      },
      handleDelete(index, row) {
        axios({
          method:'post',
          url:'http://localhost:3000/deleteComment',
          data:{
            comment_id:row.comment_id
          }
        }).then(()=>{
          this.getUserComments(this.userID)
          alert('删除成功')
        }).catch(err=>{
          console.log('err',err);
        })
      },
      getUserComments(userID){
        axios({
        url:'http://localhost:3000/userInfoComments',
        params:{
          user_id:userID
        }
      }).then(res=>{
        let data = res.data
        data.map(item=>{
          const date = new Date(item.comment_date);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const dateStr = date.toLocaleDateString(options);
          item.comment_date=dateStr
        })
        this.tableData=data
      }).catch(err=>{
        console.log('err',err);
      })
      },
      initPieChart() {
      const chartDom = this.$refs.pieChart;
      chartDom.width=708
      chartDom.height=250
      myChart = echarts.init(chartDom);
      myChart.setOption({
        title: {
          text: '评论的算法',
          textStyle:{
            fontSize:14
          },
          left:'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          itemGap: 10,
          textStyle: {
            fontSize: 12
          },
          left:'left'
        },
        series: [
          {
            center: ['50%', '60%'],  
            name: '数据来源于',
            type: 'pie',
            radius: '55%',
            data:this.topComments,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            tooltip:true
          }
        ]
      });
      // 将图表实例赋值给 data 属性
      this.chart = myChart;
    }

    },
    mounted() {
      this.getUserComments(this.userID)
      this.getMostComment()
    },
    computed:{
      ...mapState(['userInfo','userEmail','userID']),
      oldname:function(){
        return this.ruleForm.username
      },
      dataToShow(){
        console.log(this.search);
        return this.tableData.filter(item => item.algo_name.includes(this.search));
      }
    },
    components:{
      MyCanlender
    }
  };
</script>