<template>
    <div class="calendar-container">
        <el-button type="primary" @click="postSignInRecords">签到</el-button>
        <div class="calendar-body">
            <div v-for="day in days" :key="day.date" class="day"
            :class="{'signed': isSigned(day.date)}">
            {{ day.date }}
            <span class="isSign" v-if="isSigned(day.date)">已签到</span>
            </div>
        </div>
    </div>
</template>
  
<style>
.isSign {
    color: red;
    font-size:12px
}
.calendar {
  width: 300px;
  margin: 0 auto;
  text-align: center;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
}

.day {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.day.signed {
  background-color: #67c23a;
  color: white;
}
</style>

<script>
import dayjs from 'dayjs';
import axios from 'axios';
import {mapState} from 'vuex'
export default {
data() {
    return {
    today:null,
    signedDates: [], // 从后端获取的签到日期数组
    day:0,//今天是第几天
    days:[],//本月有多少天
    month:0,//现在是几月
    year:0//现在是几年
    };
},
computed:{
    ...mapState(['userID'])
},
created() {
    this.today = dayjs()
    this.year=this.today.year()
    this.month=this.today.month()+1
    this.day=this.today.day()
    this.today=this.today.format('YYYY-MM-DD HH:mm:ss');
    this.getDays()
    this.fetchSignInRecords();
},
methods: {
    isRunYear(){
        if (this.year%4==0 || (this.year/100)%4==0) {
            return true
        }
        return false
    },
    getDays(){
        let allDays = [31,28,31,30,31,30,31,31,30,31,30,31]
        if (this.isRunYear()) {
            allDays[1]=29
        }
        for(let i = 1;i<=allDays[this.month-1];++i){
            this.days.push({date:i})
        }
    },
    isSigned(date) {
        console.log('isSignedDate is',this.signedDates);
        return this.signedDates.includes(date);
    },
    toggleSignIn(){
        console.log('click!');
    },
    //获得签到信息
    async fetchSignInRecords() {
    await axios({
    url:'http://localhost:3000/getCanlender',
    params:{
        id:this.userID
    }
    }).then(res=>{
        this.signedDates = res.data.map(item=>{
            return parseInt(item.split('T')[0].split('-')[2])
        })
    }).catch(err=>{
    console.log(err);
    })

    },
    //提交签到
    async postSignInRecords(){
    await axios({
        method:'post',
        url:'http://localhost:3000/signIn',
        data:{
            id:this.userID,
            date:this.today
        }
    }).then(()=>{
        alert('签到成功')
        this.fetchSignInRecords()
    }).catch(err=>{
        alert(err.response.data)
    })
    }
}
};
</script>