<!-- 我想发布一些算法的评论,评论完用axios发给后端保存 -->
<template>
    <div>
        <textarea name="writeremark" id="writeremark" cols="86" rows="12" v-model="comments"></textarea>
        <el-button type="primary" class="submitBtn" @click="submit">发布</el-button>
    </div>
</template>

<script>
import axios from 'axios'
import bus from '../bus'
import moment from 'moment'
import {mapState} from 'vuex'
export default {
    data(){
        return {
            comments:'',
            algoName:''
        }
    },
    computed:{
        ...mapState(['userInfo'])
    },
    created() {
        bus.$on('algoName',algoname=>{
            this.algoName = algoname
        })
    },
    methods:{
        submit(){
            axios({
                method:'post',
                url:'http://localhost:3000/comment',
                data:{
                    comments:this.comments,
                    algoName:this.algoName,
                    commentDate:moment().format('YYYY-MM-DD'),
                    username:this.userInfo.username
                }
            }).then(res=>{
                this.comments=''
                console.log('res is',res);
            }).catch(err=>{
                console.log('err is',err);
            })
        }
    }
}
</script>

<style scoped>
  textarea {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    resize:none;
  }
  .submitBtn {
    margin-top:5px
  }
</style>