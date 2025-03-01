<template>
  <div class="login">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
            <el-input v-model.number="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">注册</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import {mapState,mapMutations} from 'vuex'
export default {
    data() {
        var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } 
        callback()
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          username: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          username:[
            {validator: validateUsername,trigger:'blur'}
          ]
        },
        user_id:'',
        user_eamil:''
      };
    },
    computed:{
      ...mapState(['userEmail','userID'])
    },
    methods: {
      ...mapMutations(['updateUserInfo','updateUserID','updateUserEmail']),
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios({
            method:'POST',
            url:'http://localhost:3000/login',
            data:this.ruleForm
          }).then((res) => {
            this.updateUserInfo(this.ruleForm)
            alert('登录成功!')
            this.user_id = res.data[0].user_id
            this.user_email = res.data[0].user_email
            this.updateUserEmail(this.user_email)
            this.updateUserID(this.user_id)
            this.update
            this.$router.push('/main')
          }).catch(error =>{
            alert(error.response.data)
          })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.push('/register')
      }
    }
}
</script>

<style>
    .login {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>